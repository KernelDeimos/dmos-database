# What is this?

**DMOS** is an experimental database written in Golang. I made this to try the
concept of communicating to a database written in Golang from a Nodejs
application using a dynamic library, rather than IPC or sockets.

One particularly cool feature of DMOS is that queries can be javascript
expressions. The dynamic library includes a javascript AST parser; the output
of which then gets converted into DMOS' own predicate tree. This allows querying
Golang from Javascript without leaving your syntax highlighter.

## Example

```
const dmos = require('./dmos');
dmos.boot('myfile.dmosdb');

dmos.store({ train: { number: 1, line: 1 } });

console.log(dmos.where(
  () => train.number == 1 && train.line == 1
))

dmos.shutdown();

```

## Future Work

The following are things that could be done in the future to make this a more
viable database for production use

- B+ trees on in-memory storage
- Joins - could implement hash join
- BSON isn't efficient; DMOS could support optional schemas with a better
  binary format
