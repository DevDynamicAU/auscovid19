// List of allowed origins for CORS
const whiteList = ['http://localhost:4000', 'http://localhost', 'http://localhost:8080', 'https://auscovid19.herokuapp.com']

// Loop the above array, and either allow/deny the request
const corsOptions = {
	origin: (reqOrigin, cb) => {

		// Check if the origin is in the whitelist
		if ( whiteList.indexOf(reqOrigin) !== -1 || typeof reqOrigin == "undefined" ) {

			// Allow the request
			cb(null, true)
		} else {

			// Deny the request because it was not approved
			cb(new Error(`${reqOrigin} is not allowed by CORS`))
		}
	},
	// Allow credential parseing
	credentials: true
}

module.exports = corsOptions