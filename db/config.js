const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/registerForm', {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.log(err);
});