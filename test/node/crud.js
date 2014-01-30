//
//var express = require('express');
//var app = express();
//var url = require('url');
var map = require('map-component'); // FIXME: try etc
var Relax = require('../../');
var utils = require('./utils');
var relax = new Relax();
relax.dbname('relax-specs');
var admin = new Relax('http://admin:kjre4317@localhost:5984');
var docs = utils.makeDocs(5);

describe('doc(s)-CRUD methods', function(){
    var doc = {_id: 'some-id', body: 'some text', count: 0};
    before(function(done){
        admin.create('relax-specs', function(err, res) { done()});
    })
    // before(function(done){
    //     relax
    //         .push(doc, function(err, res){ done() });
    // })
    after(function(done){
        admin.drop('relax-specs', function(err, res) { done()});
    })

    describe('array of docs with callback', function(){
        it('should not get docs which not exist, surprise', function(done){
            relax.get(docs, function(err, res){
                (err == null).should.be.true;
                res.rows.forEach(function(row) {row.error.should.equal('not_found')});
                done();
            })
        })
        it('should not get docs with their _ids also', function(done){
            var keys = map(docs, function(doc) { return doc._id});
            relax.get(keys, function(err, res){
                (err == null).should.be.true;
                res.rows.forEach(function(row) {row.error.should.equal('not_found')});
                done();
            })
        })
        it('should bulk save docs in empty db', function(done){
            relax.push(docs, function(err, res){
                (err == null).should.be.true;
                res.forEach(function(row) {row.ok.should.be.true});
                done();
            })
        })
        it('should bulk save the same docs again', function(done){
            relax.push(docs, function(err, res){
                (err == null).should.be.true;
                res.forEach(function(row) {row.ok.should.be.true});
                done();
            })
        })
        it('should get all existing docs', function(done){
            relax.get(docs, function(err, res){
                (err == null).should.be.true;
                res.rows.forEach(function(row) {row.id.should.be.ok});
                res.rows.forEach(function(row) {row.doc.text.should.equal('some text')});
                done();
            })
        })
        it('should get all existing docs by their _ids', function(done){
            var keys = map(docs, function(doc) { return doc._id});
            relax.get(keys, function(err, res){
                (err == null).should.be.true;
                res.rows.forEach(function(row) {row.id.should.be.ok});
                res.rows.forEach(function(row) {row.doc.text.should.equal('some text')});
                done();
            })
        })
        it('should bulk delete existing docs', function(done){
            relax.del(docs, function(err, res){
                (err == null).should.be.true;
                res.forEach(function(row) {row.id.should.be.ok});
                done();
            })
        })
    })

    describe('array of docs - get.chainable', function(){
        it('should not get docs which not exist', function(done){
            relax
                .get(docs)
                .end(function(res){
                    JSON.parse(res.text).total_rows.should.equal(0);
                    JSON.parse(res.text).offset.should.equal(0);
                    done();
                })
        })
        it('should not get non-existing docs by keys as well', function(done){
            var keys = map(doc, function(doc) { return doc._id});
            relax
                .get(keys)
                .end(function(res){
                    JSON.parse(res.text).total_rows.should.equal(0);
                    JSON.parse(res.text).offset.should.equal(0);
                    done();
                })
        })
        it('should bulk save docs in empty db', function(done){
            relax
                .push(docs, function(err, res){
                    (err == null).should.be.true;
                    res.forEach(function(row) {row.ok.should.be.true});
                    done();
                })
        })
        it('should get existing docs', function(done){
            relax
                .get(docs)
                .query({include_docs: true})
                .end(function(res){
                    var rows = JSON.parse(res.text).rows;
                    JSON.parse(res.text).total_rows.should.equal(5);
                    JSON.parse(res.text).offset.should.equal(0);
                    rows.forEach(function(row) {row.id.should.be.ok});
                    rows.forEach(function(row) {row.doc.text.should.equal('some text')});
                    done();
                })
        })
    })

    describe('single doc with callbacks', function(){
        it('should not get doc if it does not exist', function(done){
            relax.get(doc, function(err, res){
                (err) ? err.error.should.equal('not_found') : res.body.should.equal('some text');
                done();
            })
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

/*

  it('should get all docs with _all_docs', function(done) {
  relax.get(docs, function(err, res){
  (err == null).should.be.true;
  log(err, res)
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


*/
