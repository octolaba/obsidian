#!/bin/sh
# Repository hygiene gate for the vendored research material.
#
# A gitlink records which commit a submodule is checked out at, but not whether that checkout can
# still move. A submodule left on a branch drifts the moment anything runs `git pull` inside it,
# and the artifact harnesses cannot notice: they never invoke the version-control system, so that a
# skill directory keeps working once copied out of this repository. The check therefore lives here,
# beside the artifact-to-material mapping, rather than inside any portable directory.
#
# Per submodule declared in .gitmodules:
#
#   named         the .gitmodules section name is identical to the path
#   hydrated      the worktree exists and carries a .git link
#   detached      HEAD is not on a branch, so nothing can fast-forward the pin
#   clean         no modifications, so the pin describes the files actually on disk
#   at a tag      where the category expects a release, HEAD is exactly on a tag
#
# Exit status, from the shared vocabulary the Makefile documents:
#
#   0  clean
#   1  findings
#   2  usage error
#   3  a declared submodule is not hydrated
#
# The section name matters because it, not the path, is what `.git/modules/<name>` is keyed on.
# `git submodule add` keeps the two identical; `git mv` rewrites only the path and silently leaves
# the name behind, so a moved target keeps answering to its former location. That check reads
# .gitmodules alone, so it still reports on a target that was never hydrated.
#
# Upstream that publishes no tags is pinned to a commit by design and is not a finding. Tag
# matching goes through `describe --tags`, which unlike bare `describe` also sees lightweight tags;
# several targets here tag that way, and bare `describe` silently reports an older annotated tag
# instead. A submodule cloned without tags degrades to "no tags published" and is not flagged.
#
# One category is exempt from the tag expectation entirely, because it is tracked as a moving
# target on purpose: it ships no releases of itself, and where its repositories do carry tags, the
# tags name something other than the material -- an application version, a template scaffold. A
# release tag there would pin the wrong thing, so the latest upstream commit is the intended pin.

set -u

# Category prefixes whose targets are pinned to the latest upstream commit, not to a release.
COMMIT_PINNED='research/core/'

if [ "$#" -ne 0 ]; then
    echo "usage: $(basename "$0")" >&2
    exit 2
fi

root=$(git rev-parse --show-toplevel 2>/dev/null) || {
    echo 'not inside a git repository' >&2
    exit 2
}
cd "$root" || exit 2

if [ ! -f .gitmodules ]; then
    echo 'no .gitmodules at the repository root' >&2
    exit 2
fi

checked=0
findings=0
unhydrated=0

report() {
    printf '  %-52s %s\n' "$1" "$2"
    findings=$((findings + 1))
}

entries=$(git config -f .gitmodules --get-regexp '^submodule\..*\.path$')

if [ -z "$entries" ]; then
    echo 'no submodules declared in .gitmodules' >&2
    exit 2
fi

old_ifs=$IFS
IFS='
'
for entry in $entries; do
    IFS=$old_ifs
    checked=$((checked + 1))

    key=${entry%% *}
    path=${entry#* }
    name=${key#submodule.}
    name=${name%.path}

    if [ "$name" != "$path" ]; then
        report "$path" "declared as section '$name', which is not its path"
    fi

    if [ ! -e "$path/.git" ]; then
        report "$path" 'not hydrated'
        unhydrated=$((unhydrated + 1))
        IFS='
'
        continue
    fi

    if branch=$(git -C "$path" symbolic-ref --short -q HEAD); then
        report "$path" "HEAD on branch '$branch', not detached"
    fi

    if [ -n "$(git -C "$path" status --porcelain 2>/dev/null)" ]; then
        report "$path" 'worktree not clean'
    fi

    case "$path" in
        "$COMMIT_PINNED"*)
            : # commit-pinned by category; a release tag is not expected here
            ;;
        *)
            if [ -n "$(git -C "$path" tag 2>/dev/null)" ]; then
                if ! git -C "$path" describe --tags --exact-match >/dev/null 2>&1; then
                    nearest=$(git -C "$path" describe --tags 2>/dev/null) || nearest='no reachable tag'
                    report "$path" "not at an exact tag (nearest: $nearest)"
                fi
            fi
            ;;
    esac

    IFS='
'
done
IFS=$old_ifs

echo
if [ "$findings" -eq 0 ]; then
    echo "$checked submodules checked; all named after their path, hydrated, detached, clean, and pinned as expected"
    exit 0
fi

echo "$checked submodules checked, $findings finding(s)"
if [ "$unhydrated" -gt 0 ]; then
    echo "hydrate first:  git submodule update --init" >&2
    exit 3
fi
exit 1
