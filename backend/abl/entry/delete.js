const entryDao = require('../../dao/entry-dao');
const { validate, isValidationFailed, hasUnsupportedKeys } = require('../../helpers/validate');
const { createError, HOST } = require('../../helpers/error');

const COMMAND = 'entry/delete';

const dtoInType = {
	type: 'object',
	properties: {
		id: { type: 'string' }
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

	const removed = entryDao.remove(dtoIn.id);

	const dtoOut = { ...removed };
	if (warnings.length > 0) {
		dtoOut.warnings = warnings;
	}
	return dtoOut;
}

module.exports = {
	execute,
	dtoInType
};
