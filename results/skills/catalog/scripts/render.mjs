import { pluginDataBlock, repositoryDataBlock, themeDataBlock } from './datablock.mjs';
import {
    dedupe,
    githubUrl,
    pluginUid,
    pluginUrl,
    repoKey,
    repositoryLink,
    repositoryUid,
    screenshotUrl,
    statsFor,
    themeSlug,
    themeUid,
    themeUrl,
} from './model.mjs';
import { renderNote } from './note.mjs';

/**
 * The renderer: index row plus captures in, note bytes out.
 *
 * Every mapped property is machine-owned and overwritten (§4.4). `remind me` is never touched, and
 * `related to` members the machine did not write are preserved after its own guaranteed member.
 *
 * The note also carries its filled data block, placed after the body and any
 * embed and before the template footnote. The frontmatter and the block are two different jobs on
 * the same values: the frontmatter renders them for a reader (epoch milliseconds become ISO 8601,
 * an absent value writes a bare key), the block records them as the source served them.
 */

/**
 * §4.4. A member the machine would have written at the Sync State pin is its own and may be
 * dropped; anything else is human and survives. A display-text link `[[GitHub - {id}|{name}]]` to
 * *its* repository is a machine-written shape the bare form replaces instead of stacking beside
 * it. A display-text link to any other repository is not a member the machine ever wrote, and is
 * preserved.
 */
function mergeRelatedTo(machineMembers, existing, recognized, machineIds = []) {
    const superseded = new RegExp(`^\\[\\[GitHub - (?:${machineIds.join('|')})\\|`);
    const kept = (existing ?? []).filter(
        member =>
            !recognized.has(member) &&
            !machineMembers.includes(member) &&
            !(machineIds.length > 0 && superseded.test(member)),
    );
    return dedupe([...machineMembers, ...kept]);
}

/** GitHub full names are case-insensitive; keep the first spelling and exact-dedupe bare aliases. */
function dedupeRepositoryAliases(values) {
    const seen = new Set();
    const out = [];
    for (const value of values) {
        if (value === null || value === undefined || value === '') continue;
        const key = String(value).includes('/') ? `repo:${repoKey(value)}` : `alias:${value}`;
        if (seen.has(key)) continue;
        seen.add(key);
        out.push(value);
    }
    return out;
}

/**
 * @param recognizedLinks every repository link the machine would have written at the Sync State
 *   pin — recomputed, never stored (§4.4). Members outside it are human and survive.
 */
export function renderPluginNote({
    template,
    plugin,
    stats,
    repository,
    body,
    about = null,
    existing = null,
    recognizedLinks = new Set(),
}) {
    const stat = statsFor(stats, plugin.id);
    const machine = repository ? [repositoryLink(repository.numericId)] : [];
    const values = {
        uid: existing?.values?.uid ?? pluginUid(plugin.id),
        xid: [plugin.id],
        aliases: dedupe([plugin.id, plugin.name, plugin.repo]),
        tags: template.tags,
        url: pluginUrl(plugin.id),
        alt: [githubUrl(plugin.repo)],
        downloads: stat.downloads,
        'updated at': stat.updatedAt,
        'related to': mergeRelatedTo(
            machine,
            existing?.values?.['related to'],
            recognizedLinks,
            repository ? [repository.numericId] : [],
        ),
        'remind me': existing?.values?.['remind me'] ?? null,
    };
    return renderNote({
        template,
        values,
        h1: plugin.name,
        body,
        extra: [pluginDataBlock({ plugin, stats, about })],
    });
}

export function renderThemeNote({
    template,
    theme,
    repository,
    body,
    about = null,
    existing = null,
    recognizedLinks = new Set(),
    screenshotAvailable = true,
}) {
    const slug = themeSlug(theme.name);
    const machine = repository ? [repositoryLink(repository.numericId)] : [];
    const values = {
        uid: existing?.values?.uid ?? themeUid(slug),
        xid: [slug],
        aliases: dedupe([slug, theme.name, theme.repo]),
        tags: template.tags,
        url: themeUrl(slug),
        alt: [githubUrl(theme.repo)],
        modes: [...theme.modes],
        legacy: theme.legacy === true,
        'related to': mergeRelatedTo(
            machine,
            existing?.values?.['related to'],
            recognizedLinks,
            repository ? [repository.numericId] : [],
        ),
        'remind me': existing?.values?.['remind me'] ?? null,
    };
    const extra = [
        ...(screenshotAvailable ? [`![${theme.name} screenshot](${screenshotUrl(theme.repo, theme.screenshot)})`] : []),
        themeDataBlock({ theme, slug, about }),
    ];
    return renderNote({ template, values, h1: theme.name, body, extra });
}

export function renderRepositoryNote({ template, repository, body, existing = null }) {
    // §4.1, in this fixed order: the bare `name`, then the current `nameWithOwner`, then every
    // former name in the order first recorded. Obsidian offers aliases to the author in list order,
    // so the short name — the one a human types — has to lead; the current full name disambiguates
    // it, and history sits below where it never competes with either.
    //
    // `formerNames` carries the index `repo` string when GitHub answered under a different name.
    // Keeping it as an alias is what lets §6.1 resolve that row offline on a later run: the notes
    // are the only identity store (decision 3.11), so a name nobody recorded is a network call.
    const previous = [...(existing?.values?.aliases ?? []), ...(repository.formerNames ?? [])].filter(
        alias => alias !== repository.fullName && alias !== repository.name,
    );
    const homepage = typeof repository.homepageUrl === 'string' && repository.homepageUrl.trim() !== ''
        ? repository.homepageUrl
        : null;
    const values = {
        uid: existing?.values?.uid ?? repositoryUid(repository.numericId),
        // The GraphQL node id leads, the numeric databaseId follows.
        xid: [repository.nodeId, repository.numericId],
        aliases: dedupeRepositoryAliases([repository.name, repository.fullName, ...previous]),
        tags: template.tags,
        url: repository.url,
        alt: homepage ? [homepage] : [],
        stars: repository.stargazerCount,
        forks: repository.forkCount,
        'pushed at': repository.pushedAt,
        'related to': existing?.values?.['related to'] ?? [],
        'remind me': existing?.values?.['remind me'] ?? null,
    };
    return renderNote({ template, values, h1: repository.fullName, body, extra: [repositoryDataBlock({ repository })] });
}
