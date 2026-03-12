# Callout location regressions

> ```dataview
> TABLE due
> FROM "Projects"
> WHERE due < date(today)
> ```

> > ```dataview
> > TABLE due
> > FROM "Projects"
> > WHERE due < date(today)
> > ```

An exact-parser error on a later nested-callout line must retain the quote-prefix width too:

> > ```dataview
> > TABLE due
> > FROM "Projects"
> > WHERE (
> > ```
