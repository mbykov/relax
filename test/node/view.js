//
//var express = require('express');
//var app = express();
var url = require('url');
var Relax = require('../../');
var utils = require('./utils');
var relax = new Relax();
var admin = new Relax('http://admin:kjre4317@localhost:5984');

return;

describe('VIEW method', function(){
    var doc = {_id: 'some-id', text: 'some text', count: 1};
    var other = {_id: 'other-id', text: 'some other text', count: 2};
    var byText = function(doc) { emit(doc.text, null) };
    var sumMap = function (doc) { emit(doc.count, doc.count) };
    var sumReduce = function (keys, values) { return sum(values)};

    var ddoc = {_id: '_design/spec', views: {'byText': {map: byText.toString()}, summate:{map: sumMap.toString(), reduce: sumReduce.toString()} } };

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
    after(function(done){
        admin.drop('relax-specs', function(err, res){
            done();
        })
    })

    describe('view chainable', function(){
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
        it('should get result from reduce', function(done){
            relax
                .view('spec/summate')
                .query({include_docs: false})
                .end(function(res){
                    var value = JSON.parse(res.text).rows[0].value
                    value.should.equal(3);
                    done();
                });
        })
    })

    describe('view callback', function(){
        it('should get docs from view', function(done){
            relax
                .view('spec/byText', function(err, res) {
                    res.length.should.equal(2);
                    res[0].text.should.equal('some other text'); // due to collation
                    done();
                })
        })
        // view callback with keys or query params cannot be done
    })
})

function log () { console.log.apply(console, arguments) }
