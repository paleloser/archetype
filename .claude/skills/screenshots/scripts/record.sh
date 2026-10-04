#!/usr/bin/env bash
# record.sh <recording.js>
#
# Run a screen recording with the simulated cursor from recording.js. The recording script is a
# function of the page and the cursor, written like any run-code script:
#
#   async (page, cursor) => {
#     await cursor.install({ mode: 'pointer' })   // or 'touch' for the vertical, phone-width cut
#     await page.goto(...)                        // off camera: set the stage
#     await page.screencast.start({ path, size })
#     await cursor.click(page.getByRole('link', { name: '...' }))
#     ...
#     await page.screencast.stop()
#   }
#
# See references/driving-the-app.md ("Recording") for how to write one. Run from `webapp/`.
set -euo pipefail
. "$(dirname "$0")/lib.sh"

[ $# -eq 1 ] && [ -f "$1" ] || { echo 'usage: record.sh <recording.js>' >&2; exit 2; }

run_code <<EOF
async page => {
  const cursor = ($(cat "$(dirname "$0")/recording.js"))(page)
  const recording = $(cat "$1")
  return recording(page, cursor)
}
EOF
