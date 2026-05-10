const entryDao = require('../../dao/entry-dao');
const { validate, isValidationFailed, hasUnsupportedKeys } = require('../../helpers/validate');
const { createError, HOST } = require('../../helpers/error');

const COMMAND = 'entry/list';

const dtoInType = {
	type: 'object',
	properties: {
		topicId: { type: 'string' }
	},
	required: []
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

	const filter = {};
	if (dtoIn.topicId) {
		filter.topicId = dtoIn.topicId;
	}
	const items = entryDao.list(filter);

	const dtoOut = { itemList: items };
	if (warnings.length > 0) {
		dtoOut.warnings = warnings;
	}
	return dtoOut;
}

module.exports = {
	execute,
	dtoInType
};
