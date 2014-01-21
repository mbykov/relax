//
//var request = require('../..');
var express = require('express');
var assert = require('better-assert');
var app = express();
var url = require('url');
var relax = require('../../')();


test();

function test() {
    var user = { name: 'tobi' };
    assert('tobi' == user.name);
    //assert('number' == typeof user.age);
}

app.get('/login', function(req, res){
    res.send('<form id="login"></form>');
});

app.listen(4000);

describe('relax', function(){
    describe('with an object', function(){
        it('should format the url', function(done){
            relax
                .get(url.parse('http://localhost:4000/login'))
                .end(function(res){
                    assert(res.ok);
                    done();
                })
        })
    })
})


log('TEST')

function log () { console.log.apply(console, arguments) }
