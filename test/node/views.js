//
//var request = require('../..');
//var express = require('express');
//var assert = require('better-assert');
//var app = express();
var url = require('url');
var Relax = require('../../');
var relax = new Relax();
var admin = new Relax('http://admin:kjre4317@localhost:5984');
//var db;

describe('view, show, list', function(){
    var doc = {_id: 'some-id', text: 'some text', count: 0};
    var other = {_id: 'other-id', text: 'some other text', count: 0};
    var byText = function(doc) {
        emit(doc.text, null);
    };
    var hello = function(doc, req) {
        if (!doc) {
            if (req.id) {
                return [ { _id : req.id }, "New World"];
            };
            return [null, "Empty World"];
        };
        doc.world = "hello";
        return [doc, JSON.stringify(doc)];
    }
    var inPlace = function(doc, req) {
        var field = req.query.field;
        var value = req.query.value;
        var message = "set "+field+" to "+value;
        doc[field] = value;
        return [doc, message];
    }

    var ddoc = {_id: '_design/spec', views: {'byText': {map: byText.toString()} }, updates: {'hello': hello.toString(), 'inPlace': inPlace.toString()} };

    before(function(done){
        admin.create('relax-specs', function(err, res){
            done();
        })
    })
    before(function(done){
        admin.dbname('relax-specs')
            .push(ddoc, function(err, res){
                done();
            });
    })
    before(function(done){
        relax.dbname('relax-specs')
            .push(doc, function(err, res){
                done();
            });
    })
    before(function(done){
        relax.dbname('relax-specs')
            .push(other, function(err, res){
                done();
            });
    })
    // FIXME: !!!! ==  DELETE /relax-specsrelax-specs 404
    // after(function(done){
    //     admin.drop('relax-specs', function(err, res){
    //         done();
    //     })
    // })

    describe('view method', function(){
        it('should get docs from view', function(done){
            relax
                .view('spec/byText')
                .end(function(res){
                    relax.fdocs(res).length.should.equal(2);
                    relax.fdocs(res)[0].text.should.equal('some other text'); // due to collation
                    done();
                });
        })
        it('should get docs from view with key', function(done){
            relax
                .view('spec/byText')
                .query({key:'"some text"'})
                .end(function(res){
                    relax.fdocs(res).length.should.equal(1);
                    relax.fdocs(res)[0].text.should.equal('some text');
                    done();
                });
        })
    })
    describe('update method', function(){
        it('should update existing doc', function(done){
            relax
                .update('spec/hello', doc)
                .end(function(res){
                    var world = JSON.parse(res.text).world;
                    res.headers['x-couch-id'].should.equal(doc._id);
                    world.should.equal('hello');
                    done();
                });
        })
        it('should format new doc', function(done){
            relax
                .update('spec/hello')
                .end(function(res){
                    res.text.should.equal('Empty World');
                    done();
                });
        })
        it('should create doc with new _id', function(done){
            relax
                .update('spec/hello/', {_id: 'nonExistingDoc'})
                .end(function(res){
                    res.text.should.equal('New World');
                    done();
                });
        })
        it('should update attr in-place', function(done){
            relax
                .update('spec/inPlace/', doc)
                .query({field:'world', value:'test'})
                .end(function(res){
                    res.text.should.equal('set world to test')
                    done();
                });
        })
        // it('should get docs from view with key', function(done){
        //     relax
        //         .view('spec/byText')
        //         .query({key:'"some text"'})
        //         .end(function(res){
        //             //log(relax.fdocs(res))
        //             relax.fdocs(res).length.should.equal(1);
        //             relax.fdocs(res)[0].text.should.equal('some text');
        //             done();
        //         });
        // })
    })
})

// // hello update world
// xhr = CouchDB.request("PUT", "/test_suite_db/_design/update/_update/hello/"+docid);
// T(xhr.status == 201);
// T(xhr.responseText == "<p>hello doc</p>");
// T(/charset=utf-8/.test(xhr.getResponseHeader("Content-Type")));
// T(equals(docid, xhr.getResponseHeader("X-Couch-Id")));

function log () { console.log.apply(console, arguments) }
