const express = require('express');
const createAbl = require('../abl/topic/create');
const getAbl = require('../abl/topic/get');
const listAbl = require('../abl/topic/list');
const updateAbl = require('../abl/topic/update');
const deleteAbl = require('../abl/topic/delete');
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

router.get('/get', (req, res) => {
	try {
		const dtoOut = getAbl.execute(req.query);
		res.json(dtoOut);
	} catch (err) {
		res.status(err.status || 500).json(buildErrorResponse(err));
	}
});

router.get('/list', (req, res) => {
	try {
		const dtoOut = listAbl.execute(req.query);
		res.json(dtoOut);
	} catch (err) {
		res.status(err.status || 500).json(buildErrorResponse(err));
	}
});

router.post('/update', (req, res) => {
	try {
		const dtoOut = updateAbl.execute(req.body);
		res.json(dtoOut);
	} catch (err) {
		res.status(err.status || 500).json(buildErrorResponse(err));
	}
});

router.post('/delete', (req, res) => {
	try {
		const dtoOut = deleteAbl.execute(req.body);
		res.json(dtoOut);
	} catch (err) {
		res.status(err.status || 500).json(buildErrorResponse(err));
	}
});

module.exports = router;
