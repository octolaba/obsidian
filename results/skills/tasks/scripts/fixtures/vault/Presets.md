# Preset expansion

A preset can hide a JavaScript filter behind one short instruction:

```tasks
not done
preset risky_js
```

A cyclic preset definition never terminates in the plugin:

```tasks
preset cycle_a
```

A multi-line placeholder must be split after nested expansion. Otherwise the leading comment can
hide the executable instruction on its second generated line:

```tasks
{{preset.placeholder_outer}}
```

Placeholder cycles are bounded and reported too:

```tasks
{{preset.placeholder_cycle_a}}
```
