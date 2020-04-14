const logger = require('../../config/logger')
const ModuleFile = logger.getModuleName(module)
const dateFNS = require('date-fns')

// From https://www.restapitutorial.com/httpstatuscodes.html
/**
 * A HTTP response object with various reposnse codes.
 * @typedef  {Object<string, any>} HTTPResp
 * @property {number} BadRequest 400 The request made was not supported.
 * @property {number} Conflict 409 There was a conflict in processing.
 * @property {number} Created 201 The item was created successfully.
 * @property {number} InternalServerError 500 There was a problem with the server.
 * @property {number} NotFound 404 The resource requested was not found.
 * @property {number} NotImplemented 501 The resource requested has not been implemented.
 * @property {number} OK 200 Everything worked as expected.
 * @property {number} RequestTimeout 408 The request timed out.
 * @property {number} ServiceUnavailable 503 The service requested is not available.
 * @property {number} Unauthorised 401 The user requesting the resource needs higher authorisation.
 */
/**
 * @type {HTTPResp} httpresp
 */
const HTTPResp = {
	BadRequest: 400,
	Conflict: 409,
	Created: 201,
	InternalServerError: 500,
	NotFound: 404,
	NotImplemented: 501,
	OK: 200,
	RequestTimeout: 408,
	ServiceUnavailable: 503,
	Unauthorised: 401
}

/**
 * Removes extension from file
 * @param {string} file - filename
 */
exports.removeExtensionFromFile = file => {
	const _logger = logger.child({file: ModuleFile, method: 'removeExtensionFromFile' })

	return file.split('.')
				.slice(0, -1)
				.join('.')
				.toString()
}

/**
 * Returns the proper phrasing for a given number of elements
 * @param {array} arr - The array of items
 * @param {string} basePhrase - The base phrase to use when constructing the proper phrase
 * @returns {string}
 */
exports.getPhrase = (arr, basePhrase) => {
	const _logger = logger.child({file: ModuleFile, method: 'getPhrase' })
	if (arr.length > 1) {
		return `${basePhrase}s`
	} else {
		return `${basePhrase}`
	}
}

/**
 * Handles error by printing to console in development env and builds and sends an error response
 * @param {Object} res - response object
 * @param {Object} err - error object
 */
exports.handleError = (res, err) => {
	const _logger = logger.child({file: ModuleFile, method: 'handleError' })

	// Prints error in console
	if (process.env.NODE_ENV === 'development') {
		// log the whole object to the console. this is so we can see what it is without the logger messing it up
		// console.log(err, 'handleError')

		if (typeof err.message == 'string') {
			err.message = err.message.split(',')
		}

		for (let ErrorMsg of err.message) {
			const ErrParm = ErrorMsg.param ? ErrorMsg.param : ErrorMsg
			const ErrSuffix = ErrorMsg.msg ? `is ${ErrorMsg.msg} from ${ErrorMsg.location}` : ''

			_logger.error(`Code : ${err.code}, Message: ${ErrParm} ${ErrSuffix}`)
		}
	}

	// Send the error to user
	res.status(err.code).json({
		errors: {
			msg: err.message
		}
	})
}

/**
 * Builds error object
 * @param {number} code - error code
 * @param {string} message - error text
 */
exports.buildErrObject = (code, message) => {
	const _logger = logger.child({file: ModuleFile, method: 'buildErrObject' })

	return {
		code,
		message
	}
}

/**
 * Builds success object
 * @param {string} message - success text
 */
exports.buildSuccObject = message => {
	const _logger = logger.child({file: ModuleFile, method: 'buildSuccObject' })

	return {
		msg: message
	}
}

// Assumes that the filename is in the format MM-DD-yyyy
exports.formatFileDate = fileName => {
	let dateParts = fileName.split('-')

	return `${dateParts[1]}-${dateParts[0]}-${dateParts[2]}`
}

// Export the object so it can be used in other modules
exports.HTTPResp = HTTPResp