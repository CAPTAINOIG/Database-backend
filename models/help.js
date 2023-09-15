const mongoose = require ("mongoose")

let helpSchema = new mongoose.Schema({
    subject: {type: String,},
    crash: {type: String,}
},  {timestamps: true})

let help = mongoose.model("crashReport", helpSchema)

module.exports = help

