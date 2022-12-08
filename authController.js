
const connection =require('./index')
class authController {
    async registration(req, res) {
        try {

        } catch (error) {

        }
    }

    async login(req, res) {
        try {

        } catch (error) {

        }
    }

    async users(req, res) {
        const q = `SELECT * FROM revs `
        
       
    
        connection.query(q, (err, data) => {
            if (err) {
                return res.json(err)
                
            }
            console.log(data)
            return res.json(`Delete column  successfuly`)
        })
    }
}
module.exports=new authController