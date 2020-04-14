const path = require('path')
const fs = require('fs')
const fastCSV = require('fast-csv')
const cliProgress = require('cli-progress')
const logger = require('../../config/logger')
const ModuleFile = logger.getModuleName(module)
const utils = require('../../app/middleware/utils')
const _colors = require('colors');

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

	for(let file of targetFiles) {
		pb.increment();
		let dataFile = path.join(process.env.DATA_DIR, file)
		
		fs.createReadStream( dataFile )
			.pipe(fastCSV.parse({delimiter: ',', 
								headers: headers => headers.map(h => h.replace('/', '').replace(' ', '').replace('_','')),
							}))
			// .on('headers', function(hd) {
			// 	const headers = []

			// 	for(let header of hd) {
			// 		console.log(header.replace('/','_'))
			// 	}
			// })
			.on('data', function(csvRow) {
							// do something with csvRow
							if ( allowedCountries.indexOf(csvRow.CountryRegion) >= 0) {

								// We need to have some state
								if (csvRow.ProvinceState.length > 0) {
									// Fix the last update column to be the date of the file
									csvRow.LastUpdate = utils.formatFileDate(path.basename(file, '.csv'))
									csvData.push(csvRow);
								}
							} else {
								//console.log(`${allowedCountries.indexOf(csvRow.CountryRegion)} : ${csvRow.CountryRegion}`)
							}
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
	return csvData
}

data.filterByState = (state) => {
	return csvData.filter(v => v.ProvinceState == state)
}

module.exports = data