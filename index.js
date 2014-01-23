// var type = require('type');
// var query = require('querystring');
var url = require('url');
//var opts = require('opts');
// var noop = function() {};
var request = require('superagent');

module.exports = Relax;

/**
 * Initialize `Relax`
 */


/*
   TODO: Relax.obj:
   сеттеры:   .dbname, .host, .port, .schema
   server: .allDbs, .info, .compact, .viewCleanUp, .replicate, .uuids, .config
   auth:
   db: .exists, .create, .drop, .info, .compact, .viewCleanUp, .replicate

   TODO: SA.obj:
   doc: .get, .push, .copy, .delete
   docs: .view, .show, .list, .update

   docs: .allDocs, .bulkSave, .bulkRemove
   ddocs: .allDesignDocs

   0. опять, в каком случае можно вызвать методы SA?
     то есть dbname возвращает уже SA.get объект. Все возвращает SA.obj, кроме специализированных методов.
   1. разобрать URL.
   2. cradle-responce.js много полезного
   3.
*/

function Relax() {
    if (!(this instanceof Relax)) return new Relax();
    var defaults = url.parse('http://localhost:5984');
    this.opts = merge({}, defaults);
    //log('O', this.opts)
    return this;
}

// Database.prototype.exists = function (callback) {
//     this.query({ method: 'HEAD' }, function (err, res, status) {
//         if (err) {
//             callback(err);
//         } else {
//             if (status < 200 || status > 300) {
//                 callback(null, false);
//             } else {
//                 callback(null, true);
//             }
//         }
//     });
// };

Relax.prototype.exists = function(name, cb){
    var path = this.opts.href + name;
    request.head(path, function(res){cb(res.ok)});
};

Relax.prototype.create = function(name){
    if (!this.opts.dbname)  throw new Error('Origin is not allowed by Access-Control-Allow-Origin');

    request.get(path, function(res){cb(res.text)});
};

Relax.prototype.allDbs = function(cb){
    var path = url.parse('http://localhost:5984/_all_dbs');
    //request.get(path, cb);
    request.get(path, function(res){cb(res.text)});
};

Relax.prototype.config = function(cb){
    var path = url.parse('http://localhost:5984/_config');
    request.get(path, function(res){cb(res.text)});
};

Relax.prototype.info = function(cb){
    var path = url.parse('http://localhost:5984/');
    request.get(path, function(res){cb(res.text)});
};

Relax.prototype.stats = function(cb){
    var path = url.parse('http://localhost:5984/_stats');
    request.get(path, function(res){cb(res.text)});
};

Relax.prototype.activeTasks = function(cb){
    var path = url.parse('http://localhost:5984/_active_tasks');
    request.get(path, function(res){cb(res.text)});
};

Relax.prototype.uuids = function(count, cb){
    if (typeof count === 'function') callback = count, count = null;
    // FIXME: query - см cradle
    var path = url.parse('http://localhost:5984/_uuids');
    request.get(path, function(res){cb(res.text)});
};

Relax.prototype.dbname = function(uri){
    var opts = url.parse(uri);
    this.opts = merge(this.opts, opts);
    return request.get(this.opts.href);
};


function merge(a, b) {
    var keys = Object.keys(b);
    keys.forEach(function(key) {
        a[key] = b[key] || a[key];
    })
    a.dbname = a.pathname.replace(/^\//,'');
    a.href = a.protocol+'//'+a.host+'/'+a.dbname;
    return a;
};


function log () { console.log.apply(console, arguments) }

/*

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

  slashes: true,
  auth: null,
  host: 'localhost:5984',
  port: '5984',
  hostname: 'localhost',
  hash: null,
  search: null,
  query: null,
  pathname: '/latin',
  path: '/latin',
  href: 'http://localhost:5984/latin' }

  hash: ""
  host: "example.com:3000"
  port: 3000,
  hostname: "example.com"
  href: "http://example.com:3000/store/shoes?sort=desc"
  pathname: "/store/shoes"
  protocol: "http:"
  query: "sort=desc"
  search: "?sort=desc"


Relax.prototype.end_ = function(cb){
    var path = url.parse('http://localhost:5984/greek');
    request.get(path, cb);
};

Relax.prototype.ddoc = function(name){
    this.view = name;
    return this;
};


cradle.Connection.prototype._url = function (path) {
    var url = (this.protocol || 'http') + '://' + this.host;
    if (this.port !== 443 && this.port !== 80) {
        url += ':' + this.port;
    }

    url += path[0] === '/' ? path : ('/' + path);
    return url;
}

function buildUrl () {
    var opts = this.reqOpts
    opts.path
        .join('/')
        .split('/')
        .filter(function (part) {
            return !!!part.trim.length;
        });

    var path = (opts.path.length === 1 && opts.path[0] == '/')
        ? ''
        : opts.path.join('/');

    return opts.base + '/' + path;
}
*/
