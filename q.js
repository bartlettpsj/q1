const Quagga = require('quagga/lib/quagga').default;
const fs = require('fs');
const co = require('co');

const files = ["images/image-001.jpg", "images/ucc128-label.jpg"];

// const filename = "images/image-001.jpg";
const filename = "images/ucc128-label.jpg";

// files.forEach((file) =>
// {
//   console.log('Decoding', file);
//
//   var data = fs.readFileSync(file);
//
//   Quagga.decodeSingle({
//     src: file,
//     numOfWorkers: 0,
//     inputStream: {
//       mime: 'image/jpeg',
//       size: 800,
//       area: {
//         top: "10%",
//         right: "5%",
//         left: "5%",
//         bottom: "10%"
//       }
//     }
//   }, function (result) {
//     if (result.codeResult) {
//       console.log("result", result.codeResult.code);
//     } else {
//       console.log("not detected");
//     }
//   })
// });

function decodeNext(filename) {

  console.log('Decoding: ', filename);

  return new Promise( (resolve, reject) => {

    var data = fs.readFileSync(filename);

    Quagga.decodeSingle({
      src: data,
      numOfWorkers: 0,
      inputStream: {
        mime: 'image/jpg',
        size: 800,
        area: {
          top: "10%",
          right: "5%",
          left: "5%",
          bottom: "10%"
        }
      }
    }, function (result) {
      if (result.codeResult) {
        // console.log("result", result.codeResult.code);
        resolve(result.codeResult.code);
      } else {
        console.log("not detected");
        reject('not detected');
      }
    })
  });
}

function dothedecodes() {
  return co(function* () {
    // Quagga.ENV.development = false;

    var result = "";
    for (let file of files) {

      const r = yield decodeNext(file);
      result += r + ' ';
    }

    return Promise.resolve(result);

    // console.log( 'result', yield decodeNext(files[0]));
    // console.log( 'result', yield decodeNext(files[1]));

  })
};

dothedecodes().then( (result) => {
  console.log('The rsult is: ', result);
});

// co(function*() {
//   yield console.log('code after the co stuff');
// })

// decodeNext(files[0]).then ( (result) => {
//   console.log(result);
//
//   decodeNext(files[1]).then ( (result) => {
//     console.log(result);
//   });
//
// });