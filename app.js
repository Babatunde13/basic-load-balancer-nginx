const fs = require('fs')
const express = require('express');

const PORT = process.env.PORT || 3001
const DATA_DIR = process.env.DATA_DIR

const app = express();
app.use(express.json());

app.post('/:key', (req, res) => {
    const { key } = req.params;

    console.log(`Saving data at ${key}`);
    const destinationFile = `${DATA_DIR}/${key}.json`;
    fs.writeFileSync(destinationFile, JSON.stringify(req.body.data));
    res.send('OK');
});

app.get('/:key', (req, res) => {
    const { key } = req.params;

    console.log(`Retrieving data at ${key}`);
    const destinationFile = `${DATA_DIR}/${key}.json`;
    try {
        const data = fs.readFileSync(destinationFile);
        res.send(data);
    } catch (e) {
        res.status(404).send('Not Found');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
