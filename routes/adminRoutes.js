const router = require('express').Router()
const adminCtrl = require('../controllers/adminCtrl')
const auth = require('../middleware/auth')

router.post('/admin/users', auth, adminCtrl.viewUsers)

router.patch('/admin/post/:id', auth, adminCtrl.viewPosts)




module.exports = router