import { MongoClient } from 'mongodb';

let dbConnection;
const uri = 'mongodb+srv://fatmaceydaoruc:LRAFT7oWoKoZCnxG@mizc.lqrvyb4.mongodb.net/mizcbeauty?retryWrites=true&w=majority';

const connectToDb = (cb) => {
    MongoClient.connect(uri)
        .then((client) => {
            dbConnection = client.db();
            console.log('Veritabanına başarılı bir şekilde bağlanıldı.');
            cb();
        })
        .catch((err) => {
            console.log('Veritabanına bağlanma hatası:', err);
            cb(err);
        });
};

const getDb = () => dbConnection;

export { connectToDb, getDb };
