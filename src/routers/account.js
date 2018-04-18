import express from 'express'
var router = express.Router()

router.post('/', (req, res) => {
  req.app.locals.db.register(req.body)
  .then(result => {
    res.send({message:"register succesfully",data:result})
  })
  .catch(err => {
    res.status(err.status).send(err)
  });
});

router.post('/:accountId/refreshToken', (req,res) => {
  // TODO : optimize not hit db
  req.app.locals.db.refreshLogin(req.params.accountId)
  .then(result => {
    req.app.locals.jwt.refreshToken(result, req.body.refreshToken)
    .then(result => {
      res.send({message:"refresh succesfully",result})
    })
    .catch(err => {
      res.status(err.status).send(err)
    });
  })
  .catch(err => {
    res.status(err.status).send(err)
  });
});

router.post('/login', (req, res) => {
  req.app.locals.db.login(req.body)
  .then(result => {
    req.app.locals.jwt.createToken(result)
    .then(result => {
      res.send({message:"login succesfully",result})
    })
    .catch(err => {
      res.status(err.status).send(err)
    });
  })
  .catch(err => {
    res.status(err.status).send(err)
  });
});

router.post('/logout', (req, res) => {
  // TODO : optimize not hit db
  req.app.locals.jwt.revokeToken(req.body.accountId,req.body.refreshToken)
  .then(result => {
    res.send({message:"revoke succesfully",result})
  })
  .catch(err => {
    res.status(err.status).send(err)
  });
});


export default router
