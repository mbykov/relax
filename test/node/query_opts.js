//
var Relax = require('../../');
var _ = require('underscore');
var should = require('should');


describe('OPTS object', function(){
    describe('STRING', function(){
        it('should parse database name', function(done){
            r = new Relax('/spec');
            r.dbname.should.equal("/spec");
            r.hostname.should.equal("localhost");
            r.url.should.equal("http://localhost:5984/spec");
            done();
        })
        it('should redefine defaults', function(done){
            r = new Relax("http://www.ru:5984/spec");
            r.dbname.should.equal("/spec");
            r.hostname.should.equal("www.ru");
            r.port.should.equal(5984);
            r.url.should.equal("http://www.ru:5984/spec");
            done();
        })
        it('should redefine defaults w/o db', function(done){
            r = new Relax("http://www.ru:5984");
            r.url.should.equal("http://www.ru:5984");
            r = new Relax("http://www.ru:5984/");
            r.url.should.equal("http://www.ru:5984");
            should.not.exist(r.dbname);
            done();
        })
    })
    // describe('SET function', function(){
    //     it('should set database name', function(done){
    //         r = new Relax;
    //         r.set({dbname:'test'});
    //         r.dbname.should.equal("test");
    //         r.hostname.should.equal("localhost");
    //         done();
    //     })
    //     it('should parse pathname', function(done){
    //         r = new Relax;
    //         r.set({dbname:'test'});
    //         r.pathname.should.equal("http://localhost:5984/test");
    //         done();
    //     })
    // })
})

//

// it('should work with many parameters', function(done){
//     r = new Relax({port:4444, db:'test'});
//     r.port.should.equal(4444);
//     r.href.should.equal('http://localhost:4444/test');
//     done();
// })
// it('should work with fully qualified name', function(done){
//     r = new Relax('http://www.ru:5984/test');
//     r.href.should.equal('http://www.ru:5984/test');
//     done();
// })

// describe('lala', function(){
//     describe('lalala', function(){
//         it('should be true', function(done){
//             true.should.be.true;
//             done();
//         })
//     })
// })

function inspect(object){
    var result = '';
    for (var key in object){
        result += key + ': ' + object[key] + '\n';
    }
    console.log(result);
    //return result;
}

// beforeEach(function(){
//     this.r = new r();
// });

l = function(obj){
    console.log('log: ' + JSON.stringify(obj));
}
