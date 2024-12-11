
const router = require('express').Router();


// Use the routes
router.get('/', (req, res) => { res.send('Welcome To my Finnal Project');});

router.use('/users', require('./users'));      // /users route will use users
router.use('/roles', require('./roles'));     // /roles route will use roles


module.exports = router;
