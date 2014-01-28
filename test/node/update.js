//
//var express = require('express');
//var app = express();
var url = require('url');
var Relax = require('../../');
var relax = new Relax();
var admin = new Relax('http://admin:kjre4317@localhost:5984');

return;

describe('update method', function(){
    var doc = {_id: 'some-id', text: 'some text', count: 0};
    var other = {_id: 'other-id', text: 'some other text', count: 0};
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

    var ddoc = {_id: '_design/spec', updates: {'hello': hello.toString(), 'inPlace': inPlace.toString()} };

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
    after(function(done){
        admin.drop('relax-specs', function(err, res){
            done();
        })
    })

    describe('update chainable', function(){
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
    })
})


function log () { console.log.apply(console, arguments) }
