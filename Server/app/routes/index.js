const express = require('express')
const logger = require('../../config/logger')
const ModuleName = logger.getModuleName(module)

const router = express.Router()
const fs = require('fs')
const routesPath = `${__dirname}/`
const { removeExtensionFromFile } = require('../middleware/utils')

const _logger = logger.child({file : ModuleName, method: "Main"})
/*
 * Load routes statically and/or dynamically
 */

// Loop routes path and loads every file as a route except this file and Auth route
fs.readdirSync(routesPath).filter(file => {
	// Take filename and remove last part (extension)
	const routeFile = removeExtensionFromFile(file)
	const routePath = routeFile.replace(/.route(s)?/g, '')
	_logger.debug(`Loading route /${routePath} from ./${routeFile}`)

	// Prevents loading of this file and auth file
	// loads the routes within the file as /<routeFileName/><route>
	// eg. /cities/all
	return routeFile !== 'index' ? router.use(`/${routePath}`, require(`./${routeFile}`)) : ''
})

/*
 * Handle 404 error
 */
router.use('*', (req, res) => {
	res.status(404).json({
		errors: {
			msg: 'URL_NOT_FOUND'
		}
	})
})

module.exports = router
