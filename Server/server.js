require('dotenv-safe').config()
const path = require('path')

const express = require('express')
const serveStatic = require("serve-static")
const bodyParser = require('body-parser')

// Logging providers
const morgan = require('morgan')

const logger = require('./config/logger')
const LogPath = require('./config/logger').LogPath
const ModuleName = logger.getModuleName(module)

//const pf = require('portfinder')
const compression = require('compression')
const helmet = require('helmet')

const cors = require('cors')
const corsOptions = require('./config/corsOptions')

const app = express()

const _logger = logger.child({file : ModuleName, method: "Main"})

_logger.info(`Starting ${process.env.NODE_ENV} Server`)

// Enable only in development HTTP request logger middleware
if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'))
}

// for parsing json
app.use(
	bodyParser.json({
		limit: '20mb'
	})
)

// for parsing application/x-www-form-urlencoded
app.use(
	bodyParser.urlencoded({
		limit: '20mb',
		extended: true
	})
)

// load the data on startup into memory
require('./app/middleware/data').load()

// Init all other stuff
app.use(cors(corsOptions))

// Send CORS on all /OPTIONS pre-flight checks
app.options('*', cors(corsOptions))

app.use(compression())
app.use(helmet())

app.use(serveStatic(path.join(__dirname, '..', 'dist')))
app.use(require('./app/routes'))
const port = process.env.PORT || 80;

app.listen(port, (err) => {
	if (err) {
		_logger.error('Throwing err from initDB in server.js')
		throw err
	}

	_logger.info(`API Server started http://::${port}`)
})

module.exports = app // for testing
