const MongoClient = require('mongodb').MongoClient;

const user = 'cqhung1412';
const password = 'jaVFccX3gHd47Qh4';
const dbname = 'shop';

const uri = `mongodb+srv://${user}:${password}@nodejs-cluster0.pvske.mongodb.net/${dbname}?retryWrites=true&w=majority`;

let _db;

const mongoConnect = callback => {
  const client = new MongoClient(uri, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
  });
  client.connect()
    .then(client => {
      _db = client.db();
      callback();
    })
    .catch(err => {
      const collection = client.db("test").collection("devices");
      // perform actions on the collection object
      console.log(err);
      client.close();
      throw err;
    });
}

const getDatabase = () => {
  if(_db) {
    return _db;
  }
  throw 'No database available!';
}

exports.mongoConnect = mongoConnect;
exports.getDatabase = getDatabase;