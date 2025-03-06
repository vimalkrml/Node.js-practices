var Express = require("express");
var MongoClient = require("mongodb").MongoClient;
var cors = require("cors");
const multer = require("multer")

var app = Express();
app.use(cors());

var CONNECTION_STRING = "mongodb+srv://admin:abc@cluster0.s9nav.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

var DATABASENAME = "todoappdb";

var database;

app.listen(4001, () => {
    MongoClient.connect(CONNECTION_STRING, (error, client) => {
        database = client.db(DATABASENAME);
        console.log("Mongo DB Connection Successfull")
    })
})

app.get('/api/todoappdb/GetNotes', (request, response) => {
    database.collection("todoappcollection").find({}).toArray((error, result) => {
        response.send(result)
    })
})

app.post('/api/todoappdb/AddNotes', multer().none(), (request, response) => {
    database.collection("todoappcollection").count({}, function (error, numOfDocs) {
        database.collection("todoappcollection").insertOne({
            id: (numOfDocs + 1).toString(),
            description: request.body.newNotes
        })
        response.json("Added Successfully")
    })
})

app.delete('/api/todoappdb/DeleteNotes', (request, response) => {
    database.collection("todoappcollection").deleteOne({
        id: request.query.id
    })
    response.json("Deleted Successfully")
})