//
//var request = require('../..');
var express = require('express');
var assert = require('better-assert');
var app = express();
var url = require('url');
var relax = require('../../');
//var relax = new Relax();

app.get('/login', function(req, res){
    res.send('<form id="login"></form>');
});

app.listen(5985);

describe('relax', function(){
    describe('with an object', function(){
        it('should format the url', function(done){
            relax
                .get(url.parse('http://localhost:5985/login'))
                .end(function(res){
                    //log('RES-KEY', Object.keys(res))
                    assert(res.ok);
                    done();
                })
        })
    })

    describe('with an object', function(){
        it('should set dbname', function(done){
            relax
                .dbname('latin')
                .end(function(res){
                    log('RES', res.text)
                    done();
                })
        })
    })

})



function log () { console.log.apply(console, arguments) }

/*
  text: '{"error":"not_found","reason":"no_db_file"}\n',
  statusCode: 404,
  status: 404,
  statusType: 4,
  info: false,
  ok: false,


[ 'req',
  'res',
  'links',
  'text',
  'body',
  'files',
  'buffered',
  'headers',
  'header',
  'statusCode',
  'status',
  'statusType',
  'info',
  'ok',
  'redirect',
  'clientError',
  'serverError',
  'error',
  'accepted',
  'noContent',
  'badRequest',
  'unauthorized',
  'notAcceptable',
  'forbidden',
  'notFound',
  'charset',
  'type',
  'setEncoding',
  'redirects' ]

*/
