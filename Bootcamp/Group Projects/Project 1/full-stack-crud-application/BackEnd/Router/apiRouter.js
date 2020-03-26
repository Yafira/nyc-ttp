
//applications that access the features or data of database

const router = require('express').Router();
const campusRouter = require('./campusRouter');
const studentRouter = require('./studentRouter');

router.use('/campuses', campusRouter);
router.use('/students', studentRouter);

module.exports = router;