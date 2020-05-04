const dataController = require('../controllers/data.controller')

const express = require('express')
const router = express.Router()

const trimRequest = require('trim-request')

router.get('/getData',
	trimRequest.all,
	dataController.getData)

module.exports = router
