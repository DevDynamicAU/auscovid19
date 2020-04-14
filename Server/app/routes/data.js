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

router.get("/test", (req, res) => {
	res.status(200).json("testing testing")
})

module.exports = router