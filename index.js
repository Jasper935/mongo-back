
const express = require('express')
const app = express()
const cors = require('cors')
const env = require('./dbenv')
const bcr = require('bcryptjs')
const passport= require('passport')
const jwt =require('jsonwebtoken') 
const port = process.env.PORT || 8800
const sql = require('mysql')
require('dotenv').config()
require('./middleWare/passport')(passport)
app.use(express.json())
app.use(cors())
app.use(passport.initialize())
// app.use('/auth', authRouter)


const connection = sql.createConnection(env)
connection.connect(err => {
    if (err) {
        console.log(err);
    } else {
        console.log('database ++');
    }
})








app.listen(port, () => {
    console.log("started");
})

app.get('/reviews',  passport.authenticate('jwt',{ session: false }),  (req, res) => {
    const q = 'SELECT * FROM revs'
    // console.log('headers',req.headers);
    connection.query(q, (err, data) => {
        if (err) {
            return res.json(err)
        }
        return res.json(data)
    })

})
// passport.authenticate('jwt',{ session: false }),


app.post("/reviews", passport.authenticate('jwt',{ session: false }), (req, res) => {
// console.log(req.body);
    const obj = { name: req.body.name, work: req.body.work, text: req.body.text, date: req.body.date }

    const keys = Object.keys(obj)
    const values = Object.values(obj)
    const q = (`INSERT INTO revs (${keys.join(',')}) VALUES (${values.map(el => "'" + el + "'").join(',')});`)
    connection.query(q, [values], (err, data) => {
        if (err) {
            return res.json(err)
        }
        return res.json("Review create successful")
    })


})

app.delete('/reviews/:id', passport.authenticate('jwt',{ session: false }),(req, res) => {
    const q = `DELETE FROM revs WHERE ID=${req.params.id.slice(1)}`
    connection.query(q, (err, data) => {
        if (err) {
            return res.json(err)
        }
        return res.json(`Column was delete successfuly`)
    })

})

//------------AUTH=============================
// app.get('/auth/users',passport.authenticate('jwt',{ session: false }), (req, res) => {
//     const q = 'SELECT * FROM users;'

//     connection.query(q, (err, data) => {
//         if (err) {
//             return res.json(err)
//         }
//         return res.json(data)
//     })

// })

app.post('/auth/singup', (req, res) => {
    const salt = bcr.genSaltSync(6)

    connection.query(`SELECT * FROM users`, (err, data) => {
        if (err) {
            return res.json(err)
        }

        const IsEmailExist = data.some(({ email }) => req.body.email === email)
        if (IsEmailExist) {
            return res.json('email already exist')
        } else {
    

    const pass=bcr.hashSync(req.body.password, salt)
    console.log(pass);

    const q = (`INSERT INTO users (email, password) VALUES ('${req.body.email}', '${pass}');`)

        connection.query(q, (err, data) => {
        if (err) {
            return res.json(err)
        }
        
        })

            return res.json('Registration successfuly')
        }
    })
})

//----------------------------loGIN=============-=-=------------------=-=-=--=-
app.post('/auth/login', (req, res) => {
    

    connection.query(`SELECT * FROM users`, (err, data) => {
// console.log('params', req.params, "body",req.body);
        // const pass=bcr.compareSync(req.body.password, data.password)
        if (err) {
            return res.json(err)
        }
        const scsPass=data.find(({ password }) => req.body.password===password)
        const scsEmail=data.find(({ email}) => req.body.email===email)
       
       
        
        if (scsPass&&scsEmail) {
            const token =jwt.sign({userId:scsPass.id, email:scsEmail.email}, env.jwt,{expiresIn: 30})
            return res.json({status:200, message: "Success", token: 'Bearer ' +token })
        }else if(!scsEmail) {
            return res.json({status:400, message:`User with this email not found`})
        }
         else if(!scsPass) {
            return res.json({status:400,message:'Enter correct password'})
         }
    })
})



