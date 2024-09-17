const mongoose = require('mongoose'); 

const notebookSchema = mongoose.Schema({
    title: {type: String}, 
    bannerImg: {type: String, default: 'https://placehold.co/600x400'}, 
    created: {type: Date, default: new Date().getTime()}, 
    updated: {type: Date, default: new Date().getTime()}, 
});

module.exports = mongoose.model("Notebook", notebookSchema);