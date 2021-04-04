const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
var request = require('request')

app.use(
  bodyParser.json({ limit: "50mb", extended: true, parameterLimit: 50000 })
);
app.use(express.static(__dirname + "/"));

app.get("/explore", (req, res) => {
  fs.readFile("./timetable.json", "utf8", (err, data) => {
    if (err) throw err;
    data = JSON.parse(data);
    var postid = data[req.query.index];
    fs.readFile("./posts.json", "utf8", (err, data) => {
      if (err) throw err;
      data = JSON.parse(data);
      res.status(200).end(data[postid]);
    });
  });
});

app.post("/post", (req, res) => {
  var uuid = uuidv4();
  var data = req.body;
  console.log(data);
  fs.readFile("./posts.json", function (err, existing) {
    var json = JSON.parse(existing);
    json[uuid] = data;
    fs.writeFile("./posts.json", JSON.stringify(json), "utf8", (err) => {
      if (err) throw err;
    });

    res.status(200).end(); //this shouldnt be here oh well
  });
  fs.readFile("./timetable.json", function (err, tt) {
    var json = JSON.parse(tt);
    json.unshift(uuid);
    fs.writeFile("./timetable.json", JSON.stringify(json), "utf8", (err) => {
      if (err) throw err;
    });

    res.status(200).end(); //this shouldnt be here oh well
  });
});

app.get("/gitauth", (req, res) => {
  var code = req.query.code
  //read secret so u stinkys dont take it
  
  request.post({
    url: 'https://github.com/login/oauth/access_token/?client_id=1683b396d56e593c5732&client_secret=92a2e6ac30db45612c4ed6ee4fbca22a95370807&code=' + code,
    headers: {
      'User-Agent': 'request'
    }
  }, function (error, response, body) {
        console.log('hi2');
        console.log(body);
  })
});

app.listen(80, () => {
  console.log("Server is listening on port 80");
});
