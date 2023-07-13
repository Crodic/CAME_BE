const mongoose = require('mongoose');


const Connection = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1/artist', { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Connection successfully !!!');
    } catch (error) {
        console.log('Connection Fail !');
    }
}


module.exports = Connection