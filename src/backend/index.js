const config = require("./config.json"); 
const mongoose = require("mongoose");
const utils = require('./utils');

const express = require("express");
const cors = require("cors");
const { escape } = require("querystring");
const app = express(); 

mongoose.connect(config.connString);
const NotebookMDB = require('./models/notebook.model.js');
const NoteMDB = require('./models/note.model.js');


app.use(express.json()); 

app.use(
    cors({
        origin: "*",
    })
)

/*********************************
Notebook
**********************************

    title: {type: String}, 
    bannerImg: {type: String}, 
    created: {type: Date, default: new Date().getTime()}, 
    updated: {type: Date, default: new Date().getTime()}, 
*/

// params: ids
app.get("/notebook", async (req, res) => {
    const {ids, filter} = req.query;

    const searchCriteria = {}

    if(ids)
        searchCriteria['_id'] = {$in: ids.split(",").map(id => id.trim())}
        
    if(filter && filter != 'undefined')
        searchCriteria['$or'] = [
            {title: {"$regex": filter, "$options": "i"}}
        ]

    const resp = await NotebookMDB.find(searchCriteria)
    res.json(utils.formatMessage(0, "Retrieved records", resp))
})

app.post("/notebook", async (req, res) => {
    const {notebookId} = req.query;
    const {title, notebookBannerImg} = req.body; 

    console.log(title, notebookBannerImg)

    if(!notebookId){
        const newNotebook = new NotebookMDB({
            title: title, 
            bannerImg: notebookBannerImg
        }); 
        await newNotebook.save(); 
        return res.json(utils.formatMessage(0, "Notebook created", [{id: newNotebook.id}]))
    }else {
        const upatedNotebook = await NotebookMDB.updateOne(
            {_id: notebookId}, 
            {$set: {
                title: title, 
                bannerImg: notebookBannerImg
            }}
        )
        return res.json(utils.formatMessage(0, "Record Updated"))
    }
})

// params: id={string[]} (comma separated)
app.delete("/notebook", async (req, res) => {
    const {ids} = req.query

    const idList = ids.split(",").map(id => id.trim())

    if(!ids || idList.length < 0) 
        return res.json(utils.formatMessage(100, "Parameter `ids` cannot be empty"))

    const resp = await NotebookMDB.deleteMany({_id: {$in: idList}});
    return res.json(utils.formatMessage(0, "Record Updated"))
})



/*********************************
Note
**********************************

    title: {type: String}, 
    text: {type: String}, 
    created: {type: Date, default: new Date().getTime()}, 
    updated: {type: Date, default: new Date().getTime()}
*/

/*
params: noteId={string} 
> if noteId is empty, create new note, otherwise update existing one
body: {
    title?:string, 
    text?:string,
    notebooks?:string[],
    tags?:string[]
}
*/
app.post("/note", async (req, res) => {
    const {noteId} = req.query;
    const {title, text, notebooks, tags, updated} = req.body;

    if(!noteId){
        const createdNote = new NoteMDB({
            title: title, 
            text: text, 
            notebooks: notebooks, 
            tags: tags, 
            updated: updated
        }); 
        await createdNote.save(); 
        return res.json(utils.formatMessage(0, "Record created", {id: createdNote.id}))
    }else{
        const upsertResp = await NoteMDB.updateOne(
            {_id: noteId}, 
            {$set: {
                title: title, 
                text: text, 
                notebooks: notebooks, 
                tags: tags, 
                updated: updated
            }}
        )
        return res.json(utils.formatMessage(0, "Record Updated"))
    }
})

// params: noteId={[]string} or notebookId={string}
app.get("/note", async (req, res) => {
    const {noteId, notebookId, filter} = req.query;
    let searchCriteria = {}

    if(noteId)
        searchCriteria['_id'] = noteId.split(",").map(id => id.trim())
    
    if(notebookId)
        searchCriteria['notebooks'] = notebookId

    if(filter && filter != 'undefined')
        searchCriteria['$or'] = [
            {title: {"$regex": filter, "$options": "i"}},
            {text: {"$regex": filter, "$options": "i"}},
            {tags: {"$regex": filter, "$options": "i"}},
        ]


    const queryRes = await NoteMDB.find(searchCriteria)
    return res.json(utils.formatMessage(0, "Retrieved records", queryRes))
})


// params: ids={[]string} 
app.delete("/note", async (req, res) => {
    const {ids} = req.query;

    const idList = ids.split(",").map(id => id.trim())

    if(!ids || idList.length < 0) return res.json({
        error: true, 
        message: `ids parameter cannot be empty`
    })

    //acknowledged:true,deletedCount

    const resp = await NoteMDB.deleteMany({_id: {$in: idList}})
    return res.json(utils.formatMessage(0, "Deleted records", {
        ids: idList, 
        ...resp
    }))
})




app.get("/", (req, res) => {
    res.json({data: "Hello"})
})

app.listen("8000")
module.exports = app;