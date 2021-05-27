const dmos = require('./dmos');

dmos.boot('output.jrl');
dmos.store({
  $class: 'model',
  id: 'dmos.test.Train',
  properties: {
    line: {
      type: 'int',
    },
    number: {
      type: 'string',
    }
  }
});
dmos.store({
  $class: 'model',
  id: 'dmos.test.Passenger',
  properties: {
    name: {
      type: 'string',
    },
    email: {
      type: 'email',
    }
  }
});
dmos.store({
  $class: 'model',
  id: 'dmos.test.Booking',
  properties: {
    passenger: {
      type: 'reference',
      of: 'dmos.test.Passenger',
      using: ['email']
    },
    train: {
      type: 'reference',
      of: 'dmos.test.Train',
      using: ['number', 'line']
    }
  }
});

const faker = require('faker');

var trains = [];
for ( let line = 1 ; line <= 12 ; line++ ) {
  for ( let n = 1 ; n < 100 ; n++ ) {
    let train = {
      $class: 'dmos.test.Train',
      line: line,
      number: n,
    };
    trains.push(train);
    dmos.store(train);
  }
}

var usedEmails = [];
for ( let i = 0 ; i < 10*1000 ; i++ ) {
  let passenger = {
    $class: 'dmos.test.Passenger',
    name: faker.name.findName(),
    email: faker.internet.email()
  }
  dmos.store(passenger);
  usedEmails.push(passenger.email);
}

for ( let i = 0 ; i < 10*1000 ; i++ ) {
  var trainIndex = Math.floor(Math.random() * trains.length);
  var emailIndex = Math.floor(Math.random() * usedEmails.length);
  let booking = {
    $class: 'dmos.test.Booking',
    passenger: usedEmails[emailIndex],
    train: {
      number: trains[trainIndex].number,
      line: trains[trainIndex].line
    }
  }
  dmos.store(booking);
}

// console.log(dmos.GetAll());
dmos.shutdown();
