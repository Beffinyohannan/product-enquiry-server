const { productEnquiry } = require('../controllers/userController')

const router = require('express').Router()

router.post('/enquiry',productEnquiry)

module.exports = router