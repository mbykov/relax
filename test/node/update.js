//
//var express = require('express');
//var app = express();
var url = require('url');
try {
    var Relax = require('relax');
} catch (err) {
    var Relax = require('../../');
}
var relax = new Relax();
var name = 'relax-specs';
relax.dbname(name);
var admin = new Relax('http://admin:kjre4317@localhost:5984');

//return;

describe('update method', function(){
    this.slow(500);
    var doc = {text: 'some text', count: 1};
    var other = {text: 'other text', count: 2};
    var uuid, rev;

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
        admin.create(name, function(err, res){
            done();
        })
    })
    before(function(done){
        admin.dbname(name)
            .post(ddoc, function(err, res){
                done();
            });
    })
    before(function(done){
        relax
            .post(doc, function(err, res){
                doc._id = res.id;
                done();
            });
    })
    after(function(done){
        admin.drop(name, function(err, res){
            done();
        })
    })

    describe('update chainable', function(){
        it('should update existing doc', function(done){
            relax
                .update('spec/hello')
                .put(doc)
                .end(function(err, res){
                    var world = JSON.parse(res.text).world;
                    res.headers['x-couch-id'].should.equal(doc._id);
                    world.should.equal('hello');
                    done();
                });
        })
        it('should format empty doc', function(done){
            relax
                .update('spec/hello')
                .post(other)
                .end(function(err, res){
                    res.text.should.equal('Empty World');
                    done();
                });
        })
        it('should create doc with new _id', function(done){
            relax
                .update('spec/hello/')
                .put({_id: 'nonExistingDoc'})
                .end(function(err, res){
                    res.text.should.equal('New World');
                    done();
                });
        })
        it('should update attr in-place', function(done){
            relax
                .update('spec/inPlace/')
                .put(doc._id)
                .query({field:'world', value:'test'})
                .end(function(err, res){
                    res.text.should.equal('set world to test')
                    done();
                });
        })
    })

})


function log () { console.log.apply(console, arguments) }
