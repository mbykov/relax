//
//var express = require('express');
//var app = express();

try {
    var Relax = require('relax');
} catch (err) {
    var Relax = require('../../');
}

var relax = new Relax();
relax.dbname('relax-specs');
var admin = new Relax('http://admin:kjre4317@localhost:5984');

//return;

describe('LIST method', function(){
    this.slow(500);
    var doc = {_id: 'some-id', text: 'some text', count: 0};
    var other = {_id: 'other-id', text: 'some other text', count: 0};

    var basicView = function(doc) {
        emit(doc.text, doc.count);
    };

    var withReduce = {
        map: function(doc) {
            emit(doc.integer, doc.string);
        },
        reduce: function(keys, values, rereduce) {
            if (rereduce) {
                return sum(values);
            } else {
                return values.length;
            }
        }
    };

    var basicList = function(head, req) {
        send("head");
        var row;
        log('=======START', head);
        log('=======START', req);
        while(row = getRow()) {
            log("=========row: "+toJSON(row));
            send(row.key);
        };
        return "tail";
        //return;
    };

    //var ddoc = {_id: '_design/spec', views: {'byText': {map: byText.toString()} } };
    var ddoc = {_id: '_design/spec', lists: {'basicList': basicList.toString() }, views: {'basicView': {map: basicView.toString()} } };

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

    describe('list', function(){
        it('should get doc if it exists', function(done){
            relax
                .get(doc, function(err, res){
                    (err) ? err.error.should.equal('not_found') : res.text.should.equal('some text');
                    done();
                })
        });
        it('should get docs from view', function(done){
            relax
                .view('spec/basicView', function(err, res) {
                    //log('VIEW', err.text, res);
                    // res.length.should.equal(2);
                    // res[0].text.should.equal('some other text'); // due to collation
                    done();
                })
        });
        it('should list existing doc', function(done){
            relax
                .list('spec/basicList')
                .view('spec/basicView', function(err, res) {
                    log('_______LIST RES', err, res.text);
                    //res.text.should.equal('some text');
                    done();
                });
        });
        it('should get doc if it exists', function(done){
            relax
                .get(doc, function(err, res){
                    (err) ? err.error.should.equal('not_found') : res.text.should.equal('some text');
                    done();
                })
        });
    })
})

function log () { console.log.apply(console, arguments) }
