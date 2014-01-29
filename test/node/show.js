//
//var express = require('express');
//var app = express();
var url = require('url');
var Relax = require('../../');
var utils = require('./utils');
var relax = new Relax();
var admin = new Relax('http://admin:kjre4317@localhost:5984');

describe('show method', function(){
    var doc = {_id: 'some-id', text: 'some text', count: 0};
    var other = {_id: 'other-id', text: 'some other text', count: 0};

    var justText = function(doc, req) {
        if (doc) {
            return { body : "just " + doc.text };
        }
        return {
            body : "no such doc",
            code : 404
        };
    };

    var ddoc = {_id: '_design/spec', shows: {'justText': justText.toString() } };

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

    describe('show', function(){
        it('should show existing doc', function(done){
            relax
                .show('spec/justText')
                .get(doc)
                .end(function(res){
                    res.text.should.equal('just some text');
                    done();
                });
        })
        it('should respond on missing doc', function(done){
            relax
                .show('spec/justText')
                .get('missingDoc')
                .end(function(res){
                    res.status.should.equal(404);
                    res.text.should.equal('no such doc');
                    done();
                });
        })
        it('should respond on missing func', function(done){
            relax
                .show('spec/justMissingText')
                .get('missingDoc')
                .end(function(res){
                    (res.ok == false).should.be.true;
                    JSON.parse(res.text).error.should.equal('not_found');
                    done();
                });
        })
    })
})

function log () { console.log.apply(console, arguments) }
