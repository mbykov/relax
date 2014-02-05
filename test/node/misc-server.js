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

    before(function(done){
        admin.create(name, function(err, res) { done()});
    })
    after(function(done){
        admin.drop(name, function(err, res) { done()});
    })

    describe('server methods', function(){
        it('should show allDbs', function(done){
            relax.allDbs(function(err, res){
                (err == null).should.be.true;
                res.should.be.ok;
                done();
            })
        });
        it('should show allDbs - chain', function(done){
            relax.allDbs()
                .end(function(err, res){
                    (err == null).should.be.true;
                    res.text.should.be.ok;
                    done();
                })
        });
        it('should show activeTasks', function(done){
            admin.activeTasks(function(err, res){
                (err == null).should.be.true;
                res.should.be.ok;
                done();
            })
        });
        it('should show stats', function(done){
            relax.stats(function(err, res){
                (err == null).should.be.true;
                res.httpd.should.be.ok;
                done();
            })
        });
        it('should show stats - chain', function(done){
            relax.stats()
                .end(function(err, res){
                    (err == null).should.be.true;
                    JSON.parse(res.text).httpd.should.be.ok;
                    done();
                })
        });
        it('should show config', function(done){
            var section = 'couchdb';
            admin.config(section, function(err, res){
                (err == null).should.be.true;
                res.os_process_timeout.should.be.ok;
                done();
            })
        });
        it('should show config with key', function(done){
            var section = 'query_servers';
            var key = 'coffeescript';
            admin.config(section, key, function(err, res){
                (err == null).should.be.true;
                res.should.be.ok;
                done();
            })
        });
        it('should get uuids with count', function(done){
            relax.uuids(5, function(err, res){
                (err == null).should.be.true;
                res.length.should.equal(5);
                done();
            })
        });
        it('should get uuids with count - chain', function(done){
            relax.uuids(5)
                .end(function(err, res){
                    (err == null).should.be.true;
                    JSON.parse(res.text).uuids.length.should.equal(5);
                    done();
                })
        });

        it('should get uuids with count', function(done){
            relax.uuids(5, function(err, res){
                (err == null).should.be.true;
                res.length.should.equal(5);
                done();
            })
        });


    })

})


function log () { console.log.apply(console, arguments) }
