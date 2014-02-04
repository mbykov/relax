//
//var express = require('express');
//var app = express();
//var url = require('url');

try {
    var Relax = require('relax');
} catch (err) {
    var Relax = require('../../');
}
//var Relax = require('../../');

var relax = new Relax();
var name = 'relax-specs';
relax.dbname(name);
var admin = new Relax('http://admin:kjre4317@localhost:5984');

//return;

describe('VIEW method', function(){
    this.slow(500);
    var uuid, rev;
    var docs = makeDocs(5);
    var byText = function(doc) { emit(doc.text, null) };
    var sumMap = function (doc) { emit(doc.count, doc.count) };
    var sumReduce = function (keys, values) { return sum(values)};

    var ddoc = {_id: '_design/spec', views: {'byText': {map: byText.toString()}, summate:{map: sumMap.toString(), reduce: sumReduce.toString()} } };

    before(function(done){
        admin.create(name, function(err, res){
            done();
        })
    })
    before(function(done){
        admin.dbname(name).post(ddoc, function(err, res){ done() });
    })
    before(function(done){
        relax.bulk(docs, function(err, res){
            done();
        });
    })
    after(function(done){
        admin.drop(name, function(err, res){ done() });
    })

    describe('view chainable', function(){
        it('should get docs from view', function(done){
            relax
                .view('spec/byText')
                .end(function(err, res){
                    // log(err, JSON.parse(res.text).rows);
                    relax.frows(res).length.should.equal(5);
                    relax.frows(res)[0].key.should.equal('some text 0');
                    done();
                });
        })
        it('should view docs with include_docs', function(done){
            relax
                .view('spec/byText')
                .query({include_docs: true})
                .end(function(err, res){
                    relax.fdocs(res).length.should.equal(5);
                    relax.fdocs(res)[0].text.should.equal('some text 0');
                    done();
                });
        })
        it('should get docs from view with key', function(done){
            relax
                .view('spec/byText')
                .query({key:'"some text 4"'})
                .end(function(err, res){
                    relax.frows(res).length.should.equal(1);
                    relax.frows(res)[0].key.should.equal('some text 4');
                    done();
                });
        })
        it('should get docs from view with startkey-endkey', function(done){
            relax
                .view('spec/byText')
                .query({startkey:'"some text 1"', endkey:'"some text 3"'})
                .end(function(err, res){
                    relax.frows(res).length.should.equal(3);
                    relax.frows(res)[0].key.should.equal('some text 1');
                    done();
                });
        })
        it('should get result from reduce', function(done){
            relax
                .view('spec/summate')
                .query({include_docs: false})
                .end(function(err, res){
                    var value = JSON.parse(res.text).rows[0].value
                    value.should.equal(10);
                    done();
                });
        })
    })

    describe('view with callback', function(){
        it('should get docs from view', function(done){
            relax
                .view('spec/byText', function(err, res) {
                    res.rows.length.should.equal(5);
                    res.rows[1].key.should.equal('some text 1');
                    done();
                })
        })
        // view callback with keys or query params cannot be done
    })
})

function log () { console.log.apply(console, arguments) }

function makeDocs(start, stop) {
    var docs = [];
    if (!stop) stop = start, start = 0;
    for (var i = start; i < stop; i++) {
        var doc = {};
        doc._id = i.toString();
        doc.count = i;
        doc.text = 'some text ' + i;
        docs.push(doc);
    }
    return docs;
};
