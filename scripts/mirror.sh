#!/usr/bin/env bash
# Publishes each folder in mirrors.json as its own repository, then asks
# valbuild/home to reseed.
#
#   MIRROR_TOKEN=... GH_TOKEN=... scripts/mirror.sh
#
# Why the mirrors exist: GitHub can only make a repository from a WHOLE template
# repository, so `/new`'s "code on GitHub" cannot copy one folder of this one.
# Each mirror is an ordinary template repository that GitHub can copy.
#
# Why the reseed waits for the mirrors: valbuild/home seeds `/new`'s sites from
# the MIRRORS, not from this repository, so that the site a new project serves
# and the code it is given on GitHub are the same commit. So the reseed is
# asked for only after every mirror push has succeeded. A mirror that failed
# to push fails this run, and the reseed is not asked for at all -- a seed
# built from a mirror that is behind is the bug this ordering exists to stop.
#
# The reseed is asked for even when no mirror moved. That is what lets a
# re-run of a run whose dispatch failed finish the job, and home's reseed
# costs one `git ls-remote` per template when nothing moved.
#
# MIRROR_TOKEN pushes to the mirrors (Contents and Workflows, write: each
# mirror carries the template's `.github/workflows`). GH_TOKEN starts the
# workflow in valbuild/home (Actions, write). Two tokens, so neither can do
# the other's job.
set -euo pipefail
cd "$(dirname "$0")/.."

if [ -z "${MIRROR_TOKEN:-}" ]; then
  echo "::error::VAL_TEMPLATE_MIRROR_TOKEN is not set, so the template repositories and the seeds /new uses stay at their old commit. See README.md."
  exit 1
fi
if [ -z "${GH_TOKEN:-}" ]; then
  echo "::error::VAL_HOME_DISPATCH_TOKEN is not set, so new projects keep the old seed. See README.md."
  exit 1
fi

source_sha=$(git rev-parse HEAD)
subject=$(git log -1 --format=%s)
# Overridable so the script can be tried against local repositories.
base="${MIRROR_BASE:-https://x-access-token:${MIRROR_TOKEN}@github.com}"
work=$(mktemp -d)
trap 'rm -rf "$work"' EXIT

node -e '
  const { mirrors } = require("./mirrors.json");
  for (const [folder, repo] of Object.entries(mirrors)) console.log(folder, repo);
' | while read -r folder repo; do
  dir="$work/${repo//\//_}"
  git clone --quiet --depth 1 \
    "$base/${repo}.git" "$dir"
  # `main` by name, not whatever the default branch is: it is the branch this
  # pushes to. A mirror with no `main` yet (just created, empty) starts one.
  if git -C "$dir" ls-remote --exit-code origin refs/heads/main >/dev/null; then
    git -C "$dir" fetch --quiet --depth 1 origin main
    git -C "$dir" checkout --quiet -B main FETCH_HEAD
  fi
  # A mirror holds the folder as committed here and nothing else: what is gone
  # from the folder goes from the mirror, and nothing untracked comes along.
  find "$dir" -mindepth 1 -maxdepth 1 ! -name .git -exec rm -rf {} +
  git archive --format=tar "HEAD:$folder" | tar -x -C "$dir"
  git -C "$dir" add -A
  if git -C "$dir" diff --cached --quiet; then
    echo "unchanged  $repo"
    continue
  fi
  git -C "$dir" -c user.name="Val templates" -c user.email="templates@val.build" \
    commit --quiet -m "$subject" \
    -m "From valbuild/templates@${source_sha} ($folder). This repository is published from there and overwritten on every push: change it in valbuild/templates."
  git -C "$dir" push --quiet origin HEAD:main
  echo "pushed     $repo  ($(git -C "$dir" rev-parse --short=8 HEAD))"
done

# The REST call, not `gh workflow run`: without `--ref` that asks GraphQL for
# home's default branch, which an "Actions: read and write" token is not
# allowed to read -- and this is the one permission the token has.
gh api --method POST \
  repos/valbuild/home/actions/workflows/reseed-templates.yml/dispatches \
  -f ref=main \
  -f "inputs[source]=valbuild/templates@${source_sha}"
echo "asked valbuild/home to reseed"
