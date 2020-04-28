const logger = require('../../config/logger')
const ModuleFile = logger.getModuleName(module)
const data = require('../middleware/data.middleware')
const dateFNS = require('date-fns')

const utils = require('../middleware/utils')

const AusStates = ["Queensland", 'New South Wales', 'Australian Capital Territory', 'Victoria', 'Tasmania', 'Northern Territory', 'South Australia', 'Western Australia']
const USStates = ["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa",
				"Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire",
				"New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota",
				"Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming"]

// exports.getActiveCases = async (req, res) => {
// 	const _logger = logger.child({file: ModuleFile, method: "getActiveCases"})
// 	const reqCountry = req.query.Country

// 	let result = []

// 	let targetStates = [];
// 	let missingStates = [];
// 	let dummyRecord = {};
// 	let caseData = [];
// 	let summaryData = false;

// 	switch (reqCountry.toLowerCase()) {
// 		case "australia":
// 			targetStates = AusStates
// 			summaryData = false;
// 		break;

// 		case "us":
// 			targetStates = USStates;
// 			summaryData = true;
// 		break;
// 	}

// 	let activeCount = 0;

// 	_logger.debug('Starting method')

// 	try {
// 		const state = typeof req.params.id == "undefined" ? "" : req.params.id
// 		let forceStateData = false;

// 		if (state != "") {
// 			_logger.debug('Filtering data')
// 			caseData = data.filterByState(state)
// 		} else {
// 			_logger.debug('returning all data')
// 			caseData = data.returnData(req.query.Country, summaryData)
// 			forceStateData = reqCountry.toLowerCase() == "australia" ? true : false
// 		}
		
// 		let dayCount = 0

// 		// for(let itm of caseData ) {
// 		// 	if (typeof itm.Active == "undefined") {
// 		// 		activeCount = Number(itm.Confirmed)
// 		// 		dayCount = activeCount
// 		// 	} else {
// 		// 		dayCount = itm.Active == "" ? 0 : Number(itm.Active)
// 		// 	}

// 		// 	let recordCountry = typeof itm.Mainland != "undefined" ? itm.Mainland : itm.CountryRegion

// 		// 	switch (recordCountry) {
// 		// 		case "Australia":
// 		// 			result.push({
// 		// 				ProviceState: itm.ProvinceState,
// 		// 				Date: itm.LastUpdate,
// 		// 				Active: dayCount
// 		// 			})
// 		// 			break;

// 		// 		case "US":
// 		// 			result.push({
// 		// 				ProviceState: "US",
// 		// 				Date: itm.LastUpdate,
// 		// 				Active: runningTotal
// 		// 			})
// 		// 			break;
// 		// 	} 
			
// 		// }

// 		// if we need to insert missing data records for states on given days
// 		if (forceStateData) {
// 			for (let itm of caseData) {

// 				let dateRecords = caseData.filter(v => v.LastUpdate == itm.LastUpdate)
// 				missingStates = targetStates.filter(v => !dateRecords.map(v => v.ProvinceState).includes(v) )

// 				for(let missingState of missingStates) {
// 					dummyRecord = {
// 						City: '',
// 						ProvinceState: missingState,
// 						CountryRegion: itm.CountryRegion,
// 						LastUpdate: itm.LastUpdate,
// 						Confirmed: 0,
// 						Deaths: 0,
// 						Recovered: 0,
// 						Active: 0,
// 						AssumedData: true
// 					}
		
// 					caseData.push(dummyRecord)
// 				}
// 			}
// 		}

// 		const sortedData = utils.sortByDate(caseData)
		
// 		const lastDate = sortedData[sortedData.length - 1].LastUpdate
		
// 		let totalActive = -1
		
// 		// add a total number of active cases
// 		if (!summaryData) {
// 			totalActive = sortedData.filter(v => v.LastUpdate == lastDate).map(v => v.Active).reduce((a,b) => a + b, 0)
// 		} else {
// 			// this is for countries like the use who use summary data.
// 			totalActive = sortedData[sortedData.length - 1].Active
// 		}
		
// 		dummyRecord = {
// 			type: 'Total',
// 			Field: 'Active',
// 			count: totalActive
// 		}

// 		sortedData.push(dummyRecord)
// 		res.status(utils.HTTPResp.OK).json(sortedData)
// 	} catch (err) {
// 		utils.handleError(res, err)
// 	}
// }

// exports.getConfirmedCases = async (req, res) => {
// 	const _logger = logger.child({file: ModuleFile, method: "getConfirmedCases"})
// 	const reqCountry = req.query.Country

// 	let result = []

// 	let targetStates = [];
// 	let missingStates = [];
// 	let dummyRecord = {};
// 	let caseData = [];
// 	let summaryData = false;

// 	switch (reqCountry.toLowerCase()) {
// 		case "australia":
// 			targetStates = AusStates
// 			summaryData = false;
// 		break;

// 		case "us":
// 			targetStates = USStates;
// 			summaryData = true;
// 		break;
// 	}

// 	let activeCount = 0;

// 	_logger.debug('Starting method')

// 	try {
// 		const state = typeof req.params.id == "undefined" ? "" : req.params.id
// 		let forceStateData = false;

// 		if (state != "") {
// 			_logger.debug('Filtering data')
// 			caseData = data.filterByState(state)
// 		} else {
// 			_logger.debug('returning all data')
// 			caseData = data.returnData(req.query.Country, summaryData)
// 			forceStateData = reqCountry.toLowerCase() == "australia" ? true : false
// 		}
		
// 		let dayCount = 0

// 		// for(let itm of caseData ) {
// 		// 	if (typeof itm.Active == "undefined") {
// 		// 		activeCount = Number(itm.Confirmed)
// 		// 		dayCount = activeCount
// 		// 	} else {
// 		// 		dayCount = itm.Active == "" ? 0 : Number(itm.Active)
// 		// 	}

// 		// 	let recordCountry = typeof itm.Mainland != "undefined" ? itm.Mainland : itm.CountryRegion

// 		// 	switch (recordCountry) {
// 		// 		case "Australia":
// 		// 			result.push({
// 		// 				ProviceState: itm.ProvinceState,
// 		// 				Date: itm.LastUpdate,
// 		// 				Active: dayCount
// 		// 			})
// 		// 			break;

// 		// 		case "US":
// 		// 			result.push({
// 		// 				ProviceState: "US",
// 		// 				Date: itm.LastUpdate,
// 		// 				Active: runningTotal
// 		// 			})
// 		// 			break;
// 		// 	} 
			
// 		// }

// 		// if we need to insert missing data records for states on given days
// 		if (forceStateData) {
// 			for (let itm of caseData) {

// 				let dateRecords = caseData.filter(v => v.LastUpdate == itm.LastUpdate)
// 				missingStates = targetStates.filter(v => !dateRecords.map(v => v.ProvinceState).includes(v) )

// 				for(let missingState of missingStates) {
// 					dummyRecord = {
// 						City: '',
// 						ProvinceState: missingState,
// 						CountryRegion: itm.CountryRegion,
// 						LastUpdate: itm.LastUpdate,
// 						Confirmed: 0,
// 						Deaths: 0,
// 						Recovered: 0,
// 						Active: 0,
// 						AssumedData: true
// 					}
		
// 					caseData.push(dummyRecord)
// 				}
// 			}
// 		}

// 		const sortedData = utils.sortByDate(caseData)
		
// 		const lastDate = sortedData[sortedData.length - 1].LastUpdate
		
// 		let totalConfirmed = -1
		
// 		// add a total number of active cases
// 		if (!summaryData) {
// 			totalConfirmed = sortedData.filter(v => v.LastUpdate == lastDate).map(v => v.Confirmed).reduce((a,b) => a + b, 0)
// 		} else {
// 			// this is for countries like the use who use summary data.
// 			totalConfirmed = sortedData[sortedData.length - 1].Confirmed
// 		}
		
// 		dummyRecord = {
// 			type: 'Total',
// 			Field: 'Confirmed',
// 			count: totalConfirmed
// 		}

// 		sortedData.push(dummyRecord)
		
// 		res.status(utils.HTTPResp.OK).json(sortedData)
// 	} catch (err) {
// 		utils.handleError(res, err)
// 	}
// }

// exports.getNbrOfDeaths = async (req, res) => {
// 	const _logger = logger.child({file: ModuleFile, method: "getNbrOfDeaths"})
// 	const reqCountry = req.query.Country

// 	let result = []
	
// 	let targetStates = [];
// 	let missingStates = [];
// 	let dummyRecord = {};
// 	let caseData = [];
// 	let summaryData = false;

// 	switch (reqCountry.toLowerCase()) {
// 		case "australia":
// 			targetStates = AusStates
// 			summaryData = false;
// 		break;

// 		case "us":
// 			targetStates = USStates;
// 			summaryData = true;
// 		break;
// 	}

// 	let activeCount = 0;

// 	_logger.debug('Starting method')

// 	try {
// 		const state = typeof req.params.id == "undefined" ? "" : req.params.id
// 		let forceStateData = false;

// 		if (state != "") {
// 			_logger.debug('Filtering data')
// 			caseData = data.filterByState(state)
// 		} else {
// 			_logger.debug('returning all data')
// 			caseData = data.returnData(req.query.Country, summaryData)
// 			forceStateData = reqCountry.toLowerCase() == "australia" ? true : false
// 		}
		
// 		let dayCount = 0

// 		// for(let itm of caseData ) {
// 		// 	if (typeof itm.Active == "undefined") {
// 		// 		activeCount = Number(itm.Confirmed)
// 		// 		dayCount = activeCount
// 		// 	} else {
// 		// 		dayCount = itm.Active == "" ? 0 : Number(itm.Active)
// 		// 	}

// 		// 	let recordCountry = typeof itm.Mainland != "undefined" ? itm.Mainland : itm.CountryRegion

// 		// 	switch (recordCountry) {
// 		// 		case "Australia":
// 		// 			result.push({
// 		// 				ProviceState: itm.ProvinceState,
// 		// 				Date: itm.LastUpdate,
// 		// 				Active: dayCount
// 		// 			})
// 		// 			break;

// 		// 		case "US":
// 		// 			result.push({
// 		// 				ProviceState: "US",
// 		// 				Date: itm.LastUpdate,
// 		// 				Active: runningTotal
// 		// 			})
// 		// 			break;
// 		// 	} 
			
// 		// }

// 		// if we need to insert missing data records for states on given days
// 		if (forceStateData) {
// 			for (let itm of caseData) {

// 				let dateRecords = caseData.filter(v => v.LastUpdate == itm.LastUpdate)
// 				missingStates = targetStates.filter(v => !dateRecords.map(v => v.ProvinceState).includes(v) )

// 				for(let missingState of missingStates) {
// 					dummyRecord = {
// 						City: '',
// 						ProvinceState: missingState,
// 						CountryRegion: itm.CountryRegion,
// 						LastUpdate: itm.LastUpdate,
// 						Confirmed: 0,
// 						Deaths: 0,
// 						Recovered: 0,
// 						Active: 0,
// 						AssumedData: true
// 					}
		
// 					caseData.push(dummyRecord)
// 				}
// 			}
// 		}

		
// 		const sortedData = utils.sortByDate(caseData)
		
// 		const lastDate = sortedData[sortedData.length - 1].LastUpdate
		
// 		let totalDeaths = -1
		
// 		// add a total number of active cases
// 		if (!summaryData) {
// 			totalDeaths = sortedData.filter(v => v.LastUpdate == lastDate).map(v => v.Deaths).reduce((a,b) => a + b, 0)
// 		} else {
// 			// this is for countries like the use who use summary data.
// 			totalDeaths = sortedData[sortedData.length - 1].Active
// 		}
		
// 		dummyRecord = {
// 			type: 'Total',
// 			Field: 'Deaths',
// 			count: totalDeaths
// 		}

// 		sortedData.push(dummyRecord)
// 		res.status(utils.HTTPResp.OK).json(sortedData)
// 	} catch (err) {
// 		utils.handleError(res, err)
// 	}
// }

exports.getData = async (req, res) => {
	const _logger = logger.child({file: ModuleFile, method: "getData"})
	let reqCountry = ""
	let summaryData = false;

	if (typeof req.query.Country == "undefined") {
		reqCountry = typeof req.query.country == "undefined" ? "Australia" : req.query.country
	} else {
		reqCountry = req.query.Country
	}
	
	if (typeof req.query.GroupByCountry == "undefined") {
		summaryData = typeof req.query.groupbycountry == "undefined" ? false : req.query.groupbycountry
	} else {
		summaryData = req.query.GroupByCountry
	}
	
	let targetStates = [];
	let missingStates = [];
	let dummyRecord = {};
	let caseData = [];
	

	switch (reqCountry.toLowerCase()) {
		case "australia":
			targetStates = AusStates
		break;

		case "us":
			targetStates = USStates;
			summaryData = true // forces this because that is how the data is setup
		break;
	}

	_logger.debug('Starting method')

	try {
		const state = typeof req.params.id == "undefined" ? "" : req.params.id
		let forceStateData = false;

		if (state != "") {
			_logger.debug('Filtering data')
			caseData = data.filterByState(state)
		} else {
			_logger.debug('returning all data')
			caseData = data.returnData(reqCountry, summaryData)

			// if we are getting data for australia, and its not being summarised, then we need to force the state data if its missing.
			// if it is being summarised, then forceStateData should be false
			if ( reqCountry.toLowerCase() == "australia") {
				console.log(summaryData, forceStateData, 'summary data 1')
				if (!summaryData) {
					forceStateData = true
				}
				console.log(summaryData, forceStateData, 'summary data 2')
			}
		}
		
		// if we need to insert missing data records for states on given days
		if (forceStateData) {
			for (let itm of caseData) {

				let dateRecords = caseData.filter(v => v.LastUpdate == itm.LastUpdate)
				missingStates = targetStates.filter(v => !dateRecords.map(v => v.ProvinceState).includes(v) )

				for(let missingState of missingStates) {
					dummyRecord = {
						City: '',
						ProvinceState: missingState,
						CountryRegion: itm.CountryRegion,
						LastUpdate: itm.LastUpdate,
						Confirmed: 0,
						Deaths: 0,
						Recovered: 0,
						Active: 0,
						AssumedData: true
					}
		
					caseData.push(dummyRecord)
				}
			}
		}

		const sortedData = utils.sortByDate(caseData)
		
		const lastDate = sortedData[sortedData.length - 1].LastUpdate
		
		let totalConfirmed = -1
		let totalDeaths = -1
		let totalRecovered = -1
		let totalActive = -1
		
		// add a total number of active cases
		if (!summaryData) {
			totalConfirmed = sortedData.filter(v => v.LastUpdate == lastDate).map(v => v.Confirmed).reduce((a,b) => a + b, 0)
			totalDeaths = sortedData.filter(v => v.LastUpdate == lastDate).map(v => v.Deaths).reduce((a,b) => a + b, 0)
			totalRecovered = sortedData.filter(v => v.LastUpdate == lastDate).map(v => v.Recovered).reduce((a,b) => a + b, 0)
			totalActive = sortedData.filter(v => v.LastUpdate == lastDate).map(v => v.Active).reduce((a,b) => a + b, 0)
		} else {
			// this is for countries like the use who use summary data.
			totalConfirmed = sortedData[sortedData.length - 1].Confirmed
			totalDeaths = sortedData[sortedData.length - 1].Deaths
			totalRecovered = sortedData[sortedData.length - 1].Recovered
			totalActive = sortedData[sortedData.length - 1].Active
		}
		
		dummyRecord = {
			type: 'Totals',
			Confirmed: totalConfirmed,
			Deaths: totalDeaths,
			Recovered: totalRecovered,
			Active: totalActive,
		}

		sortedData.push(dummyRecord)
		
		res.status(utils.HTTPResp.OK).json(sortedData)
	} catch (err) {
		utils.handleError(res, err)
	}
}