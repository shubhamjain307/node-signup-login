const express = require('express')
const router = express.Router()
const userController = require('../controllers/user.controllers');
const auth = require('../middleware/auth')
// Retrieve all users
// router.get('/', userController.findAll);
// Create a new user
 router.post('/', userController.create);
 router.post('/send-otp', userController.sendOtpMail);
 router.post('/login', userController.userLogin);
 router.get('/user-profile',auth ,userController.userProfile);
 router.put('/user-profile', auth,userController.update);

 router.post('/upload',userController.imageUpload)
// Retrieve a single user with id
// router.get('/:id', userController.findOne);
// Update a user with id
// router.put('/:id', userController.update);
// Delete a user with id
// router.delete('/:id', userController.delete);
module.exports = router