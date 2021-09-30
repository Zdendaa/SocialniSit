const mongoose = require('mongoose'); // mongoDb

// pripojeni k databazi

const connect = () => {
    mongoose.connect(process.env.DB_CONNECT, { 
        //useNewUrlParser: true,
        //useUnifiedTopology: true,
        //useFindAndModify: false,
        //useCreateIndex: true
        // diky mongoose verze 6.0.6 tohle nastaveni jiz nepotrebujeme
        }, (err) => {
          if (err) throw new Error("k databazi se nejde pripojit");
          console.log("pripojeno uspesne k databazi");
    })
}

module.exports = connect;
