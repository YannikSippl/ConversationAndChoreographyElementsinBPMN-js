const { readFile } = require('fs').promises;
const path = require('path');
const express = require('express');
const app = express();

app.use(express.static(__dirname));

app.get('/', async (req, res) => {
    try {
        const html = await readFile(path.join(__dirname, 'home.html'), 'utf-8');
        res.type('html').send(html);
    }
    catch (err) {
        console.error('Error reading home.html:', err);
        res.status(500).send('Error loading the page');
    }

});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});