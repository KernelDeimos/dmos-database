const dmos = require('./dmos');

dmos.boot('output.jrl');

// Use this to get an email address
// console.log(dmos.Query(
//   ['eq', ['get', '$class'], ['literal', 'dmos.test.Booking']]
// ));

// console.log(dmos.Query(
//   ['eq', ['get', 'passenger'], ['literal', 'Maeve.Swift44@yahoo.com']]
// ))

console.log(dmos.where(() =>
  ( train.number == 1 && train.line == 1 ) || train.number == 2
  // passenger == 'Maeve.Swift44@yahoo.com'
))

// console.log(dmos.GetAll());
dmos.shutdown();
