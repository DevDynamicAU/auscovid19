const path = require('path')
const fs = require('fs')
const fastCSV = require('fast-csv')
const cliProgress = require('cli-progress')
const logger = require('../../config/logger')
const ModuleFile = logger.getModuleName(module)
const utils = require('../../app/middleware/utils')
const _colors = require('colors');
const dateFNS = require('date-fns')

let data = {};
let csvData = [];
let targetFiles = [];
let createPromise = null;
const allowedCountries = ["Australia"]

const loadData = async () => {
	const _logger = logger.child({file : ModuleFile, method: "loadData"})

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
	}, cliProgress.Presets.rect);

	pb.start(targetFiles.length, 0, {
		speed: "N/A"
	})

	let prevDate = ""
	let totalConfirmed = 0
	let totalDeaths = 0
	let totalActive = 0
	
	let fileDate = ""
	const td = "13-03-2020"
	const nd = "14-03-2020"
	let existingData = []

	for(let file of targetFiles) {
		pb.increment();
		let dataFile = path.join(process.env.DATA_DIR, file)
		
		await fs.createReadStream( dataFile )
			.pipe(fastCSV.parse({delimiter: ',', 
								headers: headers => headers.map(h => h.replace('/', '').replace(' ', '').replace('_','')),
							}))

			.on('data', function(csvRow) {
				
				// do something with csvRow
				if ( allowedCountries.indexOf(csvRow.CountryRegion) >= 0) {

					// We need to have some state
					if (csvRow.ProvinceState.length > 0) {
						
						fileDate = utils.formatFileDate(path.basename(file, '.csv'))

						if (fileDate == td) {
							//console.log(`processing ${ utils.formatFileDate(path.basename(file, '.csv'))}`, csvRow)
						}

						// Fix the last update column to be the date of the file
						csvRow.LastUpdate = fileDate

						if (csvRow.CountryRegion == "Australia") {
							csvData.push(csvRow);
						} else {

							// If the prevDate has not yet been set, set it to the current file date
							existingData = csvData.filter(v => v.LastUpdate == csvRow.LastUpdate)
							
							if (existingData.length > 0) {
								// we have some data, so we will increment it
								existingData.filter((v, i) => {
									if (v.LastUpdate == csvRow.LastUpdate) {
											existingData[i].noData = false
											existingData[i].Confirmed += !Number.isNaN(csvRow.Confirmed) ? Number(csvRow.Confirmed) : 0
											existingData[i].Deaths += !Number.isNaN(csvRow.Deaths) ? Number(csvRow.Deaths) : 0

											// Check we have data for active Cases. If we don't then we will set it to 0
											if (!Number.isNaN(Number(csvRow.Active))) {
												activeCases = Number(csvRow.Active)
											} else {
												activeCases = 0
											}

											// if active cases are 0, then we need to assume that all confirmed cases are active
											if (activeCases == 0) {
												existingData[i].Active = existingData[i].Confirmed // don't need number here because it is assigned above as a number
												existingData[i].AssumedActive = true

											} else {
												if (activeCases > 0) {
													existingData[i].Active += activeCases
													existingData[i].AssumedActive = false
												}
											}

											
											existingData[i].Incremented = true
									}
								})
							} else {
								// we have no data, so we need to push the record in
								if (fileDate == td) console.log(`pushing in data for ${csvRow.LastUpdate}`)
								
								// Check we have data for active Cases. If we don't then we will set it to 0
								if (!Number.isNaN(Number(csvRow.Active))) {
									activeCases = Number(csvRow.Active)
								} else {
									activeCases = 0
								}

								// if active cases are 0, then we need to assume that all confirmed cases are active
								if (activeCases == 0) {
									activeCases = !Number.isNaN(csvRow.Confirmed) ? Number(csvRow.Confirmed) : 0
								}

								let dummyRecord = {
									ProvinceState: "US",
									LastUpdate: csvRow.LastUpdate,
									noData: true,
									AssumedActive: true,
									Confirmed: !Number.isNaN(csvRow.Confirmed) ? Number(csvRow.Confirmed) : 0,
									Deaths: !Number.isNaN(csvRow.Deaths) ? Number(csvRow.Deaths) : 0,
									Active: activeCases
								}

								csvData.push(dummyRecord)

								//if (fileDate == td) console.log(csvData.filter(v => v.LastUpdate == csvRow.LastUpdate))
							}

							// if we have moved onto the next file
							// 1. Update the prevDate field to the new date
							// 2. Put in the summary data to our dataset
							// 3. reset the totals

							// if (prevDate != csvRow.LastUpdate) {
							// 	totalConfirmed += Number(typeof csvRow.Confirmed == "undefined" ? 0 : csvRow.Confirmed)
							// 	totalDeaths += Number(typeof csvRow.Deaths == "undefined" ? 0 : csvRow.Deaths)
							// 	totalActive += Number(typeof csvRow.Active == "undefined" ? 0 : csvRow.Active)

							// 		let dummyRecord = {
							// 			ProvinceState: "US",
							// 			LastUpdate: prevDate,
							// 			Confirmed: totalConfirmed,
							// 			Deaths: totalDeaths,
							// 			Active: totalActive
							// 		}
	
							// 		if (utils.formatFileDate(path.basename(file, '.csv')) == nd) {
							// 			// console.log(`before reset ${csvRow.Confirmed} : ${csvRow.Deaths} : ${csvRow.Active}`)
							// 			// console.log(`${prevDate} : ${csvRow.LastUpdate} - resetting`)
							// 			// console.log(`${totalConfirmed} : ${totalDeaths} : ${totalActive} - totals`)
							// 			// console.log(dummyRecord)
							// 		} 
									
							// 		csvData.push(dummyRecord)
					
							// 		prevDate = csvRow.LastUpdate
									
							// 		totalConfirmed = 0
							// 		totalDeaths = 0
							// 		totalActive = 0
							// 	//}

								
							// } else {
								
							// 	totalConfirmed += Number(typeof csvRow.Confirmed == "undefined" ? 0 : csvRow.Confirmed)
							// 	totalDeaths += Number(typeof csvRow.Deaths == "undefined" ? 0 : csvRow.Deaths)
							// 	totalActive += Number(typeof csvRow.Active == "undefined" ? 0 : csvRow.Active)

							// 	//if (utils.formatFileDate(path.basename(file, '.csv')) == td) console.log(`incrementing C| ${totalConfirmed} : D| ${totalDeaths} : A| ${totalActive}`)
							// }
						}
					}
				} else {
					//console.log(`${allowedCountries.indexOf(csvRow.CountryRegion)} : ${csvRow.CountryRegion}`)
				}

			})
			.on("end", (s) => {
				//console.log(existingData.filter(v => v.LastUpdate == "13-03-2020"), 'this is the end')

			})
	}

	pb.stop();
}

data.load = async () => {
	const _logger = logger.child({file : ModuleFile, method: "load"})

	if (!createPromise) {
		_logger.info('No data has been loaded - loading now')
		createPromise = loadData()
	}

	return createPromise
}

data.returnData = () => {
	return csvData.sort((a, b) => { 

		// Convert the strings into date objects for comparisons
		const aDate = dateFNS.parse(a.Date, 'dd-MM-yyyy', new Date())
		const bDate = dateFNS.parse(b.Date, 'dd-MM-yyyy', new Date())
		
		// return if the date is > the next date
		return aDate > bDate ? -1 : 1 })
}

data.filterByState = (state) => {
	return csvData.filter(v => v.ProvinceState == state)
}

module.exports = data