const logger = require('../../config/logger')
const ModuleFile = logger.getModuleName(module)
const {	matchedData } = require('express-validator')
const fs = require('fs');
const path = require('path')
const data = require('../middleware/data')
const dateFNS = require('date-fns')

const DateFormat = require('date-fns').format

const utils = require('../middleware/utils')

/**
 * Get status function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.getLabels = async (req, res) => {
	const _logger = logger.child({file: ModuleFile, method: "getLabels"})
	const result = []

	_logger.debug('Starting method')

	try {
		req = matchedData(req)
		
		let dirFiles = await fs.readdirSync(process.env.DATA_DIR, (err, files) => {
			if (err) {
				console.error(`Unable to read ${process.env.DATA_DIR}`)
				res.status(utils.HTTPResp.InternalServerError).json("Problem")
			}
			
			return files
		})

		let targetFiles = dirFiles.filter((file) => {
			return path.extname(file).toLowerCase() == ".csv"
		})

		for(let file of targetFiles) {
			let fileDate = utils.formatFileDate(path.basename(file, '.csv'))

			result.push(fileDate)
		}
		// This will return a null object if we don't find any items
		res.status(utils.HTTPResp.OK).json(result)
	} catch (error) {
		utils.handleError(res, error)
	}
}

exports.getActiveCases = async (req, res) => {
	const _logger = logger.child({file: ModuleFile, method: "getActiveCases"})
	const result = []
	const AusStates = ["Queensland", 'New South Wales', 'Australian Capital Territory', 'Victoria', 'Tasmania', 'Northern Territory', 'South Australia', 'Western Australia']
	let missingStates = [];
	let dummyRecord = {};
	let caseData = [];

	let activeCount = 0;

	_logger.debug('Starting method')

	try {
		const state = typeof req.params.id == "undefined" ? "" : req.params.id
		let forceStateData = false;

		if (state != "") {
			_logger.debug('Filtering data')
			caseData = data.filterByState(state)
		} else {
			_logger.debug('returning all data')
			caseData = data.returnData()
			forceStateData = true
		}

		let dayCount = 0

		for(let itm of caseData ) {
			if (typeof itm.Active == "undefined") {
				activeCount = Number(itm.Confirmed)
				dayCount = activeCount
			} else {
				dayCount = itm.Active
			}

			result.push({
				ProviceState: itm.ProvinceState,
				Date: itm.LastUpdate,
				Active: dayCount
			})
		}

		// if we need to insert missing data records for states on given days
		if (forceStateData) {
			for (let itm of result) {

				let dateRecords = result.filter(v => v.Date == itm.Date)
				//console.log(dateRecords, `itmDate`)
				//console.log(dateRecords.map(v => v.ProviceState)) //.filter(v => !AusStates.includes(v)), `missing states ${itmDate}`)
				missingStates = AusStates.filter(v => !dateRecords.map(v => v.ProviceState).includes(v) )

				for(let missingState of missingStates) {
					//console.log(`inserting record for ${missingState} : ${itm.Date}`)
					dummyRecord = {
							ProviceState: missingState,
							Date: itm.Date,
							Active: 0,
							AssumedData: true
					}
		
					result.push(dummyRecord)
				}
			}
		}

		//const gg = result.filter(v => v.Date == '27-01-2020' ||  v.Date == '28-01-2020').sort((a, b) => { return a.Date > b.Date ? 1 : -1 })

		//console.log(gg, 'filtered records')
		res.status(utils.HTTPResp.OK).json(result.sort((a, b) => { 

			// Convert the strings into date objects for comparisons
			const aDate = dateFNS.parse(a.Date, 'dd-MM-yyyy', new Date())
			const bDate = dateFNS.parse(b.Date, 'dd-MM-yyyy', new Date())
			
			// return if the date is > the next date
			return aDate > bDate ? 1 : -1 }))
	} catch (err) {
		utils.handleError(res, err)
	}
}

exports.getConfirmedCases = async (req, res) => {
	const _logger = logger.child({file: ModuleFile, method: "getConfirmedCases"})
	const result = []
	const AusStates = ["Queensland", 'New South Wales', 'Australian Capital Territory', 'Victoria', 'Tasmania', 'Northern Territory', 'South Australia', 'Western Australia']
	let missingStates = [];
	let dummyRecord = {};
	let caseData = [];

	let activeCount = 0;

	_logger.debug('Starting method')

	try {
		const state = typeof req.params.id == "undefined" ? "" : req.params.id
		let forceStateData = false;

		if (state != "") {
			_logger.debug('Filtering data')
			caseData = data.filterByState(state)
		} else {
			_logger.debug('returning all data')
			caseData = data.returnData()
			forceStateData = true
		}

		let dayCount = 0

		for(let itm of caseData ) {
			if (typeof itm.Confirmed == "undefined") {
				activeCount = -1
				dayCount = activeCount
			} else {
				dayCount = itm.Confirmed
			}

			result.push({
				ProviceState: itm.ProvinceState,
				Date: itm.LastUpdate,
				Confirmed: dayCount
			})
		}

		// if we need to insert missing data records for states on given days
		if (forceStateData) {
			for (let itm of result) {

				let dateRecords = result.filter(v => v.Date == itm.Date)
				//console.log(dateRecords, `itmDate`)
				//console.log(dateRecords.map(v => v.ProviceState)) //.filter(v => !AusStates.includes(v)), `missing states ${itmDate}`)
				missingStates = AusStates.filter(v => !dateRecords.map(v => v.ProviceState).includes(v) )

				for(let missingState of missingStates) {
					//console.log(`inserting record for ${missingState} : ${itm.Date}`)
					dummyRecord = {
							ProviceState: missingState,
							Date: itm.Date,
							Confirmed: 0,
							AssumedData: true
					}
		
					result.push(dummyRecord)
				}
			}
		}

		//const gg = result.filter(v => v.Date == '27-01-2020' ||  v.Date == '28-01-2020').sort((a, b) => { return a.Date > b.Date ? 1 : -1 })

		//console.log(gg, 'filtered records')
		res.status(utils.HTTPResp.OK).json(result.sort((a, b) => { 

			// Convert the strings into date objects for comparisons
			const aDate = dateFNS.parse(a.Date, 'dd-MM-yyyy', new Date())
			const bDate = dateFNS.parse(b.Date, 'dd-MM-yyyy', new Date())
			
			// return if the date is > the next date
			return aDate > bDate ? 1 : -1 }))
	} catch (err) {
		utils.handleError(res, err)
	}
}

exports.getNbrOfDeaths = async (req, res) => {
	const _logger = logger.child({file: ModuleFile, method: "getNbrOfDeaths"})
	let result = []
	const AusStates = ["Queensland", 'New South Wales', 'Australian Capital Territory', 'Victoria', 'Tasmania', 'Northern Territory', 'South Australia', 'Western Australia']
	let missingStates = [];
	let dummyRecord = {};
	let caseData = [];

	let activeCount = 0;

	_logger.debug('Starting method')

	try {
		const state = typeof req.params.id == "undefined" ? "" : req.params.id
		let forceStateData = false;

		if (state != "") {
			_logger.debug('Filtering data')
			caseData = data.filterByState(state)
		} else {
			_logger.debug('returning all data')
			caseData = data.returnData()
			forceStateData = true
		}

		let dayCount = 0

		for(let itm of caseData ) {
			if (typeof itm.Deaths == "undefined") {
				activeCount = -1
				dayCount = activeCount
			} else {
				dayCount = itm.Deaths == "" ? 0 : Number(itm.Deaths)
			}

			result.push({
				ProviceState: itm.ProvinceState,
				Date: itm.LastUpdate,
				Deaths: dayCount
			})
		}

		// if we need to insert missing data records for states on given days
		if (forceStateData) {
			for (let itm of result) {

				let dateRecords = result.filter(v => v.Date == itm.Date)
				//console.log(dateRecords, `itmDate`)
				//console.log(dateRecords.map(v => v.ProviceState)) //.filter(v => !AusStates.includes(v)), `missing states ${itmDate}`)
				missingStates = AusStates.filter(v => !dateRecords.map(v => v.ProviceState).includes(v) )

				for(let missingState of missingStates) {
					//console.log(`inserting record for ${missingState} : ${itm.Date}`)
					dummyRecord = {
							ProviceState: missingState,
							Date: itm.Date,
							Deaths: 0,
							AssumedData: true
					}
		
					result.push(dummyRecord)
				}
			}
		}

		//result.push(dummyRecord)
		result = result.sort((a, b) => {
			// Convert the strings into date objects for comparisons
			const aDate = dateFNS.parse(a.Date, 'dd-MM-yyyy', new Date())
			const bDate = dateFNS.parse(b.Date, 'dd-MM-yyyy', new Date())
			
			// return if the date is > the next date
			return aDate > bDate ? 1 : -1 
		})

		const lastDate = result[result.length - 1].Date

		// add a total number of deaths
		const totalDeaths = result.filter(v => v.Date == lastDate).map(v => v.Deaths).reduce((a,b) => a + b, 0)
		
		dummyRecord = {
			type: 'Total',
			count: totalDeaths
		}

		result.push(dummyRecord)
		//console.log(gg, 'filtered records')
		res.status(utils.HTTPResp.OK).json(result)
	} catch (err) {
		utils.handleError(res, err)
	}
}