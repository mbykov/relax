//var Emitter = require('..');

var request = require('superagent');
var Relax = require('../');
var relax = new Relax();

// //relax.set({ 'API-Key': 'foobar', Accept: 'application/json' });

// //relax();
// relax.database(function() {
//     log('CB');
// });

// var request = require('..');

log('R', relax.jumps)

var url = 'https://gist.github.com/visionmedia/9fff5b23c1bf1791c349/raw/3e588e0c4f762f15538cdaf9882df06b3f5b3db6/works.js';

// request.get(url, function(err, res){
//     if (err) throw err;
//     log('RES', res.text);
// });

relax.get(url, function(err, res){
    if (err) throw err;
    log('RES', res.text);
});


// describe('Relax', function(){
//     describe('lalala', function(){
//         it('should be true', function(){
//             true.should.be.true;

//         })
//     })
// })

function log () { console.log.apply(console, arguments) }
