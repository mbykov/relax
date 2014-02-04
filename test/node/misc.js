//
//var z;

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

describe('MISC', function() {
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
        relax
            .post(doc, function(err, res){
                done();
            });
    })
    after(function(done){
        admin.drop(name, function(err, res) { done()});
    })

    //    - [ ] server: +.allDbs, .info, .compact, .viewCleanUp, .replicate, .uuids, .config, +.stats
    describe('server methods', function(){
        it('should show allDbs', function(done){
            relax.allDbs(function(err, res){
                (err == null).should.be.true;
                done();
            })
        })
        it('should show stats', function(done){
            relax.stats(function(err, res){
                (err == null).should.be.true;
                res.httpd.should.be.ok;
                done();
            })
        })
        it('should show config', function(done){
            var section = 'couchdb';
            admin.config(section, function(err, res){
                //log(err, res);
                (err == null).should.be.true;
                res.os_process_timeout.should.be.ok;
                done();
            })
        })
        it('should show config with key', function(done){
            var section = 'query_servers';
            var key = 'coffeescript';
            admin.config(section, key, function(err, res){
                //log(err, res);
                (err == null).should.be.true;
                res.should.be.ok;
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
