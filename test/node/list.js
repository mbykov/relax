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
    var doc = {_id: 'some-id', text: 'some text', count: 1};
    var other = {_id: 'other-id', text: 'some other text', count: 2};

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
        start({"headers":{"Content-Type" : "text/html"}});
        send("head");
        var row;
        while(row = getRow()) {
            //log(toJSON(row));
            send(row.key);
        };
        return "tail";
    };

    var listJSON = function(head, req) {
        var row;
        var res = [];
        while(row = getRow()) {
            var obj = {};
            obj[row.key] = row.value;
            res.push(obj);
        };
        return toJSON(res);
    };

    var ddoc = {_id: '_design/spec', lists: {'basicList': basicList.toString(), 'listJSON': listJSON.toString() }, views: {'basicView': {map: basicView.toString()} } };

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
        it('should list existing doc by get', function(done){
            //var xhr = CouchDB.request("GET", "/test_suite_db/_design/lists/_list/basicBasic/basicView");
            // var xhr = CouchDB.request("GET", "/relax-specs/_design/spec/_list/basicList/basicView");
            // log('APACHE', xhr.status);
            relax
                .get('_design/spec/_list/basicList/basicView')
                .end(function(err, res) {
                    res.text.should.equal('headsome texttail');
                    done();
                });
        });
        it('should list existing doc - callback', function(done){
            relax
                .list('spec/basicList')
                .view('spec/basicView', function(err, res) {
                    res.should.equal('headsome texttail');
                    done();
                });
        });
        it('should return json doc - chain', function(done){
            relax
                .list('spec/listJSON')
                .view('spec/basicView', function(err, res) {
                    res[0]['some text'].should.equal(1);
                    done();
                });
        });
        it('should return json doc - callback', function(done){
            relax
                .list('spec/listJSON')
                .view('spec/basicView')
                .end(function(err, res) {
                    res.text.should.equal(JSON.stringify([{'some text': 1}]));
                    done();
                });
        });
    });
})

function log () { console.log.apply(console, arguments) }
