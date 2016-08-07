//

try {
    var Relax = require('relax');
} catch (err) {
    var Relax = require('../../');
}

var relax = new Relax();
var name = 'relax-specs';
relax.dbname(name);
var admin = new Relax('http://admin:kjre4317@localhost:5984');

describe('CRUD-callback methods', function(){
    this.slow(500);
    var docs = makeDocs(5);
    var docs1 = makeDocs(6, 11);
    // var doc = {_id: 'some-id', text: 'some text', count: 1};
    // var other = {_id: 'other-id', text: 'other text', count: 2};
    var doc = {text: 'some text', count: 1};
    var other = {text: 'other text', count: 2};
    var uuid, rev;

    before(function(done){
        admin.create(name, function(err, res) { done()});
    })
    before(function(done){
        relax
            .post(doc, function(err, res){
                uuid = res.id;
                rev = res.rev;
                done();
            });
    })
    after(function(done){
        admin.drop(name, function(err, res) { done()});
    })

    describe('single doc', function(){
        it('should get existing doc', function(done){
            doc._id = uuid;
            relax.get(doc, function(err, res){
                    (err == null).should.be.true;
                    res.text.should.equal('some text');
                    done();
                })
        })
        it('should get doc by id', function(done){
            relax.get(uuid, function(err, res){
                (err == null).should.be.true;
                res.text.should.equal('some text');
                done();
            })
        })
        it('should not get missing doc', function(done){
            relax.get('non-existing-id', function(err, res){
                (err == null).should.be.true;
                res.error.should.equal('not_found');
                done();
            })
        })
        it('should not insert a new version of the document w/o rev', function(done){
            doc.text = 'new text';
            relax.put(doc, function(err, res){
                (err == null).should.be.true;
                res.error.should.equal('conflict');
                done();
            })
        })
        it('should insert a new version of the document', function(done){
            doc._rev = rev;
            doc.text = 'new text';
            relax.put(doc, function(err, res){
                (err == null).should.be.true;
                res.ok.should.be.ok;
                rev = res.rev;
                done();
            })
        })
        // it('should delete doc', function(done){
        //     doc._rev = rev;
        //     relax.del(doc, function(err, res){
        //         (err == null).should.be.true;
        //         res.ok.should.be.ok;
        //         done();
        //     })
        // })

        it('should push other doc', function(done){
            relax
                .push(other, function(err, res){
                    (err == null).should.be.true;
                    res.ok.should.be.ok;
                    done();
                })
        })
        it('should push the other doc again even w/o rev', function(done){
            relax
                .push(other, function(err, res){
                    (err == null).should.be.true;
                    res.ok.should.be.ok;
                    done();
                })
        })
    })

    describe('array of docs', function(){
        it('should bulk save docs', function(done){
            relax.bulk(docs, function(err, res){
                (err == null).should.be.true;
                res.forEach(function(row) {
                    row.ok.should.be.ok;
                })
                done();
            })
        })
        it('should not bulk save the same docs', function(done){
            relax.bulk(docs, function(err, res){
                (err == null).should.be.true;
                res.forEach(function(row) {
                    row.error.should.equal('conflict');
                })
                done();
            })
        })
        it('should get all docs', function(done){
            relax.all(function(err, res){
                (err == null).should.be.true;
                res.total_rows.should.equal(8);
                res.rows.length.should.equal(8);
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
        doc.text = 'some text ' + i;
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
