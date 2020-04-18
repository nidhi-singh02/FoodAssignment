const express = require('express')
const router = new express.Router()

const controllers = require('../controllers/outletControllers')

router.post('/',controllers.getOutletDetails)

module.exports = router;
