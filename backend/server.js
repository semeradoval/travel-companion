const express = require('express');

const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/', (req, res) => {
	res.send('Travel Companion backend is running.');
});

app.listen(PORT, () => {
	console.log(`Server listening on http://localhost:${PORT}`);
});
