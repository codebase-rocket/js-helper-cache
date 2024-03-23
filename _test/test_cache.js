// Info: Test Cases
'use strict';
var Lib = {};

// Load Project Dependencies and Configration
Lib.Utils = require('js-helper-utils')
Lib.Debug = require('js-helper-debug')(Lib)
Lib.Instance = require('js-helper-instance')(Lib)
// Lib.aws-sdk = require('aws-sdk')(Lib)
Lib.NoDB = require('js-helper-aws-dynamodb')(Lib, )
Lib.Cache = require('js-helper-cache')(Lib, )



////////////////////////////SIMILUTATIONS//////////////////////////////////////

function output_handler(err, response){ // Err, Result are from previous function

  if(err){ // If error
    console.log('Error Code:', err.code );
    console.log('Error Msg:', err.message );
  }
  else{
    console.log('Response:', response );
  }

  // cleanup instance - close open connections
  Lib.Instance.cleanup(instance);

};

///////////////////////////////////////////////////////////////////////////////


/////////////////////////////STAGE SETUP///////////////////////////////////////

// Initialize Instance Object
var instance = Lib.Instance.initialize();

// Test Group-1
var tg1_org_id = 'sag9ed';
var tg1_brand_id = 'cvdf2';
var tg2_brand_id = 'mwqgl';
var custom_domain = 'example.com';
var sub_domain = 'religo.com';


// Test Group-2 (Test stores from India)
var tg2_brand_id = 'cvdf2r8xhmbp2wl07y3hjj95k';


///////////////////////////////////////////////////////////////////////////////


/////////////////////////////////TESTS/////////////////////////////////////////

// Test getBrandDeepDataFromDbUsingCustomDomain() function
// console.log( // Output: ...
//   "getBrandDeepDataFromDbUsingCustomDomain(...)",
//   Lib.BrandDb.getBrandDeepDataFromDbUsingCustomDomain(
//     instance, output_handler,
//     custom_domain
//   )
// );



// Test setCacheData
// Lib.Debug.log(
//   Lib.Cache.setCacheData(
//     instance, output_handler,
//     'abc', // cache data
//     'test', //key
//     {'d': 12}, // data
//     12 // expiry
//   )
// );



// Test getCacheData
// Lib.Debug.log(
//   Lib.Cache.getCacheData(
//     instance, output_handler,
//     'abc', // cache data
//     'test', //key
//   )
// );

///////////////////////////////////////////////////////////////////////////////
