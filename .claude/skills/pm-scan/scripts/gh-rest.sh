#!/usr/bin/env bash
# Minimal GitHub REST client for /pm-scan: curl + jq, no gh CLI.
#
#   gh-rest.sh GET    <path>              one page, raw JSON
#   gh-rest.sh GETALL <path>              every page, merged into one JSON array
#   gh-rest.sh POST|PATCH <path> <file>   send <file> (JSON) as the request body
#   gh-rest.sh DELETE <path>
#
# <path> is relative to https://api.github.com/, e.g. "repos/<owner>/<repo>/issues".
# Auth: GITHUB_TOKEN or GH_TOKEN when set. Otherwise the request goes out unauthenticated,
# which works in Claude Code cloud sessions (the egress proxy adds the credentials).
set -euo pipefail

method=${1:?method}
path=${2:?path}
token=${GITHUB_TOKEN:-${GH_TOKEN:-}}

call() {
  local args=(-sS --fail-with-body -X "$1"
    -H 'Accept: application/vnd.github+json'
    -H 'X-GitHub-Api-Version: 2022-11-28')
  [[ -n $token ]] && args+=(-H "Authorization: Bearer $token")
  [[ -n ${3:-} ]] && args+=(-H 'Content-Type: application/json' --data-binary "@$3")
  curl "${args[@]}" "https://api.github.com/$2"
}

case $method in
  GET | DELETE) call "$method" "$path" ;;
  POST | PATCH) call "$method" "$path" "${3:?json body file}" ;;
  GETALL)
    sep='?'
    [[ $path == *\?* ]] && sep='&'
    page=1
    tmp=$(mktemp -d)
    trap 'rm -rf "$tmp"' EXIT
    while :; do
      call GET "${path}${sep}per_page=100&page=${page}" >"$tmp/$page.json"
      [[ $(jq length "$tmp/$page.json") -lt 100 ]] && break
      page=$((page + 1))
    done
    jq -s add $(seq -f "$tmp/%g.json" 1 "$page")
    ;;
  *)
    echo "unsupported method: $method" >&2
    exit 2
    ;;
esac
