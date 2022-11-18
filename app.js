const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")

const app = express()

app.set("view engine", "ejs")

app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static("public"))

mongoose.connect("mongodb+srv://AdminAjith:@cluster0.wc75hh7.mongodb.net/todoListDB")

const itemsSchema = {
    name: String
}

const Item = mongoose.model("Item", itemsSchema)

const item1 = new Item({
    name: "A simple todo list"
})

const item2 = new Item({
    name: "+ to add new item"
})

const item3 = new Item({
    name: "Checkbox to delete the item"
})

const defaultItem = [item1,item2,item3]


app.get("/" , (req, res) =>{

    let tday = new Date()
   
    let options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    }

    let day = tday.toLocaleDateString("en-US", options)

    Item.find({}, function (err,foundItems) {
        if(foundItems.length === 0){
            Item.insertMany(defaultItem , function (err) {
            if (err) {
             console.log(err);
            } else {
             console.log("SUCESS");
            }
            })
            res.redirect("/")
        }
        else{
         res.render("list", {days: day ,itemNews: foundItems})
        }
    })
})

app.post("/" , (req, res) =>{
    let itemName = req.body.newItem
    const item = new Item({
        name: itemName
    })
    item.save()

    res.redirect("/")
})

app.post("/delete", (req,res) =>{
    const checkedItem = req.body.checkbox
    Item.findByIdAndRemove(checkedItem, function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("SUCCESSFULLY DELETED");
            res.redirect("/")
        }
    })
})

let port = process.env.PORT;
if (port == null || port == "") {
  port = 4000;
}

app.listen(port, () =>{
    console.log("start of server");
})
