# Deliberately bad queries

```dataview
TABLE
SORT file.name
FROM "Projects"
```

```dataview
TABLE status
FROM "Projects/"
WHERE contains(file.tags, "#project") AND score < 10 OR urgent
WHERE due < 2026-08-01
```

```dataview
TABLE sum(rows.estimate)
FROM "Projects"
GROUP BY status
SORT estimate
LIMIT -1
```

```dataview
TASK
FROM #project
WHERE !completed
```

```dataview
LIST file.link
WHERE status = "open"
```

```dvjs
const wrong = dv.pages('status = "open"');
dv.query('LIST FROM "Projects"');
while (true) work();
```

Custom inline query: `dv= date(today)`.

Custom inline JS query: `dvjs= dv.pages().length`.
