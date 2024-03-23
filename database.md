# v1.0 #

------------
AWS DynamoDB
------------


-------------------------
Create table - Data Cache
-------------------------
Hot Data Cache

* Table Name: data_cache
* Partition Key: p [string]
* Sort Key: id [number]

* Secondary Index: [NONE]
* Read/write capacity mode: On-demand


Table Structure
---------------
* p (String)    ->  [Partition Key] Cache Key for cache data ('StoreLastOrderUpdate'| ...)
* id (String)   ->  Cache Sort Key (Brand-ID.Store-ID|...)
* d (Anything)  ->  Cache Data. Can be Set or String or any type depending on specific data (LastModifiedUnixTime|...)
