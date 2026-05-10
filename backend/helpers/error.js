const HOST = 'travel-companion';

function createError(command, code, message, params = {}, status = 400) {
	const error = new Error(message);
	error.code = `${HOST}/${command}/${code}`;
	error.message = message;
	error.params = params;
	error.status = status;
	return error;
}

function buildErrorResponse(error) {
	return {
		code: error.code,
		message: error.message,
		params: error.params
	};
}

module.exports = {
	HOST,
	createError,
	buildErrorResponse
};
