# Deliberately problematic query

```tasks
due next weekend
sort by due reverssse
filter by function task.description.includes('return')
limit groups to 2
show tree
starts before tomorrow
priority is above low
path includes .md
(description includes alpha) and (description includes beta)
description regex matches /(a+)+/
filter by function query.allTasks.find(other => other.id === task.id) !== undefined
preset does_not_exist
```
