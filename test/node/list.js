//
//var express = require('express');
//var app = express();
var url = require('url');
var Relax = require('../../');
var utils = require('./utils');
var relax = new Relax();
relax.dbname('relax-specs')
var admin = new Relax('http://admin:kjre4317@localhost:5984');

return;

describe('LIST method', function(){
    var doc = {_id: 'some-id', text: 'some text', count: 0};
    var other = {_id: 'other-id', text: 'some other text', count: 0};

    // var basicView = {
    //     map: function(doc) {
    //         emit(doc.integer, doc.string);
    //     }
    // };

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
        var row;
        while(row = getRow()) {
            //log('ROW', row);
            send(row.key);
        };
        return;
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
            .push(ddoc, function(err, res){
                done();
            });
    })
    before(function(done){
        relax
            .push(doc, function(err, res){
                done();
            });
    })
    after(function(done){
        admin.drop('relax-specs', function(err, res){
            done();
        })
    })

    describe('list', function(){
        it('should list existing doc', function(done){
            relax
                .list('spec/basicList')
                .view('spec/basicView')
                .end(function(res){
                    res.ok.should.be.ok;
                    res.text.should.equal('some text');
                    done();
                });
        })
        // it('should respond on missing doc', function(done){
        //     relax
        //         .show('spec/justText')
        //         .get('missingDoc')
        //         .end(function(res){
        //             res.status.should.equal(404);
        //             res.text.should.equal('no such doc');
        //             done();
        //         });
        // })
        // it('should respond on missing func', function(done){
        //     relax
        //         .show('spec/justMissingText')
        //         .get('missingDoc')
        //         .end(function(res){
        //             (res.ok == false).should.be.true;
        //             JSON.parse(res.text).error.should.equal('not_found');
        //             done();
        //         });
        // })
    })
})

function log () { console.log.apply(console, arguments) }
