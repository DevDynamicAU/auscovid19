// const getDB = require('../../config/rxdb').getDB
// const logger = require('../../config/logger')
// const ModuleFile = logger.getModuleName(module)
// const utils = require('../middleware/utils')

// let _ExistingCollection = "something"

// // todo figure out indexes so you can find if we already have a client in the db

// const UserSchema = {
// 	title: "User Schema",
// 	version: 0,
// 	description: "Describes the users of the system",
// 	type: "object",
// 	properties: {
// 		_id: { type: "string", primary: true },
// 		name: { type: "string" },
// 		email: { type: "string", format: "email", index: true },
// 		password: { type: "string", encrypted: true },
// 		role: { type: "string", enum: ['user', 'admin'], default: "user" },
// 		verification: { type: "string" },
// 		verified: { type: "boolean", default: false },
// 		phone: { type: "string" },
// 		city: { type: "string" },
// 		country: { type: "string" },
// 		profile: { type: "object", properties: { firstName: { type: "string"},
// 												 surname: { type: "string"}
// 									}
// 		},
// 		loginAttempts: { type: "number", default: 0, select: false },
// 		blockExpires: { type: "string", format: "date-time", default: new Date().toISOString(), select: false }
// 	}
// }

// const ObtainCollection = async (ColName) => {
// 	const _logger = logger.child({file : ModuleFile, method: "ObtainCollection"})

// 	_logger.debug(`Getting ${ColName} collection from db`)

// 	const _db = await getDB() //.then((db) => {
		
// 	const _ColName = ColName.toLowerCase()
	
// 	// if the collection is missing, we need to create it
// 	//if (!_ExistingCollection) {
// 		// check if the collection is in the DB
// 		let _DBCollection = _db[_ColName]

// 		//if (!_DBCollection) {
// 			_logger.debug(`${_ColName} does not exist, creating`)
// 			_logger.debug(`DBName = ${_db.name}`)

// 			// create the collection in the DB, and set the _ExistingCollection variable so we can find it next time the
// 			// function is run.
// 			_ExistingCollection = await _db.collection({
// 				name: _ColName,
// 				schema: UserSchema,
// 				// migrationStrategies: {
// 				// 	// Migrate from v0 to v1
// 				// 	1: function(oldDoc) {
// 				// 		return oldDoc // just return the document as we have likely just made a field addition
// 				// 	}
// 				// },
// 				methods: {
// 					getRecentWeight: function() {
// 						// todo get the users most recent weight
// 						return 'to be implemented'
// 					},
// 					getInitialWeight: function() {
// 						// todo get the users first recorded weight
// 						return 'to be implemented'
// 					},
// 					getPrevHbA1c: function() {
// 						// todo get the 2nd last HbA1c value
// 						return 'to be implemented'
// 					},
// 					getRecentHbA1c: function() {
// 						// todo get the latest HbA1c
// 						return 'to be implemented'
// 					},
// 					getMedication: function() {
// 						// todo get a list of the client medication
// 						return 'to be implemented'
// 					}
// 				},
// 				autoMigrate: true // todo implement some feedback to the user on how the migration is going https://rxdb.info/data-migration.html
// 			}).then((NewCollection) => {
// 				_logger.debug('Collection created, establishing sync')

// 				if (process.env.REMOTEDB_URI) {
// 					_logger.debug('Beginning sync to ' + process.env.REMOTEDB_URI + process.env.DB_NAME + '/')
// 					NewCollection.sync({
// 						remote: process.env.REMOTEDB_URI + process.env.DB_NAME + '/',
// 						// sync-options (optional) from https://pouchdb.com/api.html#replication
// 						options: {
// 							live: true,
// 							retry: true
// 						}
// 					})
// 				} else {
// 					_logger.warn('Unable to sync - No sync URI detected')
// 				}

// 				return NewCollection
// 			}).catch((err) => {
// 				_logger.error('There was a problem creating the collection')
// 				console.log(err) // todo test how to use _logger consistantly with err
// 			})
// 		//}
// 	// } else {
// 	// 	_logger.debug(`Existing collection found`)
// 	// }

// 	return _ExistingCollection
// }

// exports.GetCollection = async () => {
// 	const _logger = logger.child({file : ModuleFile, method: "GetCollection"})
// 	const ColName = utils.DBCollections.Users

// 	const FoundCollection = await ObtainCollection(ColName)

// 	_logger.debug(`Found collection named ${FoundCollection.name}`)
// 	return FoundCollection
// }

// // exports.Create = async () => {
// // 	const _logger = logger.child({file : ModuleFile, method: "Create"})
// // 	// todo change this over to the new way in GetCollection
// // 	const _Col = await getDB().then((db) => {
// // 		const nc = CreateCollection(db, "ClientCollection").then((NewCol) => {
// // 			_logger.debug(`NewCollection name is ${NewCol.name}`)

// // 			return NewCol
// // 		})

// // 		return nc
// // 	})

// // 	return _Col
// // }
