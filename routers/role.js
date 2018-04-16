import express from 'express'
var router = express.Router()

router.post('/', (req, res) => {
  req.app.locals.db.setRole(req.body)
  .then(result => {
    res.send({message:"set role succesfully",data:result.data})
  })
  .catch(err => {
    res.status(err.status).send(err.message)
  });
});

export default router
