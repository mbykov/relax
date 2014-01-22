//
//var request = require('../..');
//var express = require('express');
//var assert = require('better-assert');
//var app = express();
var url = require('url');
var relax = require('../../')();
//var relax = new Relax();

// app.get('/login', function(req, res){
//     res.send('<form id="login"></form>');
// });
// app.listen(5985);


describe('relax - server level', function(){
    describe('methods', function(){
        it('should list all dbs', function(done){
            relax.allDbs(function(res){
                log('RES', res.text)
                done();
            })
        })
    })
})


describe('relax', function(){
    describe('with an object', function(){
        it('should set dbname', function(done){
            var db = relax
                .dbname('latin')
                .ddoc('latin')
            db.end(function(res){
                log('RES', res.text)
                done();
            })
        })
    })

    return;

    describe('with an object', function(){
        it('should format the url', function(done){
            relax
                .get(url.parse('http://localhost:5984/login'))
                .end(function(res){
                    //log('RES-KEY', Object.keys(res))
                    //assert(res.ok);
                    done();
                })
        })
    })

    describe('with an object', function(){
        it('should set DB name', function(done){
            var db = relax.dbname('greek');
            db.end(function(res){
                log('RES', res.text)
                done();
            })
        })
    })

    describe('class methods', function(){
        it('should get _all_dbs', function(done){
            relax
                .allDbs()
                .end(function(res){
                    log('RES', res.text)
                    done();
                })
        })
    })

    describe('class methods', function(){
        it('should get _active_tasks', function(done){
            relax
                .activeTasks()
                .end(function(res){
                    log('RES', res.text)
                    done();
                })
        })
    })
    describe('class methods', function(){
        it('should get DB info', function(done){
            //relax
            //.info()
            var db = relax.dbname('greek');
            db.info(function(info){
                log('INFO', info.text)
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
