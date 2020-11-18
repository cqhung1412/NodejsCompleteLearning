const MongoClient = require('mongodb').MongoClient;

const user = 'cqhung1412';
const password = '9Jj7pemPcodC7ULy';
const dbname = 'shop';

const uri = `mongodb+srv://${user}:${password}@nodejs-cluster0.pvske.mongodb.net/${dbname}?retryWrites=true&w=majority`;

const mongoConnect = callback => {
  const client = new MongoClient(uri, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
  });
  client.connect()
    .then(client => {
      callback(client);
    })
    .catch(err => {
      const collection = client.db("test").collection("devices");
      // perform actions on the collection object
      client.close();
    })
}

module.exports = mongoConnect;