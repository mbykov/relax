//
//var express = require('express');
//var app = express();
//var url = require('url');

//var zero;

try {
    var Relax = require('relax');
} catch (err) {
    var Relax = require('../../');
}

//var Relax = require('relax');
//var map = require('map-component');
//var utils = require('./utils');

var relax = new Relax();
relax.dbname('relax-specs');
var admin = new Relax('http://admin:kjre4317@localhost:5984');
//var admin = new Relax('http://admin:kjre4317@couch.loc:5984');
//var docs = utils.makeDocs(5);
var docs = makeDocs(5);
var docs1 = makeDocs(6, 11);

return;

describe('doc(s)-CRUD methods', function(){
    this.slow(500);
    var doc = {_id: 'some-id', text: 'some text', count: 1};
    var other = {_id: 'other-id', text: 'some other text', count: 2};

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

    // describe('array of docs with callback', function(){
    //     it('should not get docs which not exist, surprise', function(done){
    //         relax.get(docs, function(err, res){
    //             (err == null).should.be.true;
    //             res.rows.forEach(function(row) {row.error.should.equal('not_found')});
    //             done();
    //         })
    //     });
    //     it('should not get docs with their _ids also', function(done){
    //         var keys = mapKeys(docs);
    //         relax.get(keys, function(err, res){
    //             (err == null).should.be.true;
    //             res.rows.forEach(function(row) {row.error.should.equal('not_found')});
    //             done();
    //         })
    //     });
    //     it('should bulk save docs in empty db', function(done){
    //         relax.post(docs, function(err, res){
    //             (err == null).should.be.true;
    //             res.forEach(function(row) {row.ok.should.be.true});
    //             done();
    //         })
    //     })
    //     it('should dirty push docs the same docs again', function(done){
    //         relax.push(docs, function(err, res){
    //             (err == null).should.be.true;
    //             res.forEach(function(row) {row.ok.should.be.true});
    //             done();
    //         })
    //     })
    //     it('should not bulk save the same docs again', function(done){
    //         relax.post(docs, function(err, res){
    //             (err == null).should.be.true;
    //             res.forEach(function(row) {row.error.should.equal('conflict')});
    //             done();
    //         })
    //     })

    //     it('should get all existing docs', function(done){
    //         relax.get(docs, function(err, res){
    //             (err == null).should.be.true;
    //             res.rows.forEach(function(row) {row.id.should.be.ok});
    //             res.rows.forEach(function(row) {row.doc.text.should.equal('some text')});
    //             done();
    //         })
    //     })
    //     it('should get all existing docs by their _ids', function(done){
    //         var keys = mapKeys(docs);
    //         relax.get(keys, function(err, res){
    //             (err == null).should.be.true;
    //             res.rows.forEach(function(row) {row.id.should.be.ok});
    //             res.rows.forEach(function(row) {row.doc.text.should.equal('some text')});
    //             done();
    //         })
    //     })
    //     it('should bulk delete existing docs', function(done){
    //         relax.del(docs, function(err, res){
    //             (err == null).should.be.true;
    //             res.forEach(function(row) {row.id.should.be.ok});
    //             done();
    //         })
    //     })
    // })

    // describe('array of docs - chainable', function(){
    //     it('should not get docs which not exist', function(done){
    //         relax
    //             .get(docs)
    //             .end(function(res){
    //                 JSON.parse(res.text).total_rows.should.equal(0);
    //                 JSON.parse(res.text).offset.should.equal(0);
    //                 done();
    //             })
    //     })
    //     it('should not get non-existing docs by keys as well', function(done){
    //         var keys = mapKeys(docs);
    //         relax
    //             .get(keys)
    //             .end(function(res){
    //                 JSON.parse(res.text).total_rows.should.equal(0);
    //                 JSON.parse(res.text).offset.should.equal(0);
    //                 done();
    //             })
    //     })
    //     it('should bulk save docs in empty db', function(done){
    //         relax
    //             .post(docs1)
    //             .end(function(res){
    //                 JSON.parse(res.text).forEach(function(row) {row.ok.should.be.true});
    //                 done();
    //             })
    //     })
    //     it('should get existing docs', function(done){
    //         relax
    //             .get(docs)
    //             .query({include_docs: true})
    //             .end(function(res){
    //                 var rows = JSON.parse(res.text).rows;
    //                 JSON.parse(res.text).total_rows.should.equal(5);
    //                 JSON.parse(res.text).offset.should.equal(0);
    //                 rows.forEach(function(row) {row.id.should.be.ok});
    //                 rows.forEach(function(row) {row.doc.text.should.equal('some text')});
    //                 done();
    //             })
    //     })
    // })

    describe('single doc with callbacks', function(){
        it('should not get doc if it does not exist', function(done){
            log('1 should not get doc if it does not exist');
            relax.get(doc, function(err, res){
                log('1', err, res);
                (err) ? err.error.should.equal('not_found') : res.text.should.equal('some text');
                done();
            })
        })
        it('should not delete doc if it does not exist', function(done){
            log('2 should not delete doc if it does not exist');
            relax
                .del(doc, function(err, res){
                    (err == null).should.be.true;
                    (res.ok) ? res.ok.should.be.ok : res.error.should.equal('not_found');
                    done();
                })
        })
        it('should push doc if it exists in DB or does not, single doc, callback', function(done){
            log('3 should push doc if it exists in DB or does not, single doc, callback');
            relax
                .post(other, function(err, res){
                    log('3 ', res.ok);
                    (err == null).should.be.true;
                    res.ok.should.be.ok;
                    //res.text.should.equal('some other text');
                    done();
                })
        })

        it('should get doc if it exists', function(done){
            log('4 should get doc if it exists');
            relax
                .get(other, function(err, res){
                    (err) ? err.error.should.equal('not_found') : res.text.should.equal('some other text');
                done();
            })
        })
        it('should delete doc', function(done){
            log('5 should delete doc');
            relax
                .del(doc, function(err, res){
                    (err == null).should.be.true;
                    (res.ok) ? res.ok.should.be.ok : res.error.should.equal('not_found');
                    done();
                })
        })
    })

    describe('single doc - get.chainable', function(){
        it('should not get doc if it does not exist', function(done){
            log('CH 1 should not get doc if it does not exist')
            relax
                .get(doc)
                .end(function(res){
                    log(res.text);
                    (res.ok) ? res.text.should.equal('some text') : JSON.parse(res.text).error.should.equal('not_found');
                    done();
                })
        })
        it('should push doc if it exists in DB or does not', function(done){
            log('CH 2 should push doc if it exists in DB or does not')
            relax
            .post(doc, function(err, res){
                log('2 ', res);
                done();
            })
        })
        it('should get existing doc', function(done){
            log('CH 3 should get existing doc');
            relax
                .get(doc)
                .end(function(err, res){
                    log('CH 3', err, res.text);
                    //(res.ok) ? res.text.should.equal('some text') : JSON.parse(res.text).error.should.equal('not_found');
                    done();
                })
        })

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
        doc.text = 'some text';
        docs.push(doc);
    }
    return docs;
};

//var keys = map(docs, function(doc) { return doc._id});

function mapKeys(docs) {
    var res = [];
    docs.forEach(function(doc) {
        res.push(doc._id);
    })
    return res;
}
