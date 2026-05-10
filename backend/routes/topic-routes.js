const express = require('express');
const createAbl = require('../abl/topic/create');
const { buildErrorResponse } = require('../helpers/error');

const router = express.Router();

router.post('/create', (req, res) => {
	try {
		const dtoOut = createAbl.execute(req.body);
		res.json(dtoOut);
	} catch (err) {
		res.status(err.status || 500).json(buildErrorResponse(err));
	}
});

module.exports = router;
