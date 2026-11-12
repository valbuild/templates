#!/usr/bin/env bash
# Moves one mirror's `main` to a commit already staged on its `next`.
#
#   MIRROR_TOKEN=... scripts/promote.sh valbuild/template-tanstack-full <sha>
#
# valbuild/home starts this (`promote-mirror.yml`) once it has published the
# seed /new copies a site from, built from exactly that commit. `main` is what
# GitHub's `/generate` copies into a new project's repository, so moving it
# only now is what makes the site and the repository the same commit. See
# mirror.sh, which stages the commit, and "The mirrors" in README.md.
#
# Refuses anything but a fast-forward of `main` to a commit on `next`: the
# caller holds a token that can start this workflow, not one that can write to
# the mirrors, and this keeps it that way. A commit `main` has already passed
# is not an error -- a newer seed moved it further -- and the push is never
# forced, so a `main` that moved between the check and the push fails the run
# rather than going backwards.
set -euo pipefail
cd "$(dirname "$0")/.."

repo="${1:-}"
commit="${2:-}"
if [ -z "${MIRROR_TOKEN:-}" ]; then
  echo "::error::VAL_TEMPLATE_MIRROR_TOKEN is not set, so ${repo:-the mirror}'s main stays behind its seed. See README.md."
  exit 1
fi
if ! [[ "$commit" =~ ^[0-9a-f]{40}$ ]]; then
  echo "::error::'$commit' is not a full commit hash."
  exit 1
fi
if ! node -e 'process.exit(Object.values(require("./mirrors.json").mirrors).includes(process.argv[1]) ? 0 : 1)' "$repo"; then
  echo "::error::'$repo' is not a mirror in mirrors.json."
  exit 1
fi

# Overridable so the script can be tried against local repositories.
base="${MIRROR_BASE:-https://x-access-token:${MIRROR_TOKEN}@github.com}"
url="$base/${repo}.git"
work=$(mktemp -d)
trap 'rm -rf "$work"' EXIT

# Commits only: ancestry is all this reads, and the push sends nothing the
# mirror does not have, because the commit is already on its `next`.
git init --quiet --bare "$work"
git -C "$work" fetch --quiet --filter=tree:0 "$url" "+refs/heads/next:refs/heads/next"
main=""
if git -C "$work" ls-remote --exit-code "$url" refs/heads/main >/dev/null; then
  git -C "$work" fetch --quiet --filter=tree:0 "$url" "+refs/heads/main:refs/heads/main"
  main=$(git -C "$work" rev-parse refs/heads/main)
fi

short=${commit:0:8}
if ! git -C "$work" cat-file -e "${commit}^{commit}" 2>/dev/null ||
  ! git -C "$work" merge-base --is-ancestor "$commit" refs/heads/next; then
  echo "::error::$short is not on $repo's next, so it was never staged there."
  exit 1
fi
if [ "$main" = "$commit" ]; then
  echo "unchanged  $repo  (main is at $short)"
  exit 0
fi
if [ -n "$main" ] && git -C "$work" merge-base --is-ancestor "$commit" "$main"; then
  echo "unchanged  $repo  (main is at ${main:0:8}, already past $short)"
  exit 0
fi
if [ -n "$main" ] && ! git -C "$work" merge-base --is-ancestor "$main" "$commit"; then
  echo "::error::Moving $repo's main from ${main:0:8} to $short would not be a fast-forward."
  exit 1
fi

git -C "$work" push --quiet "$url" "${commit}:refs/heads/main"
echo "moved      $repo  main ${main:+${main:0:8} -> }$short"
