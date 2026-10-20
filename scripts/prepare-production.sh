#!/usr/bin/env bash
set -euo pipefail

# Installed outside the checkout so pulling new application code cannot replace
# the script while systemd is executing it. The service sets cwd and environment.
export GIT_TERMINAL_PROMPT=0

if [[ "$(git branch --show-current)" != "main" ]]; then
  echo "Production checkout must use the main branch." >&2
  exit 1
fi

if ! git diff --quiet HEAD --; then
  echo "Production has modified tracked files. Remove local edits before restarting." >&2
  exit 1
fi

git pull --ff-only origin main
commit=$(git rev-parse HEAD)
echo "Preparing production commit ${commit}"

npm ci --include=dev --no-audit --no-fund
# Always build current source; never start an old build after a failed update.
rm -rf .next
npm run build
npm run db:migrate

printf '%s\n' "$commit" > .next/DEPLOYED_COMMIT
echo "Production commit ${commit} is ready to start."
