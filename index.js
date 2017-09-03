// This test will load an inage file and the run through barcode read and display the contents using different technolgoies

const fs = require('fs');
const path = require('path');
//const barcodeReader = require('barcode-reader');
const tiffjs = require('tiff.js');

const baseDir = './images';
const log = (...s) => { console.log((new Date).toString() + ': ', ...s); }

fs.readdir(baseDir, (err, files) => {
  files.forEach( file => {
    log('Processing', file);

    // If Tiff the load using tiff.js

    const ext = file.split('.').slice(1).pop().toLowerCase();

    
    if (ext == 'tif') {

    }
  });
});


console.log('Thank you and good bye');
