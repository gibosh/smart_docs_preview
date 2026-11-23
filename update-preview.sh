#!/bin/sh
# Rebuild the public review copy of the SMART help site from ../smart_docs.
# Publishes built HTML only: the source repo (and its infra/ settings) stays private.
# Search engines are asked not to index it (robots.txt + noindex on every page).
set -eu
cd "$(dirname "$0")"
SRC=../smart_docs
"$SRC/.venv/Scripts/sphinx-build" -M html "$SRC/docs" "$SRC/build/html" -q
find . -mindepth 1 -maxdepth 1 ! -name .git ! -name update-preview.sh ! -name README.md -exec rm -rf {} +
cp -r "$SRC/build/html/html/." .
rm -rf .buildinfo .doctrees _sources
touch .nojekyll
printf 'User-agent: *\nDisallow: /\n' > robots.txt
find . -name '*.html' -not -path './.git/*' -exec sed -i 's|<head>|<head><meta name="robots" content="noindex, nofollow">|' {} +
echo "Preview rebuilt from $(git -C "$SRC" rev-parse --short HEAD) ($(git -C "$SRC" branch --show-current))"
