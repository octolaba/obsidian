# Queries expected to pass the static rules

```dataview
TABLE status
FROM "Projects"
WHERE status = "open"
SORT file.name ASC
LIMIT 20
```

```dataview
TABLE length(rows) AS Count
FROM "Projects"
GROUP BY status
SORT length(rows) DESC
```
