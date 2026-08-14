---
uid: 9eb6e926-1394-4478-aa84-6fe127e2a703
xid:
  - id
  - databaseId
aliases:
  - name
  - nameWithOwner
tags:
  - type/bookmark
  - bookmark/github
  - github/repository
url: url
alt:
  - homepageUrl
stars:      # stats.stargazerCount
forks:      # stats.forkCount
pushed at:  # timestamps.pushedAt
related to:
remind me:
---

# owner/repo

Semantic description of the $repository based on $readme and $repository.description.

```cue
repository: {
  // GraphQL Repository object (the readme block alone is REST-fed); field names
  // follow the source schema, and a comment marks every renamed or computed field.
  // Grouping rules: counts and sizes → stats; has*Enabled + forkingAllowed → features;
  // is*, visibility and defaultBranch → state; DateTime → timestamps; identity,
  // naming and links stay at root; nested API objects keep their own blocks.

  id:          string // node ID; REST: node_id
  databaseId?: int    // REST: id

  name:          string
  nameWithOwner: string
  description?:  string
  language?:     string      // primaryLanguage?.name
  topics:        [...string] // repositoryTopics(first: 20).nodes[].topic.name — 20 is the GitHub
                             // cap; should it ever grow, the tail is noise and is dropped by design
  url:           string
  sshUrl:        string
  homepageUrl?:  string

  owner: {
    id:    int                     // User.databaseId || Organization.databaseId (inline fragments)
    type:  "User" | "Organization" // __typename
    login: string
    url:   string
  }

  readme?: { // REST GET /repos/{owner}/{repo}/readme — the single non-GraphQL call; absent on 404
    sha:     string
    size:    int    // bytes; the summary input is content (base64) — a README over 1 MB comes back
                    // with encoding "none" and empty content: skip such a repository from summarization
    htmlUrl: string // html_url — the rendered README page, to jump to from the note
  }

  license?: { // licenseInfo
    key:     string
    name:    string
    spdxId?: string
  }

  stats: { // point-in-time at capture
    stargazerCount: int
    watcherCount:   int // watchers.totalCount
    forkCount:      int
    openIssueCount: int // issues(states: OPEN).totalCount; pull requests are not counted
    diskUsage?:     int // kilobytes
  }

  features: { // capabilities the owner can toggle
    hasIssuesEnabled:       bool
    hasPullRequestsEnabled: bool
    hasProjectsEnabled:     bool
    hasWikiEnabled:         bool
    hasDiscussionsEnabled:  bool
    hasSponsorshipsEnabled: bool
    forkingAllowed:         bool
  }

  state: { // what the repository is right now
    visibility:     "PUBLIC" | "PRIVATE" | "INTERNAL"
    defaultBranch?: string // defaultBranchRef.name; absent in an empty repository
    isPrivate:      bool
    isFork:         bool
    isArchived:     bool
    isDisabled:     bool
    isTemplate:     bool
  }

  timestamps: {
    createdAt: string
    updatedAt: string
    pushedAt?: string
  }
}
```

[^template]: [[GitHub repository]]
