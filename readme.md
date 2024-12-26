# ElesticSearch + PG TypeScript TypeOrm 

API to insert products through CSV Upload, sample:

```csv
sku,name,description,category,price,image
IT000001,iPhone,the black brick phone,phones,123,https://placecats.com/neo_banana/300/200
```

## API

Post csv to /upload with key `items` in formData

* save the csv to disk with Multer. ✔️
* read the saved file from disk in a stream ✔️
* for every row, push a TASK to: ✔️
  * fetch the Image url (and handle errors)
  * save the product in the DB (handle errors)
* API should respond with progress status (stream) ✔️

Once upload is done, we trigger a JOB (BullMQ)

* ingest new data to ElasticSearch
* update cached routes (POSTPONED)

TODO: Dont fetch duplicate images

when processing the csv and fetching images, we should check if the imageUrl was downloaded previously, we make a copy of the existing image instead of downloading a new one

## UI

add /products page (catalogue)
add search filters 
add /products/id

Use ElasticSearch to implement filters and searchBar


