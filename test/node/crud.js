//
//var express = require('express');
//var app = express();
var url = require('url');
var Relax = require('../../');
var utils = require('./utils');
var relax = new Relax();
relax.dbname('relax-specs')
var admin = new Relax('http://admin:kjre4317@localhost:5984');

describe('doc(s)-crud methods', function(){
    var doc = {_id: 'some-id', body: 'some text', count: 0};
    before(function(done){
        admin.create('relax-specs', function(err, res){ done()});
    })
    // before(function(done){
    //     relax.dbname('relax-specs')
    //         .push(doc, function(err, res){ done() });
    // })
    after(function(done){
        admin.drop('relax-specs', function(err, res){ done()});
    })

    describe('array with callback', function(){
        var docs = utils.makeDocs(5);
        it('should not get all docs which not exist', function(done){
            relax.get(docs, function(err, res){
                (err == null).should.be.true;
                res.rows[0].error.should.equal('not_found');
                done();
            })
        })
        it('should bulk save docs in empty db', function(done){
            relax.push(docs, function(err, res){
                (err == null).should.be.true;
                res[0].ok.should.be.ok;
                done();
            })
        })
        it('should bulk save docs', function(done){
            relax.push(docs, function(err, res){
                //log('2222', err, res)
                //(err == null).should.be.true;
                //(err) ? err.error.should.equal('not_found') : res.body.should.equal('some text');
                done();
            })
        })
        // it('should get all docs with _all_docs', function(done) {
        //     relax.get(docs, function(err, res){
        //         (err == null).should.be.true;
        //         log(err, res)
        //         done();
        //     })
        // })
    })

    describe('single doc with callbacks', function(){
        it('should not get doc if it does not exist', function(done){
            relax.get(doc, function(err, res){
                (err) ? err.error.should.equal('not_found') : res.body.should.equal('some text');
                done();
            })
        })
        // it('should not get doc if it does not exist', function(done){
        //     relax
        //         .get(doc)
        //         .set('cache', true)
        //         .end(function(res){
        //             res.text.trim().should.equal('{"error":"not_found","reason":"missing"}')
        //             done();
        //         });
        // })
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
                    //log(res.text)
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


function log () { console.log.apply(console, arguments) }
