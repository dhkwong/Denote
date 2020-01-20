const express = require('express');
const router = express.Router();
const catchallRoute = require('./catchall.routes');
const apiRouter = express.Router();
const noteRoutes = require('./note.routes');
apiRouter.use('/notes', noteRoutes);
router.use('/api', apiRouter)
  .use(catchallRoute);
module.exports = router;
