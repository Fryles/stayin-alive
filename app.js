const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const axios = require("axios");

app.use(
  bodyParser.json({ limit: "50mb", extended: true, parameterLimit: 50000 })
);


app.use('/', express.static('public'))

app.get("/explore", (req, res) => {
  fs.readFile("./timetable.json", "utf8", (err, data) => {
    if (err) throw err;
    data = JSON.parse(data);
    var postid = data[req.query.index];
    fs.readFile("./posts.json", "utf8", (err, data) => {
      if (err) throw err;
      data = JSON.parse(data);
      res.status(200).end(JSON.stringify(data[postid]));
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
    res.status(200).end("Succ"); //this shouldnt be here oh well
  });
  fs.readFile("./timetable.json", function (err, tt) {
    var json = JSON.parse(tt);
    json.unshift(uuid);
    fs.writeFile("./timetable.json", JSON.stringify(json), "utf8", (err) => {
      if (err) throw err;
    });
  });
});

app.get("/gitauth", (req, res) => {
  var code = req.query.code;
  //read secret so stinkys dont take it
  fs.readFile("./secret.json", function (err, read) {
    var json = JSON.parse(read);
    var secret = json.secret;
    var config = {
      headers: {
        Accept: "application/json",
      }
    }
    const url = "https://github.com/login/oauth/access_token/?client_id=1683b396d56e593c5732&client_secret="+secret+"&code=" + code;
    axios.post(url, JSON.stringify({
      "client_id": '1683b396d56e593c5732',
      "client_secret": secret,
      "code": code
    }),config)
    .then(function (response) {
      //set token and redirect to profile page
      res.cookie('token',response.data.access_token, { maxAge: 900000});
      res.status(200).send("<script>window.location.href='./profile'</script>")
    }).catch(function (error) {
      console.log("ERROR: "+error);
    });
  })
});

app.listen(80, () => {
  console.log("Server is listening on port 80");
});
