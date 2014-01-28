//
//var request = require('../..');
//var express = require('express');
//var assert = require('better-assert');
//var app = express();
var url = require('url');
var Relax = require('../../');
var relax = new Relax();
var admin = new Relax('http://admin:kjre4317@localhost:5984');
var db;

// app.get('/login', function(req, res){
//     res.send('<form id="login"></form>');
// });
// app.listen(5985);

return

return;

describe('relax - db level', function(){
    before(function(){
        db = relax.dbname('http://localhost:5984');
    })
    describe('crud methods', function(){
        it('should check if db exists', function(done){
            db.exists('latin', function(res){
                res.should.be.true;
                done();
            })
        })
        it('should check if db not exists', function(done){
            db.exists('not-existing-db', function(res){
                res.should.not.be.true;
                done();
            })
        })
        it('should not create db w/o auth', function(done){
            db.create('relax-specs', function(err, res){
                err.should.equal('{"error":"unauthorized","reason":"You are not a server admin."}');
                done();
            })
        })
        it('should create non-existing db with auth', function(done){
            var db = relax.dbname('http://admin:kjre4317@localhost:5984');
            db.create('relax-specs', function(err, res){
                res.should.be.true;
                done();
            })
        })
        it('should not create already existing db with auth', function(done){
            var db = relax.dbname('http://admin:kjre4317@localhost:5984');
            db.create('relax-specs', function(err, res){
                err.should.equal('{"error":"file_exists","reason":"The database could not be created, the file already exists."}');
                done();
            })
        })
        it('should not drop already existing db w/o auth', function(done){
            //var db = relax.dbname('http://localhost:5984');
            db.drop('relax-specs', function(err, res){
                err.should.equal('{"error":"unauthorized","reason":"You are not a server admin."}');
                done();
            })
        })
        it('should drop already existing db with auth', function(done){
            var db = relax.dbname('http://admin:kjre4317@localhost:5984');
            db.drop('relax-specs', function(err, res){
                res.should.be.true;
                done();
            })
        })
    })
})

return;


// выбросить:

describe('relax - server level', function(){
    describe('methods', function(){
        it('should list all dbs', function(done){
            relax.allDbs(function(res){
                log('RES', res)
                done();
            })
        });
        it('should get server config', function(done){
            relax.config(function(res){
                log('CFG', res)
                done();
            });
        });
        it('should get server info', function(done){
            relax.info(function(res){
                log('INFO', res)
                done();
            });
        });
        it('should get server stats', function(done){
            relax.stats(function(res){
                //log('STATS', res)
                done();
            });
        });
        it('should get active tasks', function(done){
            relax.activeTasks(function(res){
                log('AT', res)
                done();
            });
        });
        it('should get uuids(count)', function(done){
            relax.uuids(2, function(res){
                log('COUNT', res)
                done();
            });
        });
    });
});


describe('relax', function(){
    describe('with an object', function(){
        it('should set dbname', function(done){
            var db = relax
                .dbname('latin')
                .query({ format: 'json' });
            db.end(function(res){
                log('RES', res.text)
                done();
            })
        })
    })


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
