//
//var express = require('express');
//var app = express();

try {
    var Relax = require('relax');
} catch (err) {
    var Relax = require('../../');
}

var relax = new Relax();
var name = 'relax-specs';
relax.dbname(name);
var admin = new Relax('http://admin:kjre4317@localhost:5984');

return;

describe('SHOW method', function(){
    this.slow(500);
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
            .post(ddoc, function(err, res){
                done();
            });
    })
    before(function(done){
        relax
            .post(doc, function(err, res){
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
