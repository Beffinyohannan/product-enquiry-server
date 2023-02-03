const { login, dashboard, refreshToken, logout, enquiryDelete } = require('../controllers/adminController')
const { verifyJwt } = require('../middleware/verify_jwt')

const router = require('express').Router()

router.post('/login',login)
router.get('/dashboard',verifyJwt,dashboard)
router.delete('/delete-enquiry/:id',verifyJwt,enquiryDelete)
router.post('/refresh-token',refreshToken)
router.post('/logout',logout)

module.exports = router