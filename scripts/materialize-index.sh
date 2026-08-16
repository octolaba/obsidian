#!/bin/sh
# Materialize one commit's community directory data as an injectable material root.
#
# The catalog's Update Run classifier needs the index at two pins: the target pin is the mirror's
# own worktree, and the base pin lives in the mirror's history. The portable harnesses may not
# reach for it -- they never invoke the version-control system, so that a skill directory keeps
# working once copied out of this repository -- so the repository level, which already owns the
# artifact-to-material mapping, extracts it here and injects the result as a second material root.
#
# What lands is exactly what `verifyMaterial` recognises: the six data files plus the mirror
# README. Nothing else is copied, and the mirror's worktree is never touched -- `git show` reads
# blobs straight out of the object store, so no checkout, stash or worktree is involved.
#
#   usage: materialize-index.sh <mirror-root> <pin> <output-directory>
#
# Exit status, from the shared vocabulary the Makefile documents:
#
#   0  clean
#   2  usage error
#   3  the mirror is not hydrated, or the pin is not in its object store
#   4  identity mismatch -- the directory is not the mirror's own toplevel, or the pin's README
#      is not the mirror's README
#
# The toplevel check is the load-bearing one and it is not paranoia: `git -C docs rev-parse
# --show-toplevel` answers the *outer* repository, so a mistyped mirror root would silently
# materialize this repository's history and every later comparison would be against the wrong data.

set -u

SENTINEL='community plugins & themes directories'
FILES='community-plugins.json community-css-themes.json community-plugin-stats.json
community-plugins-removed.json community-css-themes-removed.json
community-plugin-deprecation.json README.md'

if [ "$#" -ne 3 ]; then
    echo "usage: $(basename "$0") <mirror-root> <pin> <output-directory>" >&2
    exit 2
fi

mirror=$1
pin=$2
output=$3

if [ ! -d "$mirror" ]; then
    echo "$mirror is not a directory; hydrate it first:  git submodule update --init" >&2
    exit 3
fi

mirror=$(cd "$mirror" && pwd) || exit 3

toplevel=$(git -C "$mirror" rev-parse --show-toplevel 2>/dev/null) || {
    echo "$mirror is not a git checkout" >&2
    exit 3
}
if [ "$toplevel" != "$mirror" ]; then
    echo "$mirror is not its own repository toplevel; git answers $toplevel" >&2
    exit 4
fi

if [ "$(git -C "$mirror" cat-file -t "$pin" 2>/dev/null)" != 'commit' ]; then
    echo "$pin is not a commit in $mirror; fetch it first:  git -C $mirror fetch --tags" >&2
    exit 3
fi

if ! git -C "$mirror" show "$pin:README.md" 2>/dev/null | grep -qF "$SENTINEL"; then
    echo "$pin does not carry the Release Mirror README; it is not a commit of that repository" >&2
    exit 4
fi

mkdir -p "$output" || exit 2
for file in $FILES; do
    if ! git -C "$mirror" show "$pin:$file" > "$output/$file" 2>/dev/null; then
        echo "$file is absent at $pin" >&2
        exit 4
    fi
done

echo "materialized $pin into $output ($(echo "$FILES" | wc -w | tr -d ' ') files); $mirror untouched"
