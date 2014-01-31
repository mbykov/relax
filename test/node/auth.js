//
//var express = require('express');
//var app = express();
var url = require('url');
var Relax = require('../../');
var utils = require('./utils');
var relax = new Relax();
var admin = new Relax('http://admin:kjre4317@localhost:5984');

// return;

describe('AUTH', function(){

    describe('cookie authentication', function(){
        it('should log-in existing user', function(done){
            var user = {name: 'm.bykov@gmail.com', password: 'm.bykov@gmail.com'}
            relax.login(user.name, user.password, function(res) {
                log(res);
                done();
            });
        })
    })

})

function log () { console.log.apply(console, arguments) }
