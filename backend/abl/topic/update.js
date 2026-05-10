const topicDao = require('../../dao/topic-dao');
const { validate, isValidationFailed, hasUnsupportedKeys } = require('../../helpers/validate');
const { createError, HOST } = require('../../helpers/error');
const { TOPIC_CATEGORIES } = require('../../helpers/categories');

const COMMAND = 'topic/update';

const dtoInType = {
	type: 'object',
	properties: {
		id: { type: 'string' },
		title: { type: 'string', maxLength: 20 },
		category: { type: 'string', enum: TOPIC_CATEGORIES }
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

	const existing = topicDao.get(dtoIn.id);
	if (!existing) {
		throw createError(COMMAND, 'topicDoesNotExist', 'Topic with given id does not exist', {
			id: dtoIn.id
		}, 404);
	}

	const newTitle = dtoIn.title !== undefined ? dtoIn.title : existing.title;
	const newCategory = dtoIn.category !== undefined ? dtoIn.category : existing.category;

	if (newTitle !== existing.title || newCategory !== existing.category) {
		const duplicate = topicDao.findByTitleAndCategory(newTitle, newCategory);
		if (duplicate && duplicate.id !== dtoIn.id) {
			throw createError(COMMAND, 'topicAlreadyExists', 'Topic with given title and category already exists', {
				title: newTitle,
				category: newCategory
			});
		}
	}

	const changes = {};
	if (dtoIn.title !== undefined) changes.title = dtoIn.title;
	if (dtoIn.category !== undefined) changes.category = dtoIn.category;

	const updated = topicDao.update(dtoIn.id, changes);

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
