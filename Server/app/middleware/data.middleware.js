const path = require('path')
const fs = require('fs')
const fastCSV = require('fast-csv')
const cliProgress = require('cli-progress')
const utils = require('./utils')
const _colors = require('colors');

let data = {};
let csvData = [];
let targetFiles = [];
let createPromise = null;
let fileDate = "";

// We need to include UK and United Kingdom to get all records. UK will be corrected to United Kingdom before the data is returned
const allowedCountries = ["Australia", "US", "UK", "United Kingdom"]

const loadData = async () => {
	let dirFiles = await fs.readdirSync(process.env.DATA_DIR, (err, files) => {
		if (err) {
			console.error(`Unable to read ${process.env.DATA_DIR}`)
		}
		
		return files
	})

	if (dirFiles) {
		targetFiles = dirFiles.filter((file) => {
			return path.extname(file).toLowerCase() == ".csv"
		})
	} else {
		console.log(`unable to find data dir files`)
		console.log(fs.exists(process.env.DATA_DIR), 'data dir test')
		console.log(fs.exists('~/Data'), 'data dir test 2')
	}


	const pb = new cliProgress.SingleBar({
		format: 'Loading data files |' + _colors.cyan('{bar}') + '| {percentage}% || {value}/{total} Chunks || Speed: {speed}',
		barCompleteChar: '\u2588',
		barIncompleteChar: '\u2591',
		hideCursor: true
	}, cliProgress.Presets.rect); /* cspell: disable-line */

	pb.start(targetFiles.length, 0, {
		speed: "N/A"
	})

	for(let file of targetFiles) {
		pb.increment();
		let dataFile = path.join(process.env.DATA_DIR, file)
		
		await fs.createReadStream( dataFile )
			.pipe(fastCSV.parse({delimiter: ',', 
								headers: headers => headers.map(h => h.replace('/', '').replace(' ', '').replace('_','')),
							}))

			.on('data', function(csvRow) {
				let activeCases = 0
				let confirmedCases = 0
				let nbrOfDeaths = 0
				let nbrRecovered = 0

				// do something with csvRow if we are processing an allowed Country
				if ( allowedCountries.indexOf(csvRow.CountryRegion) >= 0) {

					fileDate = utils.formatFileDate(path.basename(file, '.csv'))

					confirmedCases = !Number.isNaN(Number(csvRow.Confirmed)) ? Number(csvRow.Confirmed) : 0
					nbrOfDeaths = !Number.isNaN(Number(csvRow.Deaths)) ? Number(csvRow.Deaths) : 0
					nbrRecovered = !Number.isNaN(Number(csvRow.Recovered)) ? Number(csvRow.Recovered) : 0

					if (csvRow.Active) {
						activeCases = Number(csvRow.Active)
					} else {
						if (csvRow.Confirmed) {
							activeCases = confirmedCases - nbrOfDeaths - nbrRecovered
						}
					}

					// Fix the last update column to be the date of the file
					let data = {
						City: typeof csvRow.Admin2 == "undefined" ? '' : csvRow.Admin2, /* cspell: disable-line */
						ProvinceState: typeof csvRow.ProvinceState != "undefined" ? csvRow.ProvinceState : "",
						CountryRegion: csvRow.CountryRegion == "UK" ? "United Kingdom" : csvRow.CountryRegion,
						LastUpdate: fileDate,
						Confirmed: confirmedCases,
						Deaths: nbrOfDeaths,
						Recovered: nbrRecovered,
						Active: activeCases
					}
						
					csvData.push(data);
				}
			})
			.on("end", () => { })
	}

	pb.stop();
}

data.load = async () => {
	if (!createPromise) {
		createPromise = loadData()
	}

	return createPromise
}

data.returnData = (reqCountry, summaryByCountry = false) => {
	let countryFilter = reqCountry == "" ? "Australia" : reqCountry
	const availDates = [...new Set(csvData.filter(v => v.CountryRegion == countryFilter).map(v => v.LastUpdate))]
	let summarizedArray = []
	let dayData = []


	if (!summaryByCountry) {
		const sortedData = utils.sortByDate(csvData.filter(v => v.CountryRegion == countryFilter ))

		return sortedData

	} else {
			// 1. Loop the date's in csvData
			// 2. for each date, sum the data

			for (const updateDate of availDates) {
				dayData = csvData.filter((v) => {
					return v.CountryRegion == countryFilter && v.LastUpdate == updateDate
				})
				
				// summarise the data records for the day
				let totalConfirmed = utils.getPropertyTotal(dayData, 'Confirmed')
				let totalDeaths = utils.getPropertyTotal(dayData, 'Deaths')
				let totalRecovered = utils.getPropertyTotal(dayData, 'Recovered')
				let totalActive = utils.getPropertyTotal(dayData, 'Active')
				
				// if active cases are 0, then we need to assume that all confirmed cases are active
				if (totalActive == 0) {
					totalActive = totalConfirmed
				}
				
				let summarizedData = {
					CountryRegion: countryFilter,
					LastUpdate: updateDate,
					Confirmed: totalConfirmed,
					Deaths: totalDeaths,
					Recovered: totalRecovered,
					Active: totalActive
				}

				summarizedArray.push(summarizedData)
			}

			// reset the values now we have finished looping. This reset's them for next time the api is called.
			utils.clearPrevValues();

			// 3. return the summarized data
			return utils.sortByDate(summarizedArray)
	}
}
	

data.filterByState = (state) => {
	return csvData.filter(v => v.ProvinceState == state)
}

module.exports = data