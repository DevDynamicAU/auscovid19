const data = require('../middleware/data.middleware')
const utils = require('../middleware/utils')

const AusStates = ["Queensland", 'New South Wales', 'Australian Capital Territory', 'Victoria', 'Tasmania', 'Northern Territory', 'South Australia', 'Western Australia']
const USStates = ["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa",
				"Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire",
				"New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota",
				"Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming"]

exports.getData = async (req, res) => {
	let reqCountry = ""
	let summaryData = false;

	if (typeof req.query.Country == "undefined") {
		reqCountry = typeof req.query.country == "undefined" ? "Australia" : req.query.country
	} else {
		reqCountry = req.query.Country
	}
	
	if (typeof req.query.GroupByCountry == "undefined") {
		summaryData = typeof req.query.groupbycountry == "undefined" ? false : (req.query.groupbycountry == 'true')
	} else {
		summaryData = (req.query.GroupByCountry == 'true')
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

	try {
		const state = typeof req.params.id == "undefined" ? "" : req.params.id
		let forceStateData = false;

		if (state != "") {
			caseData = data.filterByState(state)
		} else {
			caseData = data.returnData(reqCountry, summaryData)

			// if we are getting data for australia, and its not being summarised, then we need to force the state data if its missing.
			// if it is being summarised, then forceStateData should be false
			if ( reqCountry.toLowerCase() == "australia") {
				if (!summaryData) {
					forceStateData = true
				}
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