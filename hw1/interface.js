exports.insert = function(db, doc, callback) {

  db.collection('movies').insert(doc, function(error, result) {
      if (error) {
          console.log(error);
          process.exit(1);
      }
  });

  callback(null);
};

exports.byDirector = function(db, director, callback) {
    // TODO: implement
    db.collection('movies').find({ 'director': director }).sort({ 'title': 1 }).toArray(function(error, docs) {
        if (error) {
            console.log(error);
            process.exit(1);
        }

        console.log('Found movies:');
        docs.forEach(function(doc) {
            console.log(JSON.stringify(doc));
        });
        callback(null, docs); 
    });
};