//
//var express = require('express');
//var app = express();
var url = require('url');
var Relax = require('../../');
var utils = require('./utils');
var relax = new Relax();
var admin = new Relax('http://admin:kjre4317@localhost:5984');

return;

describe('view method', function(){
    var doc = {_id: 'some-id', text: 'some text', count: 0};
    var other = {_id: 'other-id', text: 'some other text', count: 0};
    var byText = function(doc) {
        emit(doc.text, null);
    };

    var ddoc = {_id: '_design/spec', views: {'byText': {map: byText.toString()} } };

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
    before(function(done){
        var docs = utils.makeDocs(10);
        relax.dbname('relax-specs')
            .push(docs, function(err, res){
                log('===', err, res)
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
    })
})

function log () { console.log.apply(console, arguments) }
