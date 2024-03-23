// Info: Communication management SDK. Send, Track and Manage- sms, email, push-notification
'use strict';

// Shared Dependencies (Managed by Loader)
var Lib = {};



// Exclusive Dependencies
var CONFIG = require('./config'); // Loader can override it with Custom-Config


/////////////////////////// Module-Loader START ////////////////////////////////

  /********************************************************************
  Load dependencies and configurations

  @param {Set} shared_libs - Reference to libraries already loaded in memory by other modules
  @param {Set} config - Custom configuration in key-value pairs

  @return nothing
  *********************************************************************/
  const loader = function(shared_libs, config){

    // Shared Dependencies (Must be loaded in memory already)
    Lib.Utils = shared_libs.Utils;
    Lib.Debug = shared_libs.Debug;
    Lib.NoDB = shared_libs.NoDB;
    Lib.Instance = shared_libs.Instance;

    // Override default configuration
    if( !Lib.Utils.isNullOrUndefined(config) ){
      Object.assign(CONFIG, config); // Merge custom configuration with defaults
    }

  };

//////////////////////////// Module-Loader END /////////////////////////////////



///////////////////////////// Module Exports START /////////////////////////////
module.exports = function(shared_libs, config){

  // Run Loader
  loader(shared_libs, config);

  // Return
  return Cache;

};//////////////////////////// Module Exports END //////////////////////////////



///////////////////////////Public Functions START//////////////////////////////
const Cache = { // Public functions accessible by other modules

  /********************************************************************
  Set Cache data from database
  Though it's async function, but it runs in background.

  @param {reference} instance - Request Instance object reference

  @param {String} cache_code - Cache code ('StoreOrderLastUpdate' | ...)
  @param {String} key -  Parent ID (for e.g : Brand.Store)
  @param {String | Number | Set} data - Data to be saved in cache
  @param {Integer} [expiry] - (Optional) Expiration Time (in sec)

  @return - Thru Callback

  @callback(err, is_success) - Request Callback.
  * @callback {Error} err - Database Error
  * @callback {Boolean} is_success -  True if record created
  *********************************************************************/
  setCacheData: function(instance, cache_code, key, data, expiry){

    // NO-DB Record ID
    var db_record = {
      'p': cache_code, // Partition Key
      'id': key, // Sort Key
      'd': data,
      'toc': instance['time'],
    };


    // If expiry exist
    if( !Lib.Utils.isNullOrUndefined(expiry) ){
      // Add time-of-expiration to db-record
      db_record['toe'] = instance['time'] + expiry; // Session Expiry
    }


    // Create a background process in 'instance'
    const background_function_cleanup = Lib.Instance.backgroundRoutine(instance);


    // Add data from dynamodb
    Lib.NoDB.addRecord(
      instance,
      function(err, response){ // Callback function

        // Since it's a background process, do nothing in case of error. Do nothing with response.

        // Background function finished
        background_function_cleanup(instance);

      },
      CONFIG.DB_SOURCE, // Table Name
      db_record
    );

  },


  /********************************************************************
  Get Cache data from database

  @param {reference} instance - Request Instance object reference
  @param {Function} cb - Callback function to be invoked once async execution of this function is finished

  @param {String} cache_code - Cache code (StoreOrderLastUpdate | ...)
  @param {String} key - Parent ID

  @return - Thru Callback

  @callback(err, data, time_of_creation) - Request Callback.
  * @callback {Error} err - Database Error
  * @callback {Boolean | Number | String | Set} data -  Cache data
  * @callback {Number} time_of_creation - Time-Of-Creation  of this cache
  *********************************************************************/
  getCacheData : function (instance, cb, cache_code, key){

    // NO-DB Record ID
    var record_id = {
      'p': cache_code, // Partition Key
      'id': key, // Sort Key
    };

    // Get data from dynamodb
    Lib.NoDB.getRecord(
      instance,
      function(err, response){ // Callback function

        // Database Error
        if(err){
          return cb(err); // Return error and exit
        }

        // If data not found return data as null
        if(!response){
          return cb(null, null, null);
        }


        // Reach here means all good

         // Return Response
        return cb(
          null,
          response['d'], // data from cache
          response['toc'] // time-of-creation
        );

      },
      CONFIG.DB_SOURCE, // Table Name
      record_id
    );

  },


  /********************************************************************
  Get Cache List from database

  @param {reference} instance - Request Instance object reference
  @param {Function} cb - Callback function to be invoked once async execution of this function is finished

  @param {String} cache_code - Cache code (StoreOrderLastUpdate | StoreDeviceLastSettlement \ ...)
  @param {String} key - Parent ID
  @param {String} operator - Operator for Comparison

  @return - Thru Callback

  @callback(err, List) - Request Callback.
  * @callback {Error} err - Database Error
  * @callback {Boolean[] | Number[] | String[] | Set[]} List -  Cache List
  *********************************************************************/
  getCacheList : function (instance, cb, cache_code, key, operator){

    // Get Cache-List from dynamodb
    Lib.NoDB.queryRecords(
      instance,
      function(err, response_list){ // Callback function

        if(err){ // Print Database Error
          return cb(err); // Invoke callback with error
        }

        // Check for No Response
        if(!response_list){
          return cb(null, false)
        }


        // Reach here means all good

        // Return
        return cb(
          null, // No Error
          response_list
        );

      },
      CONFIG.DB_SOURCE, // Table Name
      null, // Secondary-Index
      'p', // Parition Key
      cache_code,  // Partition value
      null, // Fetch All Fields
      null, // Paging
      { // Condition
        'asc': true,
        'operator': operator,
        'key': 'id', // sort-key
        'value': key
      }
    );

  },

};///////////////////////////Public Functions END//////////////////////////////



//////////////////////////Private Functions START//////////////////////////////
const _Cache = { // Private functions accessible within this modules only


};//////////////////////////Private Functions END//////////////////////////////
