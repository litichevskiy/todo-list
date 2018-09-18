const PORT = process.env.PORT || 8000;
const express = require('express');
const path = require('path');
const app = express();

app.use('/dist', express.static(__dirname + '/dist'));
app.use('/src', express.static(__dirname + '/src'));
app.get('/', (req,res) => res.sendFile(path.join(__dirname+'/index.html')) );

app.listen( PORT, () => console.log(`server listening on port ${PORT}`));