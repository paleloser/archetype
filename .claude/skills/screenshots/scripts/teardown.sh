#!/usr/bin/env bash
# teardown.sh
#
# Stops what setup.sh started for the `screenshots` skill, and nothing else: the process groups
# of the webapp and the backend it launched, the compose services if it brought them up, and the
# browser. Anything that was already running when setup.sh looked is not in its record, so it is
# left alone. Run from the webapp directory, at the end of every run — including one that stopped
# early.
set -euo pipefail

here="$(cd "$(dirname "$0")" && pwd)"
root="$(git rev-parse --show-toplevel)"
# shellcheck source=../project.env
. "$here/../project.env"
state="$root/.screenshots/.started"

if [ ! -s "$state" ]; then
  echo 'stopped: nothing, setup.sh has not started anything'
  rm -f "$state"
  exit 0
fi

# TERM first so the servers shut down cleanly; KILL whatever is still there after ~20s.
stop_group() {
  local name="$1" pgid="$2" i
  if ! kill -0 -- "-$pgid" 2>/dev/null; then
    echo "stopped: $name (already gone)"
    return
  fi
  kill -TERM -- "-$pgid" 2>/dev/null || true
  for ((i = 0; i < 20; i++)); do
    kill -0 -- "-$pgid" 2>/dev/null || { echo "stopped: $name"; return; }
    sleep 1
  done
  kill -KILL -- "-$pgid" 2>/dev/null || true
  echo "stopped: $name (killed after 20s)"
}

while read -r name pgid; do
  case "$name" in
    webapp|backend) stop_group "$name" "$pgid" ;;
    compose)
      docker compose -f "$root/$COMPOSE_FILE" stop >/dev/null 2>&1 || true
      echo 'stopped: database' ;;
    browser)
      npx playwright cli close >/dev/null 2>&1 || true
      echo 'stopped: browser' ;;
  esac
done <"$state"

rm -f "$state"
