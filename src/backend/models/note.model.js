const mongoose = require('mongoose'); 
const Schema = mongoose.Schema; 

const noteSchema = Schema({
    title: {type: String}, 
    text: {type: String}, 
    tags: {type: Array}, 
    notebooks: {type: Array}, 
    created: {type: Date, default: new Date().getTime()}, 
    updated: {type: Date, default: new Date().getTime()} 
});

module.exports = mongoose.model("Note", noteSchema);