const topicDao = require('../../dao/topic-dao');
const { validate, isValidationFailed, hasUnsupportedKeys } = require('../../helpers/validate');
const { createError, HOST } = require('../../helpers/error');
const { TOPIC_CATEGORIES } = require('../../helpers/categories');

const COMMAND = 'topic/create';

const dtoInType = {
	type: 'object',
	properties: {
		title: { type: 'string', maxLength: 20 },
		category: { type: 'string', enum: TOPIC_CATEGORIES }
	},
	required: ['title', 'category']
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

	const existing = topicDao.findByTitleAndCategory(dtoIn.title, dtoIn.category);
	if (existing) {
		throw createError(COMMAND, 'topicAlreadyExists', 'Topic with given title and category already exists', {
			title: dtoIn.title,
			category: dtoIn.category
		});
	}

	const created = topicDao.create({
		title: dtoIn.title,
		category: dtoIn.category
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
