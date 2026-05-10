const express = require('express');
const topicRoutes = require('./routes/topic-routes');

const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/', (req, res) => {
	res.send('Travel Companion backend is running.');
});

app.use('/topic', topicRoutes);

app.listen(PORT, () => {
	console.log(`Server listening on http://localhost:${PORT}`);
});
