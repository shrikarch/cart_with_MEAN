var mongodb = require('mongodb');

var uri = 'mongodb://localhost:27017/edx'; //DB connection link
mongodb.MongoClient.connect(uri, function(error, db) { //if no connection then return error or return an object called as db.
  if (error) {
    console.log(error);
    process.exit(1);
  }

  db.collection('sample').insert({ x: 1 }, function(error, result) {
    if (error) {
      console.log(error);
      process.exit(1);
    }

    db.collection('sample').find().toArray(function(error, docs) {
      if (error) {
        console.log(error);
        process.exit(1);
      }

      console.log('Found docs:');
      docs.forEach(function(doc) {
        console.log(JSON.stringify(doc));
      });
      process.exit(0);
    });
  });
});
