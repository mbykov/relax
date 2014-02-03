//
//var zero;

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

describe('doc-CRUD methods with callback', function(){
    this.slow(500);
    var docs = makeDocs(5);
    var docs1 = makeDocs(6, 11);
    // var doc = {_id: 'some-id', text: 'some text', count: 1};
    // var other = {_id: 'other-id', text: 'some other text', count: 2};
    var doc = {text: 'some text', count: 1};
    var other = {text: 'other text', count: 2};
    var uuid, rev;

    before(function(done){
        admin.create(name, function(err, res) { done()});
    })
    before(function(done){
        relax.uuids(function(uuids) {
            uuid = uuids[0];
            doc._id = uuid;
            done();
        })
    })
    before(function(done){
        relax
            .put(doc, function(err, res){
                rev = res.rev;
                //uuid = res.id;
                done();
            });
    })
    // after(function(done){
    //     admin.drop(name, function(err, res) { done()});
    // })

    describe('single doc', function(){
        it('should get existing doc', function(done){
            doc._id = uuid;
            relax
                .get(doc, function(err, res){
                    (err == null).should.be.true;
                    res.text.should.equal('some text');
                    done();
                })
        })
        it('should get doc by id', function(done){
            relax
                .get(uuid, function(err, res){
                    (err == null).should.be.true;
                    res.text.should.equal('some text');
                    done();
                })
        })

        it('should not delete doc w/o rev', function(done){
            relax
                .del(doc, function(err, res){
                    (res == null).should.be.true;
                    err.should.equal('not valid doc');
                    done();
                })
        })
        it('should delete doc', function(done){
            doc._rev = rev;
            relax
                .del(doc, function(err, res){
                    (err == null).should.be.true;
                    res.ok.should.be.ok;
                    done();
                })
        })
    //     it('should conflict with deleted doc', function(done){
    //         relax
    //             .post(doc, function(err, res){
    //                 (res == null).should.be.true;
    //                 err.error.should.equal('conflict');
    //                 done();
    //             })
    //     })
        it('should post other doc', function(done){
            relax
                .post(other, function(err, res){
                    rev = res.rev;
                    uuid = res.id;
                    (err == null).should.be.true;
                    (res.ok) ? res.ok.should.be.ok : res.error.should.equal('not_found');
                    done();
                })
        })
        // it('should not post the same doc again', function(done){
        //     other._id = uuid;
        //     relax
        //         .put(other, function(err, res){
        //             (res == null).should.be.true;
        //             err.error.should.equal('conflict');
        //             done();
        //         })
        // })
        it('should get doc by id', function(done){
            other._id = uuid;
            relax
                .get(other, function(err, res){
                    (err == null).should.be.true;
                    res.text.should.equal('other text');
                    done();
                })
        })
        it('should put doc with rev', function(done){
            other._id = uuid;
            other._rev = rev;
            relax
                .put(other, function(err, res){
                    (err == null).should.be.true;
                    (res.ok) ? res.ok.should.be.ok : res.error.should.equal('not_found');
                    done();
                })
        })
    //     it('should push the same doc w/o rev', function(done){
    //         relax
    //             .push(other, function(err, res){
    //                 (err == null).should.be.true;
    //                 (res.ok) ? res.ok.should.be.ok : res.error.should.equal('not_found');
    //                 done();
    //             })
    //     })
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
