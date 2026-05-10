const express = require('express');
const createAbl = require('../abl/entry/create');
const getAbl = require('../abl/entry/get');
const listAbl = require('../abl/entry/list');
const updateAbl = require('../abl/entry/update');
const deleteAbl = require('../abl/entry/delete');
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
