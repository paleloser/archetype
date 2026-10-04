#!/usr/bin/env bash
# setup.sh [--locale <locale>] [--theme light|dark]
#
# Prerequisites for the `screenshots` skill in one call: browser, webapp, backend, demo data,
# saved session, viewport, locale and theme, as configured in ../project.env. Run from the
# webapp directory.
#
# What it starts is left running in the background, printed, and recorded so that
# scripts/teardown.sh can stop exactly that at the end of the run. It never seeds and never logs
# in — see references/driving-the-app.md for why those two stay human-driven.
set -euo pipefail

here="$(cd "$(dirname "$0")" && pwd)"
root="$(git rev-parse --show-toplevel)"
# shellcheck source=../project.env
. "$here/../project.env"

locale=''
theme='light'

while [ $# -gt 0 ]; do
  case "$1" in
    --locale) locale="$2"; shift 2 ;;
    --theme) theme="$2"; shift 2 ;;
    *) echo "unknown option: $1" >&2; exit 2 ;;
  esac
done

# What this script starts is recorded here, and only that is what teardown.sh stops: a webapp or
# backend the human already had running is theirs, and is left alone.
state="$root/.screenshots/.started"
mkdir -p "$(dirname "$state")"
touch "$state"
started=()

# Runs a command in the background in a process group of its own and records it. The group is
# what teardown.sh signals, so the children (next-server, a forked JVM) go down with it.
# `set -m` rather than setsid, which macOS doesn't ship.
start_group() {
  local name="$1" log="$2" pid
  shift 2
  set -m
  "$@" >"$log" 2>&1 &
  pid=$!
  set +m
  disown "$pid"
  echo "$name $pid" >>"$state"
}

probe() { curl -s -o /dev/null -w '%{http_code}' -m 3 "$1" || true; }

wait_for() {
  local url="$1" name="$2" tries="$3"
  local i
  for ((i = 0; i < tries; i++)); do
    [ "$(probe "$url")" != '000' ] && return 0
    sleep 2
  done
  echo "$name never answered at $url" >&2
  return 1
}

# 1. Chromium. A no-op once installed, so it is cheaper to run than to check.
npx playwright install chromium >/dev/null 2>&1 || true

# 2. The webapp.
if [ "$(probe "$WEBAPP_URL")" = '000' ]; then
  start_group webapp /tmp/screenshots-webapp.log bash -c 'cd "$1" && exec $2' _ "$root/$WEBAPP_DIR" "$WEBAPP_START"
  started+=("webapp — $WEBAPP_START, /tmp/screenshots-webapp.log")
fi

# 3. The backend, with BACKEND_ENV applied (outgoing notifications off).
if [ -n "$BACKEND_START" ] && [ "$(probe "$BACKEND_URL")" = '000' ]; then
  if [ -n "$COMPOSE_FILE" ]; then
    # Without this the first failure is docker's own socket error, which reads like a
    # misconfiguration rather than "the daemon is not running".
    if ! docker info >/dev/null 2>&1; then
      echo 'The Docker daemon is not running, so the database and the backend cannot start.' >&2
      echo 'Start it, wait for `docker info` to answer, and run this script again.' >&2
      exit 1
    fi
    compose=(docker compose -f "$root/$COMPOSE_FILE")
    if [ -z "$("${compose[@]}" ps --status running --quiet)" ]; then
      "${compose[@]}" up -d >/dev/null
      echo 'compose' >>"$state"
      started+=("database — docker compose -f $COMPOSE_FILE")
    fi
  fi
  start_group backend /tmp/screenshots-backend.log bash -c 'cd "$1" && exec env $2 $3' _ "$root/$BACKEND_DIR" "$BACKEND_ENV" "$BACKEND_START"
  started+=("backend — $BACKEND_START, /tmp/screenshots-backend.log")
fi

# Both are slow to boot, so wait on them concurrently instead of one after the other.
wait_for "$WEBAPP_URL" 'webapp' 45 &
webapp_wait=$!
backend_wait=''
if [ -n "$BACKEND_START" ]; then
  wait_for "$BACKEND_URL" 'backend' 150 &
  backend_wait=$!
fi
wait "$webapp_wait"
[ -z "$backend_wait" ] || wait "$backend_wait"

# 4. Demo data — verified, never created here: seeding is a deliberate act for a human.
seeded='unchecked'
if [ -n "$SEED_CHECK" ]; then
  seeded="$(cd "$root" && bash -c "$SEED_CHECK" 2>/dev/null || echo 0)"
  if [ "${seeded:-0}" -lt 1 ] 2>/dev/null; then
    echo 'The demo data is not there.' >&2
    echo "Ask the human to seed it (${SEED_DOCS:-see SEED_DOCS in project.env}) and stop here." >&2
    exit 1
  fi
fi

# 5. Session. A missing one is a stop, not a workaround: hosted login pages cannot be scripted,
#    so the skill opens a browser and hands it over instead.
if [ -n "$SESSION_FILE" ] && [ ! -f "$SESSION_FILE" ]; then
  echo "No saved session at $SESSION_FILE." >&2
  echo 'Open the browser, hand it to the human to log in, then state-save. Stopping.' >&2
  exit 1
fi

# The pixel density is fixed when the browser context is created and cannot be changed on an open
# one, so a browser left over from an earlier run (possibly at 1x) is closed and reopened with the
# skill's config: 2x device pixels, or every capture looks soft on a HiDPI screen.
npx playwright cli close >/dev/null 2>&1 || true
npx playwright cli open --config="$here/cli.config.json" >/dev/null
grep -qx 'browser' "$state" || echo 'browser' >>"$state"
[ -z "$SESSION_FILE" ] || npx playwright cli state-load "$SESSION_FILE" >/dev/null

# 6. Locale, theme and extras, all of which have to be in place before the app's first paint.
npx playwright cli goto "$WEBAPP_URL" >/dev/null
npx playwright cli localstorage-set "$THEME_STORAGE_KEY" "$theme" >/dev/null
[ -z "$locale" ] || npx playwright cli cookie-set "$LOCALE_COOKIE" "$locale" >/dev/null
for pair in $EXTRA_LOCAL_STORAGE; do
  npx playwright cli localstorage-set "${pair%%=*}" "${pair#*=}" >/dev/null
done

echo "ready: locale=${locale:-default} theme=$theme demo-data=$seeded"
if [ ${#started[@]} -eq 0 ]; then
  echo 'started: nothing, everything was already up'
else
  for s in "${started[@]}"; do echo "started: $s"; done
fi
echo 'next: scripts/nav.sh <url> before every capture, then scripts/shot.sh'
echo 'when done (or when stopping early): scripts/teardown.sh'
