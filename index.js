// This test will load an inage file and the run through barcode read and display the contents using different technolgoies

const fs = require('fs');
const path = require('path');
//const barcodeReader = require('barcode-reader');
const Tiff = require('tiff.js');
const UTIF = require('utif');

// const baseDir = './images';
const baseDir = '/users/pbartlett/desktop/NJ Registration Images/';
const log = (...s) => { console.log((new Date).toString() + ': ', ...s); }

fs.readdir(baseDir, (err, files) => {
  files.forEach( file => {
    //log('Processing', file);

    // If Tiff the load using tiff.js

    const ext = file.split('.').slice(1).pop();//.toLowerCase();

    if (ext == 'tif') {
      log('TIF file', file);

      const filename = baseDir + file;
      var data = fs.readFileSync(filename);
      log(`  TIFF file:`, data.length);

      var image = new Tiff({ buffer: data });
      log(' ', JSON.stringify(image));
      log(`    TIFF.js Width: ${image.width()} Height: ${image.height()}`);

      var page = UTIF.decode(data);
      log(`    UTIF ${page.length}`);

    }
  });
});


console.log('Thank you and good bye');
