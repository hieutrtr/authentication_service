'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.post('/', function (req, res) {
  req.app.locals.db.setRole(req.body).then(function (result) {
    res.send({ message: "set role succesfully", data: result.data });
  }).catch(function (err) {
    res.status(err.status).send(err.message);
  });
});

exports.default = router;