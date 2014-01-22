// var type = require('type');
// var query = require('querystring');
var url = require('url');
//var opts = require('opts');
//var _ = require('underscore');
//var request = require('superagent');
// var noop = function() {};

module.exports = Relax;

/**
 * Initialize `Relax`
 */

function Relax() {
    if (!(this instanceof Relax)) return new Relax();
    // this.opts = opts({port:5984, host: '127.0.0.1', protocol: 'http:'});
    // log('O', this.opts())
    this.host = 'localhost';
    this.port = 5984;
    // request.dbname = this.dbname;
    // request.ddoc = this.ddoc;
    // //request.dbname = this.dbname.bind(this);
    // //request.dbname = request.get;
    // log('==O==', Object.keys(request))
    // // request.allDbs = allDbs;

    // // [dbname, allDbs, activeTasks, info].forEach(function(method) {
    // //     request[method.name] = method;
    // // })
    return this;
}

Relax.prototype.dbname = function(name){
    name = (name[0] === '/') ? name : ('/' + name);
    var path = url.parse('http://localhost:5984/' + name);
    this.path = path;
    return this;
};

Relax.prototype.ddoc = function(name){
    this.view = name;
    return this;
};

Relax.prototype.end = function(cb){
    var request = require('superagent');
    var path = url.parse('http://localhost:5984/greek');
    request.get(path, cb);
};


function allDbs() {
    var path = url.parse('http://localhost:5984/_all_dbs');
    // FIXME: тут нужен .end ?
    return request.get(path);
}

function activeTasks() {
    var path = url.parse('http://localhost:5984/_active_tasks');
    return request.get(path);
}

function info_ok(cb) {
    var path = url.parse('http://localhost:5984/latin');
    return request.get(path).end(cb);
};

function info(cb) {
    //var path = url.parse('http://localhost:5984/latin');
    return request.get(request.path, cb); //.end(cb);
};

function getVersion() {
    request
}

/*

   блестяще. Теперь - err, view, err,
   методы DB, вообще - копировать jq.couch по шагам


теперь я хочу написать prototype, чтобы прописался параметр ._dbname, и 2) err если такой нет */

// Relax.prototype.database = function(cb) {
//     request
//         .get('/search')
//         .set('API-Key', 'foobar')
//         .set('Accept', 'application/json')
//         .end(cb);
// };

/*
  сформировать opts.base & opts.path - прочитать url, querystring, etc - или где в SA хранятся параметры?
  и добавить к SA новые методы .db, .view, что там еще, т.е.
  relax.get()
  relax
     .db('latin')
     .ddoc('mydoc')
     .view('myview')
     .end(cb)
*/

//Package.prototype.__proto__ = Emitter.prototype;



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

// почему-то не могу получить модуль opts
function opts(obj) {
    return (function (key, val) {
        switch (arguments.length) {
        case 0: return obj;
        case 1: return obj[key];
        case 2: obj[key] = val;
        }
    });
}

//inherit(relax, request);
function inherit(a, b){
    var fn = function(){};
    fn.prototype = b.prototype;
    a.prototype = new fn;
    a.prototype.constructor = a;
};
