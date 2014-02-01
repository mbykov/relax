//
//var express = require('express');
//var app = express();
var url = require('url');

try {
    var Relax = require('relax');
} catch (err) {
    var Relax = require('../../');
}

//var Relax = require('relax');
//var Relax = require('../../');

var relax = new Relax();
var admin = new Relax('http://admin:kjre4317@localhost:5984');

return;

describe('AUTH', function(){

    describe('cookie authentication', function(){
        it('should log-in existing user', function(done){
            var user = {name: 'm.bykov@gmail.com', password: 'm.bykov@gmail.com'}
            relax.login(user.name, user.password, function(res) {
                res.ok.should.be.ok
                JSON.parse(res.text).name.should.equal('m.bykov@gmail.com')
                done();
            });
        })
        it('should get session info of a current user', function(done){
            relax.session(function(res) {
                res.ok.should.be.ok
                // this line works only in browser:
                //JSON.parse(res.text).userCtx.name.should.equal('m.bykov@gmail.com')
                done();
            });
        })
        it('should log-out current user', function(done){
            relax.logout(function(res) {
                res.ok.should.be.ok
                done();
            });
        })
    })

})

function log () { console.log.apply(console, arguments) }
