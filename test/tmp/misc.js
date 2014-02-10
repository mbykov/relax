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
        it('should get uuids with count - chain', function(done){
            relax.uuids(5)
                .end(function(err, res){
                    (err == null).should.be.true;
                    JSON.parse(res.text).uuids.length.should.equal(5);
                    done();
                })
        });
    });
    it('should get uuids with count - callback', function(done){
        relax.uuids(5, function(err, res){
            (err == null).should.be.true;
            res.uuids.length.should.equal(5);
            done();
        })
    });
    describe('database methods', function(){
        it('should show existing db', function(done){
            relax.exists(name, function(err, res){
                (err == null).should.be.true;
                res.should.be.true;
                done();
            })
        });
        it('should not show non existing db', function(done){
            relax.exists('non-exists', function(err, res){
                (err == null).should.be.true;
                res.should.be.false;
                done();
            })
        });
        it('should show existing db - chain', function(done){
            relax.exists(name)
                .end(function(err, res){
                    (err == null).should.be.true;
                    res.ok.should.be.true;
                    done();
                })
        });
        it('should show changes - chain', function(done){
            relax
                .changes()
                .end(function(err, res){
                    (err == null).should.be.true;
                    JSON.parse(res.text).results.should.be.ok;
                    done();
                })
        });
        it('should show changes - callback', function(done){
            relax.changes(function(err, res){
                (err == null).should.be.true;
                res.results.should.be.ok;
                done();
            })
        });
        it('should show database info - chain', function(done){
            relax
                .info()
                .end(function(err, res){
                    (err == null).should.be.true;
                    JSON.parse(res.text).db_name.should.equal('relax-specs');
                    done();
                })
        });
        it('should show database info - callback', function(done){
            relax.info(function(err, res){
                (err == null).should.be.true;
                res.db_name.should.equal('relax-specs');
                done();
            })
        });

        it('should create new db - chain', function(done){
            name = 'some-name';
            admin
                .create(name)
                .end(function(err, res){
                    (err == null).should.be.true;
                    res.ok.should.be.true;
                    done();
                })
        });
        it('should not create existing db - chain', function(done){
            name = 'some-name';
            admin.create(name)
                .end(function(err, res){
                    (err == null).should.be.true;
                    JSON.parse(res.text).error.should.equal('file_exists');
                    done();
                })
        });
        it('should drop new db - chain', function(done){
            admin
                .drop(name)
                .end(function(err, res){
                    (err == null).should.be.true;
                    res.ok.should.be.true;
                    done();
                })
        });
        it('should not drop non-existing db - chain', function(done){
            admin
                .drop(name)
                .end(function(err, res){
                    (err == null).should.be.true;
                    JSON.parse(res.text).error.should.equal('not_found');
                    done();
                })
        });
        it('should create new db - callback', function(done){
            name = 'some-name';
            admin.create(name, function(err, res){
                (err == null).should.be.true;
                res.should.be.true;
                done();
            })
        });
        it('should not create existing db - callback', function(done){
            name = 'some-name';
            admin.create(name, function(err, res){
                (err == null).should.be.true;
                res.error.should.equal('file_exists');
                done();
            })
        });
        it('should drop new db - callback', function(done){
            admin.drop(name, function(err, res){
                (err == null).should.be.true;
                res.should.be.true;
                done();
            })
        });
        it('should not drop non-existing db - callback', function(done){
            admin.drop(name, function(err, res){
                (err == null).should.be.true;
                res.error.should.equal('not_found');
                done();
            })
        });


        // it('should get uuids with count - chain', function(done){
        //     relax.uuids(5)
        //         .end(function(err, res){
        //             (err == null).should.be.true;
        //             JSON.parse(res.text).uuids.length.should.equal(5);
        //             done();
        //         })
        // });
    });


})


function log () { console.log.apply(console, arguments) }
