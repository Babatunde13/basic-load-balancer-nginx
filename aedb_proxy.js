const express = require('express');
const axios = require('axios');

const SHARD_ADDRESSES = ['http://localhost:3001', 'http://localhost:3002'];
const SHARD_COUNT = SHARD_ADDRESSES.length;

const app = express();
app.use(express.json());

const getShardNumber = (key) => {
    return key.charCodeAt(0) % SHARD_COUNT;
}

const getShardEndpoint = (key) => {
    const shardNumber = getShardNumber(key);
    return `${SHARD_ADDRESSES[shardNumber]}/${key}`;
}

app.post('/:key', async (req, res) => {
    const { key } = req.params;
    const shardEndpoint = getShardEndpoint(key);
    console.log(`Forwarding to: ${shardEndpoint}`);
    try {
        await axios.post(shardEndpoint, req.body);
        res.send('OK');
    } catch (e) {
        res.status(500).send('Error');
    }
});

app.get('/:key', async (req, res) => {
    const { key } = req.params;
    const shardEndpoint = getShardEndpoint(key);
    console.log(`Forwarding to: ${shardEndpoint}`);
    try {
        const response = await axios.get(shardEndpoint);
        res.send(response.data);
    } catch (e) {
        res.status(500).send('Error');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
