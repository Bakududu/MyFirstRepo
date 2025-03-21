// API Route setup

const express = require('express');
const router = express.Router();

// mongodb user model
const User = require('./../models/User');

// Password handler
const bcrypt = require('bcrypt');          //to hash our pwd

// Signup 
router.post('/signup', (req, res) => {                    /* taking input from body of our request */
 let {name, email, password, dateOfBirth} = req.body;
 name = name.trim();
 email = email.trim();
 password = password.trim();
 dateOfBirth = dateOfBirth.trim();

            /* checking for the fields emptiness. */
 if (name == ""|| email == ""|| password == ""|| dateOfBirth == "") {
    res.json({             /* json object will return  d msg below, if inputs ar empty.*/      
      status: "FAILED",
      message: "Empty input fields!"
    });
}else if (!/^[a-zA-Z ]*$/.test(name)) {
    res.json({
        status: "FAILED",
        message: "Invalid name entered"
    }) 
} else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {     /* if email does't match regular expression */
    res.json({
        status: "FAILED",
        message: "Invalid email entered"
    }) 
    }else if ( !new Date(dateOfBirth).getTime()) {          /* after email pass our test we also, check for validity of our date */
        res.json({
            status: "FAILED",
            message: "Invalid date of birth entered"
        }) 
    } else if (password.length < 8 ) {          /* Checking d lenght our password */
        res.json({
            status: "FAILED",
            message: "Password is too short!"
        }) 
    }  else {       /* After all the above passed, it shuld start signup process by checking if d email is doesnt exist b4 
                        so we need to import "User" schema to top of this page, to make email checking work*/
        
        User.find({email}).then(result => {
            if (result.length) {
                // In case the user already exists
             res.json({
            status: "FAILED",
            message: "User with the provided email already exists" 
             })    
            } else {
                // If user no exist, Try to create new user

                // password handling (hash pwd)
                const saltRounds = 10; 
                bcrypt.hash(password, saltRounds).then(hashedPassword => {
                const newUser = new User({  /* After d pwd converted to hash, then we create newUser as: */
                    name,
                    email,
                    password: hashedPassword,
                    dateOfBirth
                });

                newUser.save().then(result => {      /* Then we save the user */
                    res.json({
                        status: "SUCCESS", 
                        message: "Signup successful",
                        data: result,                        /* we add data we just stored to be sent back to d client */
                    })
                })
                .catch(err => { 
                    res.json({
                        status: "FAILED",
                        message: "An error occured while saving user account!"    
                    })   
                })
            })
            .catch(err => {
                res.json({
                    status: "FAILED",
                    message: "An error occured while hashing password!"    
                })
            })
         }
        }).catch(err => {
            console.log(err);
            res.json({
            status: "FAILED",
            message: "An error occured while checking for existing user!" 
            })
        })
    }           

})

// Signin
router.post('/signin', (req, res) => {
        /* Sining to DB from body of our request */
        let { email, password} = req.body;
        email = email.trim();
        password = password.trim();

        if (email == "" || password == "") {
            res.json({
                status: "FAILED",
                message: "Empty credentials supplied"
            })   
        } else {
            // Check if user exist
            User.find({email})
            .then(data => {
                if (data.length) {
                    // User exists

                    const hashedPassword = data[0].password;
                    bcrypt.compare(password, hashedPassword).then(result => {
                        if (result) {
                            // Password match
                          res.json({
                            status: "SUCCESS",
                            message: "Signin successful",
                            data: data
                          })  
                        } else {
                            res.json({
                                status: "FAILED",
                                message: "Invalid password entered!"
                            })
                        }
                    })
                .catch(err => {
                    res.json({
                        status: "FAILED",
                        message: "An error occurred while comparing passwords"
                    })
                })
        } else {
            res.json({
                status: "FAILED",
                message: "Invalid credentials entered!"
            })
        }
    })
    .catch(err => {
        res.json({
            status: "FAILED",
            message: "An error occurred while checking for existing user"
        })
    })
  }
})
module.exports = router;