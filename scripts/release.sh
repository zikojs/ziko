#!/usr/bin/env bash
set -euo pipefail

read -rp "Enter release version (e.g. 1.0.0 or 1.0.0.1): " VERSION

if [[ ! "$VERSION" =~ ^[0-9]+(\.[0-9]+)*(-[a-zA-Z0-9.-]+)?$ ]]; then
  echo "Invalid version: $VERSION"
  exit 1
fi

TAG="ziko-v$VERSION"

# Ensure there are changes to commit
if [[ -z "$(git status --porcelain)" ]]; then
  echo "No changes to commit."
else
  git add .
  git commit -m "chore: release $VERSION"
fi

# Create and push the release tag
git tag "$TAG"
git push origin HEAD
git push origin "$TAG"

echo "Released tag: $TAG"
