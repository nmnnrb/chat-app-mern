const express = require('express');
const { registerUser, authUser, allUser } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', registerUser);
router.post('/login', authUser);
router.get('/', protect , allUser);

module.exports = router;