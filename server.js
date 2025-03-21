// mongodb         
require('./config/db');                /* ....it give us access 2 our MongoDB database */ 

const app = require('express')();                 /*express is a library for nodejs, so as to start server*/
// const port = 3000;
const port = process.env.PORT || 3000;                     /*(for heroku connection replace that line above)*/


const UserRouter = require('./api/User');        /* we direct our application to use d user api-router we created in user.js f */

// For accepting post form data
const bodyParser = require('express').json;
app.use(bodyParser());

app.use('/user', UserRouter)    /* directing our app to use router we created at user.js file */

app.listen(port, () => {
        console.log(`Server running on port ${port}`);
})