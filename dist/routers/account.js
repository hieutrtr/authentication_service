'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.post('/', function (req, res) {
  req.app.locals.db.register(req.body).then(function (result) {
    res.send({ message: "register succesfully", data: result });
  }).catch(function (err) {
    res.status(err.status).send(err.message);
  });
});

router.post('/:accountId/refreshToken', function (req, res) {
  // TODO : optimize not hit db
  req.app.locals.db.refreshLogin(req.params.accountId).then(function (result) {
    req.app.locals.jwt.refreshToken(result, req.body.refreshToken).then(function (result) {
      res.send({ message: "refresh succesfully", result: result });
    }).catch(function (err) {
      res.status(err.status).send(err.message);
    });
  }).catch(function (err) {
    res.status(err.status).send(err.message);
  });
});

router.post('/login', function (req, res) {
  req.app.locals.db.login(req.body).then(function (result) {
    req.app.locals.jwt.createLoginToken(result).then(function (result) {
      res.send({ message: "login succesfully", result: result });
    }).catch(function (err) {
      console.log(err);
      res.status(err.status).send(err.error);
    });
  }).catch(function (err) {
    res.status(err.status).send(err.error);
  });
});

router.post('/logout', function (req, res) {
  if (req.body.refreshToken) {
    // TODO : optimize not hit db
    req.app.locals.jwt.revokeToken(req.body.accountId, req.body.refreshToken).then(function (result) {
      res.send({ message: "revoke succesfully", result: result });
    }).catch(function (err) {
      res.status(err.status).send(err.message);
    });
  } else {
    res.status(400).send("refresh token is invalid");
  }
});

exports.default = router;