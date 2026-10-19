#!/usr/bin/env bash
# Stages each folder in mirrors.json on its own repository's `next` branch,
# then asks valbuild/home to reseed from exactly those commits.
#
#   MIRROR_TOKEN=... GH_TOKEN=... scripts/mirror.sh
#
# Why the mirrors exist: GitHub can only make a repository from a WHOLE template
# repository, so `/new`'s "code on GitHub" cannot copy one folder of this one.
# Each mirror is an ordinary template repository that GitHub can copy.
#
# Why `next` and not `main`: /new copies a project's code with GitHub's
# `/generate`, which copies a template repository's `main` at whatever commit
# it is at and cannot be given another. Its site is copied from a seed
# valbuild/home builds. Pushing to `main` here gave new projects the new code
# with the old site until the reseed finished -- and for good, if it failed.
# So this pushes to `next`, valbuild/home builds the seed from the commit
# named here, and only once that seed is published does home ask
# `promote-mirror.yml` (scripts/promote.sh) to move that mirror's `main` to it.
# Nothing here ever touches `main`.
#
# The reseed is asked for only after every mirror push has succeeded, and
# names every mirror's `next`, moved or not: home skips what it already built,
# and a newer request replaces an older one still waiting there, so each
# request has to describe all of them. That is also what lets a re-run of a
# run whose dispatch failed finish the job.
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

# Every mirror's config can be made the Val app's, checked before anything is
# pushed: a template that fails this half way through the loop below would
# leave the mirrors at different commits.
node scripts/app-config.mjs --check

source_sha=$(git rev-parse HEAD)
subject=$(git log -1 --format=%s)
# Overridable so the script can be tried against local repositories.
base="${MIRROR_BASE:-https://x-access-token:${MIRROR_TOKEN}@github.com}"
work=$(mktemp -d)
trap 'rm -rf "$work"' EXIT
staged=()
# Read first, so a mirrors.json node cannot parse fails the run here rather
# than leaving the loop below with nothing to do.
mirrors=$(node -e '
  const { mirrors } = require("./mirrors.json");
  for (const [folder, repo] of Object.entries(mirrors)) console.log(folder, repo);
')

while read -r folder repo; do
  dir="$work/${repo//\//_}"
  git init --quiet "$dir"
  git -C "$dir" remote add origin "$base/${repo}.git"
  # On top of `next`, which is `main` plus whatever is waiting for a seed.
  # Before a mirror has a `next` (the first run of this script), on top of
  # `main`. A mirror with neither (just created, empty) starts with one commit,
  # and gets a `main` when its first seed is built.
  for from in next main; do
    if git -C "$dir" ls-remote --exit-code origin "refs/heads/$from" >/dev/null; then
      git -C "$dir" fetch --quiet --depth 1 origin "$from"
      git -C "$dir" checkout --quiet -B next FETCH_HEAD
      break
    fi
  done
  # A mirror holds the folder as committed here and nothing else: what is gone
  # from the folder goes from the mirror, and nothing untracked comes along.
  find "$dir" -mindepth 1 -maxdepth 1 ! -name .git -exec rm -rf {} +
  git archive --format=tar "HEAD:$folder" | tar -x -C "$dir"
  # A mirror is what admin.val.build/new copies, and that project runs in the
  # Val app, which will not start without `files: { remote: true }`. The folder
  # here leaves it out, because `npm create @valbuild` makes a project that
  # keeps its media in its own repository. See scripts/app-config.mjs.
  node scripts/app-config.mjs "$dir"
  git -C "$dir" add -A
  if git -C "$dir" diff --cached --quiet && git -C "$dir" rev-parse -q --verify HEAD >/dev/null; then
    echo "unchanged  $repo"
  else
    git -C "$dir" -c user.name="Val templates" -c user.email="templates@val.build" \
      commit --quiet -m "$subject" \
      -m "From valbuild/templates@${source_sha} ($folder). This repository is published from there and overwritten on every push: change it in valbuild/templates."
    echo "staged     $repo  ($(git -C "$dir" rev-parse --short=8 HEAD))"
  fi
  # Unchanged too: the first run gives every mirror its `next`. Never forced:
  # a `next` that moved since it was fetched fails the run rather than being
  # thrown away.
  git -C "$dir" push --quiet origin HEAD:refs/heads/next
  staged+=("${repo}@$(git -C "$dir" rev-parse HEAD)")
done <<<"$mirrors"

# The REST call, not `gh workflow run`: without `--ref` that asks GraphQL for
# home's default branch, which an "Actions: read and write" token is not
# allowed to read -- and this is the one permission the token has.
gh api --method POST \
  repos/valbuild/home/actions/workflows/reseed-templates.yml/dispatches \
  -f ref=main \
  -f "inputs[source]=valbuild/templates@${source_sha}" \
  -f "inputs[commits]=${staged[*]}"
echo "asked valbuild/home to reseed: ${staged[*]}"
