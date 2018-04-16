import express from 'express'
var router = express.Router()

router.post('/', (req, res) => {
  req.app.locals.db.register(req.body)
  .then(result => {
    res.send({message:"register succesfully",data:result})
  })
  .catch(err => {
    res.status(err.status).send(err.message)
  });
});

export default router
