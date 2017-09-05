// // Playing with a generator
//
// function *foo() {
//   var x = 1 + (yield "foo");
//   console.log(x);
// }
//
// function *too() {
//   console.log('Too started');
//   yield 1;
//   console.log('Too after first yield');
//   yield 2;
//   yield 3;
//   yield 4;
//   yield 5;
//   console.log('Too after last yield');
//   return 99;
// }
//
// var t = too();
// console.log('after assigning t');
//
// var msg = t.next();
// console.log(msg);
//
// console.log('looping');
// for (var i=00; i<10; i++) {
//   console.log(t.next());
// }

function *foo(x) {
  console.log('starting the generator');
  var y = 2 * (yield (x + 1));
  console.log('y is:', y);
  var z = yield (y / 3);
  console.log('z is:', z);
  return (x + y + z);
}

var it = foo( 1 );

// note: not sending anything into `next()` here
console.log('first', it.next() );
console.log( 'second', it.next( 12 ) );
console.log('third',  it.next( 13 ) );
console.log('finished');
