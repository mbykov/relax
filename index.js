// var type = require('type');
// var query = require('querystring');
var url = require('url');
//var opts = require('opts');
//var _ = require('underscore');
// var request = require('superagent');
// var noop = function() {};

module.exports = relax;

console.log('KU zero');

/**
 * Initialize `Relax`
 */

function relax() {
    if (!(this instanceof relax)) return new relax();
    console.log('KU relax');
    this.opts = opts({port:5984, host: '127.0.0.1'});
    log('O', this.opts())
    return this;
}

// function Relax_(par) {
//     var opts = {};
//     var defaults = {protocol: 'http:', hostname: 'localhost', port: 5984};
//     if(type(par) === 'string') {
//         opts = _.compactObject(url.parse(par));
//         if (opts.port) opts.port = parseInt(opts.port);
//         opts.dbname = setSlash(opts.pathname);
//         opts = _.extend(defaults, opts);
//     } else if (type(par) === 'object') {
//         //opts = par;
//     } else opts = defaults;
//     _.extend(this, opts);
//     setUrl(this);
//     //console.log("\n==OPTS: " + JSON.stringify(opts));    // TODO: delete лишнее
//     return this;
// }

// setUrl = function(opts) {
//     var path;
//     path = opts.protocol + '//' + opts.hostname + ':' + opts.port;
//     if (opts.dbname) path += opts.dbname;
//     if (opts.ddocname) path += '/_design/' + opts.ddocname;
//     if (opts.viewname) path += '/_view/' + opts.viewname;
//     opts.url = path;
// };

// setSlash = function(str) {
//     if (!str || str === '/') return null;
//     return (str[0] === '/') ? str : ('/' + str);
// };

// Relax.prototype.database = function(name) {
//     name= (name[0] === '/') ? name : ('/' + name);
//     this.dbname = name;
//     setUrl(this);
//     return this;
// };

// Relax.prototype.create = function(fn) {
//     this.path = "http://admin:kjre4317@localhost:5984" + this.dbname;
//     //this.path = "http://localhost:5984" + this.dbname;
//     request
//         .put(this.path)
//         .end(function(res){
//             fn(res);
//         });
// };

// Relax.prototype.drop = function(fn) {
//     this.path = "http://admin:kjre4317@localhost:5984" + this.dbname;
//     //this.path = "http://localhost:5984" + this.dbname;
//     request
//         .del(this.path)
//         .end(function(res){
//             fn(res);
//         });
// };

// Relax.prototype.all_dbs = function(fn) {
//     this.path = "/_all_dbs";
//     console.log("ARRAY " + this.path);
//     request
//         .get('http://localhost:5984/_all_dbs')
//         .end(function(res){
//             fn(res);
//         });
// };


// // Relax.prototype.all_dbs = function(fn) {
// //     this.path = "/_all_dbs";
// //     console.log("ARRAY " + this.path);
// //     request
// //         .get(this.path)
// //         .end(function(res){
// //             fn(res);
// //         });
// // };

// function Relax_(par) {
//     var opts = {};
//     var defaults = {protocol: 'http:', hostname: 'localhost', port: 5984};
//     if(type(par) === 'string') {
//         opts = _.compactObject(url.parse(par));
//         parsePath(opts);
//         _.extend(opts, defaults, opts);
//     } else if (type(par) === 'object') {
//         //opts = par;
//         //opts.db= (opts.db[0] === '/') ? opts.db : ('/' + opts.db);
//     } else opts = defaults;
//     _.extend(this, opts); // defaults,
//     //setPath(this);
//     // TODO: delete лишнее
//     return this;
// }



// function inspect(object){
//     console.log("== inspect == " + object.toString());
//     var result = '';
//     for (var key in object){
//         result += key + ': ' + object[key] + '\n';
//     }
//     console.log(result);
//     //return result;
// }

// _.mixin({
//     compactObject : function(o) {
//         _.each(o, function(v, k){
//             if(!v)
//                 delete o[k];
//         });
//         return o;
//     }
// });

// // // delete:
// // // parse: [Function],
// // // format: [Function],
// // // resolve: [Function],
// // // resolveObject: [Function],
// // // parseHost: [Function] } to be falsey

function log () { console.log.apply(console, arguments) }

function opts(obj) {
    return (function (key, val) {
        switch (arguments.length) {
        case 0: return obj;
        case 1: return obj[key];
        case 2: obj[key] = val;
        }
    });
}
