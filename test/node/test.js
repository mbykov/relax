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

describe('_design doc', function(){
    log('BEFORE')
    var doc = {_id: 'some-id', text: 'some text', count: 0};
    var byText = function(doc) {
        emit(doc.text, null);
    };
    var ddoc = {_id: '_design/spec', views: {'byType': {map: byText.toString()} } };
    before(function(done){
        admin.create('relax-specs', function(err, res){
            log('CREATE', err, res);
            done();
        })
    })
    before(function(done){
        log('PUSHING DESING')
        admin.dbname('relax-specs');
        admin
            .push(ddoc, function(err, res){
                log('DDOC', err, res);
                // (err == null).should.be.true;
                // res.ok.should.be.ok;
                done();
            });
    })
    // after(function(done){
    //     db = relax.dbname('http://admin:kjre4317@localhost:5984');
    //     db.drop('relax-specs', function(err, res){
    //         relax.dbname('http://localhost:5984/relax-specs');
    //         done();
    //     })
    // })

    describe('push', function(){
        it('should push _design doc', function(done){
            log('PUSHING DESING__')
            // admin.dbname('relax-specs');
            // admin
            //     .push(ddoc, function(err, res){
            //         log('DDOC', err, res);
            //         // (err == null).should.be.true;
            //         // res.ok.should.be.ok;
            done();
            //     });
        })
    })
})

return

 describe('view, show, list', function(){
    var doc = {_id: 'some-id', body: 'some text', count: 0};
    describe('view', function(){
        it('should get docs from view', function(done){
            relax.dbname('http://localhost:5984/latin');
            relax
                .view('latin/by_dict')
                .end(function(res){
                    relax.fdocs(res).length.should.equal(5);
                    //log(relax.fdocs(res));
                    done();
                });
        })
        it('should get docs from view with key', function(done){
            relax.dbname('http://localhost:5984/latin');
            relax
                .view('latin/by_dict')
                .query({key:'"aperio"'})
                .end(function(res){
                    relax.fdocs(res)[0].dict.should.equal('aperio')
                    done();
                });
        })
        //
        // it('should not get doc if it does not exist', function(done){
        //     relax
        //         .get(doc)
        //         .set('cache', true)
        //         .end(function(res){
        //             res.text.trim().should.equal('{"error":"not_found","reason":"missing"}')
        //             done();
        //         });
        // })
    })
})

return

describe('relax - docs level', function(){
    var doc = {_id: 'some-id', body: 'some text', count: 0};
    before(function(done){
        db = relax.dbname('http://admin:kjre4317@localhost:5984');
        db.create('relax-specs', function(err, res){
            relax.dbname('http://localhost:5984/relax-specs');
            done();
        })
    })
    after(function(done){
        db = relax.dbname('http://admin:kjre4317@localhost:5984');
        db.drop('relax-specs', function(err, res){
            relax.dbname('http://localhost:5984/relax-specs');
            done();
        })
    })

    describe('doc-crud methods', function(){
        it('should not get doc if it does not exist', function(done){
            relax.get(doc, function(err, res){
                (err) ? err.error.should.equal('not_found') : res.body.should.equal('some text');
                done();
            })
        })
        it('should not get doc if it does not exist', function(done){
            relax
                .get(doc)
                .set('cache', true)
                .end(function(res){
                    res.text.trim().should.equal('{"error":"not_found","reason":"missing"}')
                    done();
                });
        })
        it('should not delete doc if it does not exist', function(done){
            relax
                .del(doc, function(err, res){
                    (err == null).should.be.true;
                    (res.ok) ? res.ok.should.be.ok : res.error.should.equal('not_found');
                    done();
                })
        })
        it('should push doc if it exists in DB or does not', function(done){
            relax
                .push(doc, function(err, res){
                    (err == null).should.be.true;
                    res.ok.should.be.ok;
                    done();
                })
        })
        it('should get doc if it exists', function(done){
            relax
                .get(doc, function(err, res){
                    (err) ? err.error.should.equal('not_found') : res.body.should.equal('some text');
                done();
            })
        })
        it('should delete doc', function(done){
            relax
                .del(doc, function(err, res){
                    (err == null).should.be.true;
                    (res.ok) ? res.ok.should.be.ok : res.error.should.equal('not_found');
                    done();
                })
        })
    })
})

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
