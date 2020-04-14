const winston = require('winston')
const { combine, timestamp, printf } = winston.format
const colorizer = winston.format.colorize();

const path = require('path')
const ToBytes = require('bytes')
const fs = require('fs')
const DateFormat = require('date-fns').format
const { utcToZonedTime } = require('date-fns-tz')
const enAU = require('date-fns/locale/en-AU')

const getModuleName = (callingModule) => {
	const parts = callingModule.filename.split(path.sep);
	return path.join(parts[parts.length - 2], parts.pop());
}

const getTimestamp = () => {
	const dt = new Date()
	const tz = 'Australia/Brisbane'

	enAU.code = 'en-AU'
	const zonedDate = utcToZonedTime(dt, tz)
	return DateFormat(zonedDate, 'yyyy-MM-dd HH:mm:ss zzz', { timezone: tz, locale: enAU })
}

// setup the log path to be in the root of the app
const LogDir = path.join(__dirname, '..', process.env.LOG_PATH)

winston.addColors({
	timestamp: 'red',
	file: 'yellow',
	method: 'magenta'
})

const ConsoleFormat = combine(
	winston.format.colorize(),
	//winston.format.align(),
	printf(
		info => `${info.level.padEnd(15)} [` + `${info.file ? `${colorizer.colorize('file',info.file)}`.padEnd(40) : ''}${info.method ? ` | ${colorizer.colorize('method', info.method.padEnd(15))}` : ''}`.padEnd(51) + `]: ${info.message}`
	)
)

const LogFileFormat = combine(
	winston.format.printf(
		info => {
			return JSON.stringify({ timestamp: getTimestamp(), 
					level: info.level, 
					file: info.file ? info.file : '', 
					method: info.method ? info.method : '', 
					message: info.message
				})
		}
	)
)

// const MESSAGE = Symbol.for('message');

// const jsonFormatter = (logEntry) => {
//   const base = { timestamp: new Date() };
//   const json = Object.assign(base, logEntry)
//   logEntry[MESSAGE] = JSON.stringify(json);
//   return logEntry;
// }

const _Logger = winston.createLogger({
	transports: [
		new winston.transports.Console({
			format: ConsoleFormat
		}),
		new winston.transports.File({
			format: LogFileFormat,
			filename: path.join(LogDir, 'MyLog.log'),
			maxsize: ToBytes('50MB'),
			maxFiles: 5
		})
	]})

const ModuleFile = getModuleName(module)

// Create a child logger to amend some meta data to the main logger
const _CLogger = _Logger.child({file : ModuleFile, method: "Main"})

// Set the location of the persistent storage for the log
if (!fs.existsSync(LogDir)) {
	// path does not exist, create it

	fs.mkdirSync(LogDir, (err) => {
		if (err) {
			_CLogger.error('Unable to create log path')
			_CLogger.error(err)

			throw err
		}
	})

	_CLogger.debug(`Created log path : ${LogDir}`)
} else {
	_CLogger.info('Log path exists')
}

// If we are in production, we want the error level to be error, else we are happy with debug level
process.env.NODE_ENV === 'production' ? _Logger.level = 'error' : _Logger.level = 'debug'

// exports.Winston = _Logger

module.exports = _Logger
module.exports.getModuleName = getModuleName;
module.exports.LogPath = LogDir