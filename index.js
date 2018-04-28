// This test will load an inage file and the run through barcode read and display the contents using different technolgoies

// c1

const Quagga = require('quagga/lib/quagga').default;

const co = require('co');
const fs = require('fs');
const path = require('path');
//const barcodeReader = require('barcode-reader');
const Tiff = require('tiff.js');
const UTIF = require('utif');
const jpeg = require('jpeg-js');
const Jimp = require('jimp');
// const process = require('process');

// const baseDir = './images';
const baseDir = '/users/pbartlett/desktop/NJ Registration Images/';
const log = (...s) => { console.log((new Date).toString() + ': ', ...s); }

function processor() {
  fs.readdir(baseDir, (err, files) => {
    files.forEach(file => {

      // If Tiff the load using tiff.js

      const ext = file.split('.').slice(1).pop();//.toLowerCase();

      if (ext == 'tif') {
        log('TIF file', file);

        const filename = baseDir + file;
        var data = fs.readFileSync(filename);
        log(`  TIFF file:`, data.length);

        var image = new Tiff({buffer: data});
        log(' ', JSON.stringify(image));
        log(`    TIFF.js Width: ${image.width()} Height: ${image.height()}`);

        var page = UTIF.decode(data);
        log(`    UTIF Pages: ${page.length}`);

        if (page.length > 1) {
          log('Multipage');
        } else if (page.length == 1) {
          const rgba = UTIF.toRGBA8(page[0]);
          log('    rgba is:', rgba.length);

          // Make JPG from the data --- will probably switch to PNG or BITMAP if in memory so lossless
          var rawImageData = {
            data: rgba,
            width: image.width(),
            height: image.height()
          };

          var jpegImageData = jpeg.encode(rawImageData, 100);

          //save to file to see if its works

          fs.writeFileSync('test.jpg', jpegImageData.data);
          console.log('File Written');

          decodeNext(jpegImageData.data).then((result) => {
            console.log('Did the barcode');
          })


        } else {
          log('TIFF is empty)');

        }
      }
    });
  });
}

function decodeNext(data, width, height) {

  return new Promise( (resolve, reject) => {

    const sizes = ['x-small', 'small']; //, 'medium', 'large']; //, 'x-large'];
    let done = false;
    let idxsize = 0;

    // Try all patch sizes until we get a match

      const decode = () => {
        log('trying: ', sizes[idxsize]);

        Quagga.decodeSingle({
          src: data,
          numOfWorkers: 0,
          inputStream: {
            mime: 'image/jpg',
            size: 1920,
            singleChannel: false // true: only the red color-channel is read
            // area: {
            //   top: "0%",
            //   right: "5%",
            //   left: "5%",
            //   bottom: "10%"
            // }
          },
          locate: true,
          locator: {
            halfSample: false,
            patchSize: sizes[idxsize]
          },
          decoder: {
            readers: ["code_128_reader", "code_39_reader"]
          },
          debug: false,
        }, (result) => {

          idxsize++;
          // done = true;

          if (result && result.codeResult) {
            log("RESULT: ", result.codeResult.code);
            resolve(result.codeResult.code);
          } else {
            // Exhausted?
            if (idxsize >= sizes.length) {
              log("not detected");
              resolve('not detected');
              done = true;
            } else {
              log('Continue');
              decode();
            }
          }
        })
      }

      decode();
    // }
  });
}



function dothedecodes(files) {
  return co(function* () {

    console.time("All");

    var result = "";
    for (let file of files) {

      console.time("Process");

      const ext = file.split('.').slice(1).pop();//.toLowerCase();

      // Only process TIFF files
      if (ext == 'tif') {
        log('TIF file', file);

        // Load data into memory
        const filename = baseDir + file;
        var data = fs.readFileSync(filename);
        // log(`  TIFF file:`, data.length);

        //Load as TIFF using Tiffjs
        console.time("TIFF Load");
        var image = new Tiff({buffer: data});
        console.timeEnd("TIFF Load");

        const pageCount = image.countDirectory();
        const width = image.width();
        const height = image.height();

        // log(' ', JSON.stringify(image));
        log(`    TIFF.js Size: ${data.length} Count: ${pageCount} Width: ${width} Height: ${height}`);
        //const dataUrl = image.toDataURL(); // only avail in browser
        const rgba2 = image.readRGBAImage();
        const rgba8 = new Uint8Array(rgba2); // byte view on the buffer data
        // const canvasElement = image.toCanvas(); // only avail in browser

        // Load as TIFF using UTIF
        // var page = UTIF.decode(data);
        // log(`    UTIF Pages: ${page.length}`);

        // Only processing single page for the mo
        if (pageCount == 1) {
          // const rgba = UTIF.toRGBA8(page[0]);
          // log('    rgba is:', rgba.length);
          //
          // var curr = page[0];

          // Make JPG from the data --- will probably switch to PNG or BITMAP if in memory so lossless
          var rawImageData = {
            data: rgba8,
            width: width,
            height: height
          };

          console.time("JPEG Encode");
          var jpegImageData = jpeg.encode(rawImageData, 100);
          console.timeEnd("JPEG Encode");

          // console.time("PNG Encode");
          // makePng(rgba8, width, height);
          // console.timeEnd("PNG Encode");


          // fs.writeFileSync(file + '.jpg', jpegImageData.data);

          // var data = fs.readFileSync('images/image-001.jpg');
          // const r = yield decodeNext(data);
          console.time("Decode");
          const r = yield decodeNext(jpegImageData.data, width, height);
          console.timeEnd("Decode");
          result += r + '  ';
        }

      }

      console.timeEnd("Process");
    }

    console.timeEnd("All");

    return Promise.resolve(result);
  })
};

function makePng(data, width, height) {
  // var image = new Jimp(width, height, function (err, image) {
  //   image.bitmap.data = data;
  //   // this image is 256 x 256, every pixel is set to 0x00000000
  // });
}

// Start here

fs.readdir(baseDir, (err, files) => {
  dothedecodes(files).then((result) => {
    console.log('The result is: ', result);
  });
});


console.log('Thank you and good bye');
