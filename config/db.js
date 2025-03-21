require('dotenv').config();
const mongoose = require("mongoose");


// In this file we use Mongoose to connect to our MongoDB



mongoose
.connect(process.env.MONGODB_URI, {
// useNewUrlParser: true,  
// useUnifiedTopology: true,
})
.then(() => {
    console.log("DB Connected");
})
.catch((err) => console.log(err));

