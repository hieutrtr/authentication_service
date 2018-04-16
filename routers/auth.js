import express from 'express'
var router = express.Router()

router.post('/', (req, res) => {
  if(req.body.refresh_token) {
    // TODO : optimize not hit db
    req.app.locals.db.refreshLogin(req.body)
    .then(result => {
      req.app.locals.jwt.refreshToken(result, req.body.refresh_token)
      .then(result => {
        res.send({message:"refresh succesfully",result})
      })
      .catch(err => {
        res.status(err.status).send(err.message)
      });
    })
    .catch(err => {
      res.status(err.status).send(err.message)
    });
  } else {
    req.app.locals.db.login(req.body)
    .then(result => {
      req.app.locals.jwt.createLoginToken(result)
      .then(result => {
        res.send({message:"login succesfully",result})
      })
      .catch(err => {
        console.log(err)
        res.status(err.status).send(err.error)
      });
    })
    .catch(err => {
      res.status(err.status).send(err.error)
    });
  }
});

router.delete('/', (req, res) => {
  if(req.body.refresh_token) {
    // TODO : optimize not hit db
    req.app.locals.jwt.revokeToken(req.body.id,req.body.refresh_token)
    .then(result => {
      res.send({message:"revoke succesfully",result})
    })
    .catch(err => {
      res.status(err.status).send(err.message)
    });
  } else {
    res.status(400).send("refresh token is invalid")
  }
});

export default router
