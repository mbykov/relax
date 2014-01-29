var url = require('url');
var isArray = require('isarray');
var map = require('map-component'); // FIXME: try etc
var request = require('superagent');

module.exports = Relax;

/**
 * Initialize `Relax`
 */

function Relax(uri) {
    //if (!(this instanceof Relax)) return new Relax(uri);
    var defaults = url.parse('http://localhost:5984');
    //log(defaults)
    uri = uri || '';
    var opts = url.parse(uri)
    this.opts = merge(defaults, opts);
    return this;
}

/*
 * Setters
*/

Relax.prototype.dbname = function(uri) {
    var opts = url.parse(uri);
    this.opts = merge(this.opts, opts);
    return this;
};

/*
 * DB-level methods
*/

Relax.prototype.exists = function(name, cb) {
    var path = this.opts.href + name;
    request.head(path, function(res){cb(res.ok)});
};

Relax.prototype.create = function(name, cb) {
    var path = this.opts.href + name;
    request.put(path, function(res){
        (res.ok) ? cb(null, res.ok) : cb(res.text.trim(), null);
    });
};

Relax.prototype.drop = function(name, cb) {
    var path = this.opts.server+'/'+name;
    request.del(path, function(res){
        (res.ok) ? cb(null, res.ok) : cb(res.text.trim(), null);
    });
};

/*
 * DB-level methods

 .query(id)
 .end(function(res){
   (res.ok) ? cb(null, res.ok) : cb(res.text.trim(), null);
 });
 */

function getDoc(path, cb) {
    request
        .get(path)
        .query({include_docs: true})
        .end(function(res) { cb(res) });
}

Relax.prototype.get = function(doc, cb) {
    if (isArray(doc)) {
        var url = this.opts.url + '/_all_docs';
        if (!cb) return request.post(url);
        allDocs(url, doc, cb);
        return;
    }
    var docid = (doc.constructor == Object) ? doc._id : doc;
    var path = (this.opts.tmp || this.opts.url) + '/' + docid;
    this.opts.tmp = null;
    if (!cb) return request.get(path);
    getDoc(path, function(res) {
        var json = JSON.parse(res.text.trim());
        (res.ok) ? cb(null, json) : cb(json, null);
    });
}

function allDocs(url, docs, cb) {
    var keys = {keys: map(docs, function(doc) { return doc._id})};
    postDoc(url, keys, function(res){
        var json = JSON.parse(res.text.trim());
        (res.ok) ? cb(null, json) : cb(json, null);
    });
}

function postDoc(host, doc, cb) {
    request
        .post(host)
        .send(doc)
        .end(function(res) { cb(res) });
}

Relax.prototype.push = function(doc, cb) {
    if (isArray(doc)) {
        var docs = doc;
        var alldocs = this.opts.url + '/_all_docs';
        var bulkdocs = this.opts.url + '/_bulk_docs';
        allDocs(alldocs, docs, function(err, res) {
            var rows = res.rows;
            for (var i = 0; i < docs.length; i++) {
                var rev = rows[i];
                //log('REV', rev.value)
                if (rev.value) docs[i]._rev = rows[i].value.rev;
                docs[i].kuku = true;
            }
            if (!cb) return request.post(bulkdocs);
            bulkSave(bulkdocs, docs, cb);
        });
        return;
    }
    var host = this.opts.href;
    getDoc(host + '/' + doc._id, function(res) {
        if (res.ok) {
            var dbdoc = JSON.parse(res.text);
            doc._rev = dbdoc._rev;
        }
        postDoc(host, doc, function(res) {
            var json = JSON.parse(res.text.trim());
            (res.ok) ? cb(null, json) : cb(json, null);
        });
    })
};

function bulkSave(url, docs, cb) {
    postDoc(url, {docs: docs}, function(res){
        var json = JSON.parse(res.text.trim());
        (res.ok) ? cb(null, json) : cb(json, null);
    });
}

Relax.prototype.bulkSave_ = function(docs, cb) {
    // TODO: если нет docs
    // полный ли аналог update? Сделать тест
    var path = this.opts.url + '/_bulk_docs';
    docs = {docs: docs};
    if (!cb) return request.post(path);
    postDoc(path, docs, function(res){
        var json = JSON.parse(res.text.trim());
        (res.ok) ? cb(null, json) : cb(json, null);
    });
}

Relax.prototype.del = function(doc, cb) {
    var host = this.opts.href;
    getDoc(host + '/' + doc._id, function(res) {
        if (res.ok) {
            var dbdoc = JSON.parse(res.text);
            doc._rev = dbdoc._rev;
            doc._deleted = true;
            postDoc(host, doc, function(res) {
                var json = JSON.parse(res.text.trim());
                (res.ok) ? cb(null, json) : cb(json, null);
            });
        } else {
            cb(null, JSON.parse(res.text))
        }
    });
};

Relax.prototype.view = function(method, cb) {
    if (cb) return cb(false);
    var host = (this.opts.tmp || this.opts.url);
    this.opts.tmp = null;
    var parts = method.split('/');
    var path = host + '/_design/' + parts[0] + '/_view/' + parts[1];
    return request.get(path).query({include_docs:true}).query({limit:5});
};

Relax.prototype.show = function(method) {
    var url = this.opts.url;
    var parts = method.split('/');
    var path = url + '/_design/' + parts[0] + '/_show/' + parts[1];
    this.opts.tmp = path;
    return this;
};

Relax.prototype.list = function(method) {
    var parts = method.split('/');
    var path = this.opts.url + '/_design/' + parts[0] + '/_list/' + parts[1];
    this.opts.tmp = path;
    return this;
};

Relax.prototype.update = function(method, doc, cb) {
    // FIXME:
    if (cb) return cb(false);
    var docid = (doc && doc.constructor == Object) ? doc._id : doc;
    var parts = method.split('/');
    var path = this.opts.url + '/_design/' + parts[0] + '/_update/' + parts[1];
    return (doc && docid) ? request.put(path + '/' + docid) : request.post(path);
};

function docs(res) {
    // FIXME - res.text - тут же уже json!
    return map(JSON.parse(res.text).rows, function(row) {return row.doc});
}

Relax.prototype.fdocs = function(res) {
    if (!res.ok) return false;
    return map(JSON.parse(res.text).rows, function(row) {return row.doc});
};


Relax.prototype.getall = function(doc, cb) {
    var path = this.opts.href + '/_all_docs';
    request
        .get(path)
        .query({include_docs: true})
        .end( function(res){
            //log('DOC', res);
            (res.ok) ? cb(null, docs(res)) : cb(res.text.trim(), null);
        });
};

/*
 * Server-level methods
 //if (!this.opts.dbname)  throw new Error('Origin is not allowed by Access-Control-Allow-Origin');
 */



Relax.prototype.allDbs = function(cb) {
    var path = url.parse('http://localhost:5984/_all_dbs');
    //request.get(path, cb);
    request.get(path, function(res){cb(res.text)});
};

Relax.prototype.config = function(cb) {
    var path = url.parse('http://localhost:5984/_config');
    request.get(path, function(res){cb(res.text)});
};

Relax.prototype.info = function(cb) {
    var path = url.parse('http://localhost:5984/');
    request.get(path, function(res){cb(res.text)});
};

Relax.prototype.stats = function(cb) {
    var path = url.parse('http://localhost:5984/_stats');
    request.get(path, function(res){cb(res.text)});
};

Relax.prototype.activeTasks = function(cb) {
    var path = url.parse('http://localhost:5984/_active_tasks');
    request.get(path, function(res){cb(res.text)});
};

Relax.prototype.uuids = function(count, cb) {
    if (typeof count === 'function') callback = count, count = null;
    // FIXME: query - см cradle
    var path = url.parse('http://localhost:5984/_uuids');
    request.get(path, function(res){cb(res.text)});
};

function merge(a, b) {
    var keys = Object.keys(b);
    keys.forEach(function(key) {
        a[key] = b[key] || a[key];
    })
    //a.auth = b.auth;
    a.dbname = a.pathname.replace(/^\//,'');
    var auth = (a.auth) ? a.auth+'@' : '';
    a.href = a.protocol+'//'+auth+a.host+'/'+a.dbname; // FIXME: убрать
    a.server = a.protocol+'//'+auth+a.host;
    a.url = a.server+'/'+a.dbname;
    return a;
};

function log () { console.log.apply(console, arguments) }

/*

  Relax.prototype.allDocs_ = function(docs, cb) {
  var path = this.opts.url + '/_all_docs';
  if (!cb) return request.post(path);
  var keys = {keys: map(docs, function(doc) { return doc._id})};
  postDoc(path, keys, function(res){
  var json = JSON.parse(res.text.trim());
  (res.ok) ? cb(null, json) : cb(json, null);
  });
  }




  Relax.prototype.get_ = function(doc, cb) {
  var path = this.opts.href + '/' + doc._id;
  request
  .get(path)
  .query({include_docs: true})
  .end( function(res){
  //log('DOC', res);
  (res.ok) ? cb(null, JSON.parse(res.text)) : cb(res.text.trim(), null);
  });
  };


  Relax.prototype.push_ = function(doc, cb) {
  var db_path = this.opts.href;
  var doc_path = db_path + '/' + doc._id;
  request
  .get(doc_path)
  .query({include_docs: true})
  .end( function(res) {
  if (res.ok) {
  var dbdoc = JSON.parse(res.text);
  doc._rev = dbdoc._rev;
  //log('REV', doc);
  request
  .post(db_path)
  .send(doc)
  .end(function(res) {
  (res.ok) ? cb(null, JSON.parse(res.text)) : cb(res.text.trim(), null);
  }) ;
  } else {
  var path = this.opts.href;
  // request.post(path, function(res) {
  //     (res.ok) ? cb(null, res.ok) : cb(res.text.trim(), null);
  // }) ;
  }
  });
  };



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
