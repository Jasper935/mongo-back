const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const sql = require('mysql')
const config=require('../dbenv')
const connection = sql.createConnection(config)
connection.connect(err => {
    if (err) {
        console.log(err);
    } else {
        console.log('database ++ passport');
    }
})
const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.jwt,
    

}
module.exports=(passport)=>{
passport.use(new JwtStrategy(options, (payload, done)=>{
    try {
        connection.query(`SELECT 'id', 'email' FROM users WHERE id='${payload.userId}'`, (err, data, fields)=>{
            if (err){
                console.log(err);
            }else{
                const user = data
                if(user){
                    done(null, user)
                }else{
                    done(null, false)
                }
            }
        } )
    } catch (er) {
        console.log(er);
    }
}))
}