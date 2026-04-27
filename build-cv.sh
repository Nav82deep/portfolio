#!/usr/bin/env bash
# Regenerate Navdeep_Rana_CV.pdf from resume.html using headless Chrome.
# Run manually:  ./build-cv.sh
# Or it runs automatically via .git/hooks/pre-commit when resume.html changes.
set -euo pipefail

cd "$(dirname "$0")"

CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
if [ ! -x "$CHROME" ]; then
  echo "❌ Chrome not found at $CHROME — cannot rebuild CV."
  exit 1
fi

echo "📄 Rebuilding Navdeep_Rana_CV.pdf from resume.html…"
"$CHROME" \
  --headless \
  --disable-gpu \
  --no-pdf-header-footer \
  --no-sandbox \
  --print-to-pdf=Navdeep_Rana_CV.pdf \
  "file://$PWD/resume.html" 2>&1 | tail -1

echo "✅ Done — $(stat -f%z Navdeep_Rana_CV.pdf 2>/dev/null || stat -c%s Navdeep_Rana_CV.pdf) bytes"
