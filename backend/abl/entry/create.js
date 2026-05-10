const entryDao = require('../../dao/entry-dao');
const topicDao = require('../../dao/topic-dao');
const { validate, isValidationFailed, hasUnsupportedKeys } = require('../../helpers/validate');
const { createError, HOST } = require('../../helpers/error');

const COMMAND = 'entry/create';

const dtoInType = {
	type: 'object',
	properties: {
		title: { type: 'string', maxLength: 30 },
		text: { type: 'string', maxLength: 1800 },
		topicId: { type: 'string' }
	},
	required: ['title', 'text', 'topicId']
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

	const topic = topicDao.get(dtoIn.topicId);
	if (!topic) {
		throw createError(COMMAND, 'topicDoesNotExist', 'Topic with given id does not exist', {
			topicId: dtoIn.topicId
		}, 404);
	}

	const created = entryDao.create({
		title: dtoIn.title,
		text: dtoIn.text,
		topicId: dtoIn.topicId
	});

	const dtoOut = { ...created };
	if (warnings.length > 0) {
		dtoOut.warnings = warnings;
	}
	return dtoOut;
}

module.exports = {
	execute,
	dtoInType
};
