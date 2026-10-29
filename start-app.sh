#!/usr/bin/env bash
# GreenLedger - 1-Click Launch for macOS & Linux
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
if command -v open >/dev/null 2>&1; then
  open "$DIR/dist/index.html"
elif command -v xdg-open >/dev/null 2>&1; then
  xdg-open "$DIR/dist/index.html"
else
  echo "Opening dist/index.html in default browser..."
fi
