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
var user, name;

describe('AUTH', function(){
    this.slow(500);

    before(function(done){
        relax.uuids(1, function(err, res){
            name = res.uuids[0];
            user = {name: name, password: 'userpass'};
            done();
        })
    })

    describe('cookie authentication', function(){
        it('should sign-up new user', function(done){
            admin.signup(user, function(err, res) {
                if (res.error) {
                    res.error.should.equal('conflict');
                } else {
                    res.ok.should.be.ok;
                    res.id.should.equal('org.couchdb.user:' + name);
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
                    res.name.should.equal(name);
                }
                done();
            });
        })
        it('should get session info of a current user', function(done){
            relax.session(function(err, res) {
                res.ok.should.be.ok;
                // this line works only in browser:
                //res.userCtx.name.should.equal(name);
                done();
            });
        })
        it('should log-out current user', function(done){
            relax.logout(function(err, res) {
                res.ok.should.be.ok;
                done();
            });
        })
        it('should log-in my user back, or next tests fail', function(done){
            user = {name: 'm.bykov@gmail.com', password: 'm.bykov@gmail.com'};
            relax.login(user, function(err, res) {
                res.ok.should.be.ok;
                done();
            });
        })
    })

})

function log () { console.log.apply(console, arguments) }
