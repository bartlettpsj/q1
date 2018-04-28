// Experiment with co routines

// Third Change
// Fourth Change

const co = require('co');

function slowboat(interval, name) {
  return new Promise( (resolve, reject) => {
    setTimeout(() => {
      console.log(new Date, name, 'Slowboat finished after', interval );
      resolve('done');
    }, interval);
  })
}

co(function *() {
  console.log(new Date, 'starting');

  yield slowboat(3000, 'first');
  yield slowboat(1000, 'second');
  yield slowboat(5000, 'third');
  yield slowboat(500,  'fourth');

  console.log(new Date, 'all done');

});

