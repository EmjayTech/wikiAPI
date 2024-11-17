const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs")
const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/WikiDB").then(() => {
    console.log("MongoDB is connected successfully");
}).catch((err) => {
    console.log(err);
});

const articleSchema = new mongoose.Schema({
    title: String,
    content: String
});
const Article = mongoose.model("Article", articleSchema);

app.route("/articles")
.get(async(req, res) => {
    const foundArticle = await Article.find();
    if(foundArticle){
     res.status(200).send(foundArticle);
    }
    else{
     res.status(404).send("No data matching the request");
    };
 })
 
 .post((req, res) => {
    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });
     newArticle.save();
        if(newArticle){
            res.status(200).send("Sucessfully added an article");
        } else{
            res.status(404).send("Error");
        };
})

.delete(async(req, res) => {
    const deletedArticle = await Article.deleteMany();
    if(deletedArticle){
        res.status(200).send("Successfully deleted all articles")
    } else {
        res.status(404).send("It was not a success");
    }
});
app.route("/articles/:articleTitle")
.get(async(req, res) => {
    const foundArticle = await Article.findOne({
        title: req.params.articleTitle
    })
    if (foundArticle){
        res.status(200).send(foundArticle);
    } else {
        res.status(404).send("No articles matching that title was found.")
    }
})
.put(async(req, res) => {
    const UpdatedArticle = await Article.findOneAndUpdate(
        {title: req.params.articleTitle},
        {title: req.body.title, content: req.body.content},
        {overwrite: true},
        ); 
        if(UpdatedArticle){
            res.status(200).send("Successfully updated the article")
        } else{
            res.status(404).send("Error detected in updating the article.")
        };
})
.patch(async(req, res) => {
    const UpdatedArticle = await Article.findOneAndUpdate(
        { title: req.params.articleTitle},
        {$set: req.body}
    );
    if(UpdatedArticle){
        res.status(200).send("Successfully updated the selected article")
    } else{
        res.status(404).send("Error detected in updating the article.")
    };
})
.delete(async(req, res) => {
    const deletedArticle = await Article.deleteOne(
        {title: req.params.articleTitle},
    );
    if(deletedArticle){
        res.status(200).send("Successfully deleted the corresponding article")
    } else{
        res.status(404).send("Error detected in deleted the article.")
    };
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running at port ${port}`);
});