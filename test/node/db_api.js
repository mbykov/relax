//
var Relax = require('../../');
var _ = require('underscore');
var should = require('should');
//var debug = true;

describe('DB object', function(){
    describe('constructor', function(){
        it('should set a name', function(done){
            var relax = new Relax;
            should.not.exist(relax.dbname);
            relax.database("mydb");
            relax.dbname.should.equal("/mydb");
            relax.database("/mydb");
            relax.dbname.should.equal("/mydb");
            done();
        })
        it('should set an url', function(done){
            var relax = new Relax;
            relax.database("stuff");
            relax.dbname.should.equal("/stuff");
            relax.url.should.equal("http://localhost:5984/stuff");
            done();
        })
    })
})

describe('DB object', function(){
    var relax = new Relax;
    var db = relax.database("mydb");
    beforeEach(function(done){
        db.drop(function(err){
            //if (err) return done(err);
            done();
         });
    })
    describe('create method', function(){
        it('should create db', function(done){
            db.create(function(res){
                res.ok.should.be.ok;
                done();
            });
        })
    })
})

function log(res){
    if (!debug) return;
    if (res.ok) {
        console.log('==>res.ok ' + JSON.stringify(res.body));
    } else {
        console.log('==>res.no  ' + res.text);
    }}


//console.log("DB: " + JSON.stringify(db));
