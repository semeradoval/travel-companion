const entryDao = require('../../dao/entry-dao');
const topicDao = require('../../dao/topic-dao');
const { validate, isValidationFailed, hasUnsupportedKeys } = require('../../helpers/validate');
const { createError, HOST } = require('../../helpers/error');

const COMMAND = 'entry/update';

const dtoInType = {
	type: 'object',
	properties: {
		id: { type: 'string' },
		title: { type: 'string', maxLength: 30 },
		text: { type: 'string', maxLength: 1800 },
		topicId: { type: 'string' }
	},
	required: ['id']
};

function execute(dtoIn) {
	const validationResult = validate(dtoIn, dtoInType);

	if (isValidationFailed(validationResult)) {
		throw createError(COMMAND, 'invalidDtoIn', 'dtoIn is not valid', {
			invalidTypeKeyMap: validationResult.invalidTypeKeyMap,
			invalidValueKeyMap: validationResult.invalidValueKeyMap,
			missingKeyMap: validationResult.missingKeyMap
		});
	}

	const warnings = [];
	if (hasUnsupportedKeys(validationResult)) {
		warnings.push({
			code: `${HOST}/${COMMAND}/unsupportedKeys`,
			message: 'dtoIn contains unsupported keys',
			params: { unsupportedKeyList: validationResult.unsupportedKeyList }
		});
	}

	const existing = entryDao.get(dtoIn.id);
	if (!existing) {
		throw createError(COMMAND, 'entryDoesNotExist', 'Entry with given id does not exist', {
			id: dtoIn.id
		}, 404);
	}

	if (dtoIn.topicId !== undefined && dtoIn.topicId !== existing.topicId) {
		const topic = topicDao.get(dtoIn.topicId);
		if (!topic) {
			throw createError(COMMAND, 'topicDoesNotExist', 'Topic with given id does not exist', {
				topicId: dtoIn.topicId
			}, 404);
		}
	}

	const changes = {};
	if (dtoIn.title !== undefined) changes.title = dtoIn.title;
	if (dtoIn.text !== undefined) changes.text = dtoIn.text;
	if (dtoIn.topicId !== undefined) changes.topicId = dtoIn.topicId;

	const updated = entryDao.update(dtoIn.id, changes);

	const dtoOut = { ...updated };
	if (warnings.length > 0) {
		dtoOut.warnings = warnings;
	}
	return dtoOut;
}

module.exports = {
	execute,
	dtoInType
};
