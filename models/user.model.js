const mongoose = require ('mongoose')
const bcrypt = require ("bcryptjs")

let newSchema = new mongoose.Schema({
    firstName: {type:String, required:true},
    lastName: {type: String, required:true},
    email: {type:String, required:true, unique:true},
    password: {type:String, required:true},
    phone: {type:String,required:true},
    dob: {type: String, required:true},
    matric: {type:String, required:true},
    image: {type:String, default:""},
    otp: {type:Number},
    logo: {type:String},
    date: {type: Date, default: Date.now()} 
})



let saltRounds = 10
newSchema.pre('save', function(next){
    console.log(this.password);
    bcrypt.hash(this.password, saltRounds)

.then((response) => {
    console.log(response);
    this.password = response
    next()
})
.catch(err =>{
    console.log(err);
})
})


newSchema.methods.validatePassword = function(password, callback){
    console.log(password);
    console.log(this);
    bcrypt.compare(password,this.password,(err,same)=>{
        console.log(same);
        if(!err){
            callback(err, same)
        }else{
            next()
        }
    })
}
let userModel = mongoose.model("halls", newSchema)


module.exports = userModel