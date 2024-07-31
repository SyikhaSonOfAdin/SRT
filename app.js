require('dotenv').config();

const express = require('express')  ;
const path = require('path') ;
const cors = require('cors');
const ARRAY_OF_PATHS = require('./.conf/.conf_path');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '')));


app.get('/', (req, res) =>{
    res.send('<h1>Hi Your SRT API is Available🚀</h1>')
})


app.use('/api/post', ...ARRAY_OF_PATHS.POST)
app.use('/api/get', ...ARRAY_OF_PATHS.GET)

app.listen(process.env.PORT || port, () => {
    console.log(`Server berjalan di port ${port} on http://localhost:${port}`);
});

