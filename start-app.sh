#!/usr/bin/env bash
# GreenLedger - 1-Click Launch for macOS & Linux
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
TARGET="$DIR/launch-app.html"
if [ ! -f "$TARGET" ]; then
  TARGET="$DIR/dist/index.html"
fi

if command -v open >/dev/null 2>&1; then
  open "$TARGET"
elif command -v xdg-open >/dev/null 2>&1; then
  xdg-open "$TARGET"
else
  echo "Opening $TARGET in default browser..."
fi
