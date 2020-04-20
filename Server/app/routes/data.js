const dataController = require('../controllers/data.controller')

const express = require('express')
const router = express.Router()

const trimRequest = require('trim-request')

router.get('/getLabels',
	trimRequest.all,
	dataController.getLabels
)

router.get('/getActiveCases',
	trimRequest.all,
	dataController.getActiveCases
)

router.get('/getConfirmedCases',
	trimRequest.all,
	dataController.getConfirmedCases
)

router.get('/getConfirmedCases/:id',
	trimRequest.all,
	dataController.getConfirmedCases
)

router.get('/getActiveCases/:id',
	trimRequest.all,
	dataController.getActiveCases
)

router.get("/getNbrOfDeaths",
	trimRequest.all,
	dataController.getNbrOfDeaths
)

router.get('/getData',
	trimRequest.all,
	dataController.getData)
	
module.exports = router
