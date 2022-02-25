const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();
//parse incoming string or array data
app.use(express.urlencoded({ extended: true}));
// parse incoming JSON data
app.use(express.json());
app.use(express.static('public'));
//const notes  = require('./db/db.json');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

/*function createNewNotes(body) {
  fs.readFile('db/db.json', 'utf-8', (err, data) => {
      const notes = data;
      console.log(data);
    
    //console.log(notesArray);
    notes.push(body);
    console.log("================");
    console.log(data);
    console.log(body);
    console.log("================");
    fs.writeFileSync(
      path.join(__dirname, './db/db.json'),
      JSON.stringify({ notes }, null, 2)
    );
  })
  return notes;
} */


app.get('/api/notes', (req, res) => {
  fs.readFile('db/db.json', 'utf-8', (err, data) => {
    return err ? console.log(err) : res.json(JSON.parse(data));
  })
})

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

app.post('/api/notes', (req, res) => {
  // set id based on what the next index of the array will be

  req.body.id = uuidv4().toString();
  
  /*console.log(req.body);
  const note = createNewNotes(req.body);
  res.json(note);*/
  fs.readFile('db/db.json', 'utf-8', (err, data) => {
    if (err) throw err;
    const jsonFile = JSON.parse(data);
    jsonFile.push(req.body);
    console.log(jsonFile);
    fs.writeFile('db/db.json', JSON.stringify(jsonFile), (err, data) => {
      if (err) throw err;
      res.end(data);
    });
  })

});

// delete function
app.delete('/api/notes/:id', (req, res)=> {
  console.log(req.params.id);
  fs.readFile('db/db.json', 'utf-8', (err, data) => {
    if (err) throw err;
    const deleteFile = JSON.parse(data);
    const newFile = deleteFile.filter(note => note.id !== req.params.id);
    console.log(newFile);
    fs.writeFile('db/db.json', JSON.stringify(newFile), (err, data) => {
      if (err) throw err;
      res.end(data);
    });
  })
})

  app.listen(PORT, () => {
    console.log(`API server now on port 3001!`);
});