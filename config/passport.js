var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
var Admin = require('../models/admin')
var User = require('../models/users');
var config = require('../config/index'); 
module.exports = function(passport) {
  var opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
  opts.secretOrKey = config.secret;
  passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    User.findOne({where:{id: jwt_payload.id}}, function(err, user) {
          if (err) {
              return done(err, false);
          }
          if (user) {
              done(null, user);
          } else {
              done(null, false);
          }
      });
  }));
  passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    Admin.findOne({where:{email: jwt_payload.email}}, function(err, admin) {
          if (err) {
              return done(err, false);
          }
          if (admin) {
              done(null, user);
          } else {
              done(null, false);
          }
      });
  }));
};