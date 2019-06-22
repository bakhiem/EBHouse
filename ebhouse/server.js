const express = require("express");
const path = require("path");

const app = express();
app.use(express.static(__dirname + '/dist/ebhouse'));
app.get("/*", (req,res) =>{
    res.sendFile(path.join(__dirname + '/dist/ebhouse',"index.html"));
});

const port = process.env.PORT || 6969;

app.listen(port, err => {
  if (err) console.log(err);
  console.log("Server started at port " + port);
});