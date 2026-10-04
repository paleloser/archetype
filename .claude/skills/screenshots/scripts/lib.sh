# shellcheck shell=bash
# Shared by nav.sh and shot.sh. Source it, don't run it.
#
# `playwright cli run-code` evaluates a module in a context with no `process`, so parameters
# cannot be passed through the environment: every script here templates its values into a
# generated file instead. That is the reason for all the quoting care below.

# Refuse selectors that would break out of the single-quoted JS string we generate. Attribute
# selectors can use double quotes — [data-testid="x"] — so this costs nothing in practice.
js_string() {
  case "$1" in
    *\'*|*\\*)
      echo "selector may not contain a quote or a backslash: $1" >&2
      exit 2 ;;
  esac
  printf '%s' "$1"
}

# Write the given stdin to a temp file, run it, print what it returned, clean up.
run_code() {
  local script
  script="$(mktemp -t shot.XXXXXXXX)"
  mv "$script" "$script.js"
  script="$script.js"
  cat > "$script"
  # Echo back everything but the "### Ran Playwright code" block: the result and any error and
  # call log are what matter, and the echoed source is the script we just wrote.
  local status
  npx playwright cli run-code --filename="$script" | awk '
    /^```js/ { block = 1; next }
    block && /^```/ { block = 0; next }
    /^### Ran Playwright code/ { next }
    !block'
  status="${PIPESTATUS[0]}"
  rm -f "$script"
  return "$status"
}
