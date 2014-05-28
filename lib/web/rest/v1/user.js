var express = require('express');
var router = express.Router();
var auth = require('../../passport');

router.get('/user', auth.requireUser({api: true}), function(req, res) {
  res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email
  });
});

module.exports = router;
