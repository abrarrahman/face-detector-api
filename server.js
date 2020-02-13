const express = require('express')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt');
const cors = require('cors');
const saltRounds = 10;
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const pg = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'abrar',
      password : 'webdev',
      database : 'face-detector'
    }
  });

const app = express()
app.use(bodyParser.json())
app.use(cors())

app.get('/',(req, res) => {
    pg('users').select('*')
        .then(users => res.json(users))
        .catch(err=>res.status(400).json('unable to retrieve users'));
})

app.post('/signin',(req,res)=> {signin.signinHandler(req,res,pg,bcrypt)});
app.post('/register', register.handleRegister(pg, bcrypt, saltRounds));
app.get('/profile/:id', profile.getProfile(pg));
app.put('/image', image.handleEntry(pg));
app.post('/imageurl', image.handleClarifaiCall);

app.listen(process.env.PORT || 3001, ()=> console.log(`server started on port ${process.env.PORT}`))