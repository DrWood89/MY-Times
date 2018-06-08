//require dependencies
var express = require("express");
var mongoose = require("mongoose");
var expressHandlebars = require("express-handlebars");
var bodyParser = require("body-parser");

//set up our ports
var PORT = process.env.PORT || 3000;

//Instantiate our express App
var app = express();

//Set up Express router
var router = express.Router();

//require routes
require("./config/routes")(router);

//Designate public folder as a static directory
app.use(express.static(__dirname + "/public"));

//connect handlebars to Express app
app.engine("handlebars", expressHandlebars({
    defaultLayout: "main"
}));
app.set("view engine", "handlebars");

//use bodyParser
app.use(bodyParser.urlencoded({
    extended: false
}));

//make router our intermediate
app.use(router);

//if deployed, use deployed database. Otherwise use the local mongoHeadlines database
var db = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

//connect mongoose to our databse 
mongoose.connect(db, function(error) {
    //log any errors connecting with mongoose
    if (error) {
        console.log(error);
    }else {
        console.log("mongoose connection is succesful");
    }
})

// listen on port
app.listen(PORT, function () {
    console.log("listening on port:" + PORT);
});