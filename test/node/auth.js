//
//var express = require('express');
//var app = express();
var url = require('url');

try {
    var Relax = require('relax');
} catch (err) {
    var Relax = require('../../');
}

var relax = new Relax();
var admin = new Relax('http://admin:kjre4317@localhost:5984');
var user = {name: 'username', password: 'userpass'};

describe('AUTH', function(){
    this.slow(500);

    describe('cookie authentication', function(){
        it('should sign-up new user', function(done){
            admin.signup(user, function(err, res) {
                if (res.error) {
                    res.error.should.equal('conflict');
                } else {
                    res.ok.should.be.ok;
                    res.id.should.equal('org.couchdb.user:username');
                }
                done();
            });
        });
        it('should log-in existing user', function(done){
            relax.login(user, function(err, res) {
                if (res.error) {
                    res.reason.should.equal('badarg');
                } else {
                    res.ok.should.be.ok;
                    res.name.should.equal('username');
                }
                done();
            });
        })
        it('should get session info of a current user', function(done){
            relax.session(function(err, res) {
                res.ok.should.be.ok;
                // this line works only in browser:
                //res.userCtx.name.should.equal('username');
                done();
            });
        })
        it('should log-out current user', function(done){
            relax.logout(function(err, res) {
                res.ok.should.be.ok;
                done();
            });
        })
    })

})

function log () { console.log.apply(console, arguments) }
