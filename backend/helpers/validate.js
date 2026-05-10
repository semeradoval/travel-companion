function validate(dtoIn, dtoInType) {
	const result = {
		unsupportedKeyList: [],
		missingKeyMap: {},
		invalidTypeKeyMap: {},
		invalidValueKeyMap: {}
	};

	const allowedKeys = Object.keys(dtoInType.properties || {});
	const requiredKeys = dtoInType.required || [];

	for (const key of Object.keys(dtoIn)) {
		if (!allowedKeys.includes(key)) {
			result.unsupportedKeyList.push(key);
		}
	}

	for (const key of requiredKeys) {
		if (!(key in dtoIn)) {
			result.missingKeyMap[key] = 'missing required key';
		}
	}

	for (const key of Object.keys(dtoIn)) {
		if (!allowedKeys.includes(key)) continue;

		const rules = dtoInType.properties[key];
		const value = dtoIn[key];

		if (rules.type && typeof value !== rules.type) {
			result.invalidTypeKeyMap[key] = `expected ${rules.type}, got ${typeof value}`;
			continue;
		}

		if (rules.maxLength !== undefined && typeof value === 'string' && value.length > rules.maxLength) {
			result.invalidValueKeyMap[key] = `exceeds max length ${rules.maxLength}`;
		}

		if (rules.minLength !== undefined && typeof value === 'string' && value.length < rules.minLength) {
			result.invalidValueKeyMap[key] = `below min length ${rules.minLength}`;
		}

		if (rules.enum && !rules.enum.includes(value)) {
			result.invalidValueKeyMap[key] = `must be one of: ${rules.enum.join(', ')}`;
		}
	}

	return result;
}

function isValidationFailed(result) {
	return (
		Object.keys(result.missingKeyMap).length > 0 ||
		Object.keys(result.invalidTypeKeyMap).length > 0 ||
		Object.keys(result.invalidValueKeyMap).length > 0
	);
}

function hasUnsupportedKeys(result) {
	return result.unsupportedKeyList.length > 0;
}

module.exports = {
	validate,
	isValidationFailed,
	hasUnsupportedKeys
};
