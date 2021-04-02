const express = require('express')
const app = express()
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require('uuid');
const fs = require('fs')

app.use(express.static(__dirname + '/'));

app.get('/explore', (req, res) => {
	fs.readFile('./timetable.json' , 'utf8', (err, data) => {
		if (err) throw err;
		data = JSON.parse(data);
		index = req.query.index
		res.status(200).end(data[index]);
	})
	
});



app.listen(80, () => {
	console.log('Server is listening on port 80');
});