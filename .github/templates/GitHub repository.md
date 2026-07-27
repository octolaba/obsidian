---
uid: 9eb6e926-1394-4478-aa84-6fe127e2a703
xid:
  - id
  - node_id
aliases:
  - full_name
  - name
tags:
  - type/bookmark
  - bookmark/github
  - github/repository
url: html_url
alt:
  - homepage
stars:      # stargazers_count
forks:      # forks_count
pushed at:  # pushed_at
related to:
remind me:
---

# owner/repo

Semantic description of the $repository based on $readme and $repository.description.

```cue
repository: {
    id:           int
    node_id:      string
    name:         string
    full_name:    string
    private:      bool
    fork:         bool

    html_url:     string
    homepage?:    string
    description?: string

    owner: {
        login:      string
        id:         int
        type:       string
        html_url:   string
        site_admin: bool
    }

    language?:      string
    default_branch: string
    visibility:     string
    size:           int // KB
    topics: [...string]

    license?: {
        key:     string
        name:    string
        spdx_id: string
    }

    stats: {
        stargazers_count:  int
        watchers_count:    int
        forks_count:       int
        open_issues_count: int
        subscribers_count: int
        network_count:     int
    }

    features: {
        has_issues:      bool
        has_projects:    bool
        has_downloads:   bool
        has_wiki:        bool
        has_pages:       bool
        has_discussions: bool
        archived:        bool
        disabled:        bool
        is_template:     bool
    }

    timestamps: {
        created_at: string
        updated_at: string
        pushed_at:  string
    }

    clone: {
        git_url:   string
        ssh_url:   string
        clone_url: string
        svn_url:   string
    }
}

readme: {
    name:         string
    path:         string
    sha:          string
    size:         int // bytes
    encoding:     string
    html_url:     string
    download_url: string
}
```

[^template]: [[GitHub repository]]
