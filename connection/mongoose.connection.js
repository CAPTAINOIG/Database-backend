const mongoose = require ('mongoose')
let URI = process.env.URI



mongoose.connect(URI)

.then(()=>{
    console.log("Mongoose has connected successfully");
})
.catch((err)=>{
    console.log(err);
})