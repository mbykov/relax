var url = require('url');
var isArray = require('isarray');
//var map = require('map-component');
var request = require('superagent');

try {
    var map = require('map-component');
} catch (err) {
    var map = require('map');
}

module.exports = Relax;

/**
 * Initialize `Relax`
 */

function Relax(uri) {
    //if (!(this instanceof Relax)) return new Relax(uri);
    var defaults = url.parse('http://localhost:5984');
    uri = uri || '';
    var opts = url.parse(uri)
    //log(opts);
    this.opts = merge(defaults, opts);
    return this;
}

/*
 * Setters
*/

Relax.prototype.dbname = function(name) {
    this.opts.dbname = name || '';
    this.opts.dbpath = this.opts.server+'/'+this.opts.dbname;
    return this;
};

/*
 * DB-level methods
*/

Relax.prototype.exists = function(name, cb) {
    var path = this.opts.server+'/' + name;
    request.head(path, function(res){cb(res.ok)});
};

Relax.prototype.create = function(name, cb) {
    var path = this.opts.server+'/' + name;
    log('CREATE', path);
    request.put(path, function(res){
        (res.ok) ? cb(null, res.ok) : cb(res.text.trim(), null);
    });
};

Relax.prototype.drop = function(name, cb) {
    var path = this.opts.server+'/'+name;
    log('DROP', path);
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

function allDocs(path, docs, cb) {
    var keys = {keys: map(docs, function(doc) { return (doc.constructor == Object) ? doc._id : doc})};
    postDoc(path, keys, function(res){
        var json = JSON.parse(res.text.trim());
        (res.ok) ? cb(null, json) : cb(json, null);
    });
}

function postDoc(path, doc, cb) {
    request
        .post(path)
        .query({include_docs: true})
        .send(doc)
        .end(function(res) {
            cb(res)
        });
}

function bulkSave(path, docs, cb) {
    postDoc(path, {docs: docs}, function(res){
        var json = JSON.parse(res.text.trim());
        (res.ok) ? cb(null, json) : cb(json, null);
    });
}

function fdocs(res) {
    return map(JSON.parse(res.text).rows, function(row) {return row.doc});
}

Relax.prototype.fdocs = function(res) {
    if (!res.ok) return false;
    return map(JSON.parse(res.text).rows, function(row) {return row.doc});
};

/*
 * CRUD methods for doc or docs array
*/

Relax.prototype.get = function(doc, cb) {
    if (isArray(doc)) {
        var path = this.opts.dbpath + '/_all_docs';
        log('\nGET', path)
        if (!cb) return request.post(path).send({docs: doc});
        allDocs(path, doc, cb);
        return;
    }
    var docid = (doc.constructor == Object) ? doc._id : doc;
    var path = (this.opts.tmp || this.opts.dbpath) + '/' + docid;
    this.opts.tmp = null;
    if (!cb) return request.get(path);
    getDoc(path, function(res) {
        var json = JSON.parse(res.text.trim());
        (res.ok) ? cb(null, json) : cb(json, null);
    });
}

Relax.prototype.push = function(doc, cb) {
    if (isArray(doc)) {
        var docs = doc;
        var alldocs = this.opts.dbpath + '/_all_docs';
        var bulkdocs = this.opts.dbpath + '/_bulk_docs';
        //if (!cb) return request.post(alldocs).send({docs: doc});
        // if (!cb) {
        //     return allDocs(alldocs, docs, function(err, res) {
        //         var rows = res.rows;
        //         for (var i = 0; i < docs.length; i++) {
        //             var rev = rows[i];
        //             if (rev.value) docs[i]._rev = rows[i].value.rev;
        //             docs[i]._deleted = false;
        //         }
        //         return request.post(alldocs).send({docs: doc});
        //     });
        // }

        allDocs(alldocs, docs, function(err, res) {
            var rows = res.rows;
            for (var i = 0; i < docs.length; i++) {
                var rev = rows[i];
                if (rev.value) docs[i]._rev = rows[i].value.rev;
                docs[i]._deleted = false;
            }
            //if (!cb) return request.post(alldocs).send({docs: doc}); // alas (((:
            bulkSave(bulkdocs, docs, cb);
        });
        return;
    }
    var path = this.opts.dbpath + '/' + doc._id;
    getDoc(path, function(res) {
        if (res.ok) {
            var dbdoc = JSON.parse(res.text);
            doc._rev = dbdoc._rev;
        }
        postDoc(this.opts.dbpath, doc, function(res) {
            log('PUSHURL', path);
            var json = JSON.parse(res.text.trim());
            (res.ok) ? cb(null, json) : cb(json, null);
        });
    })
};

Relax.prototype.del = function(doc, cb) {
    if (isArray(doc)) {
        var docs = doc;
        var alldocs = this.opts.dbpath + '/_all_docs';
        var bulkdocs = this.opts.dbpath + '/_bulk_docs';
        allDocs(alldocs, docs, function(err, res) {
            var rows = res.rows;
            for (var i = 0; i < docs.length; i++) {
                var rev = rows[i];
                if (rev.value) docs[i]._rev = rows[i].value.rev;
                docs[i]._deleted = true;
            }
            if (!cb) return request.post(bulkdocs);
            bulkSave(bulkdocs, docs, cb);
        });
        return;
    }
    var path = this.opts.dbpath + '/' + doc._id;
    getDoc(path, function(res) {
        if (res.ok) {
            var dbdoc = JSON.parse(res.text);
            doc._rev = dbdoc._rev;
            doc._deleted = true;
            postDoc(this.opts.dbpath, doc, function(res) {
                var json = JSON.parse(res.text.trim());
                (res.ok) ? cb(null, json) : cb(json, null);
            });
        } else {
            cb(null, JSON.parse(res.text))
        }
    });
};

Relax.prototype.view = function(method, cb) {
    var parts = method.split('/');
    if (this.opts.tmp) {
        var url = this.opts.tmp;
        var path = url + '/' + parts[1];
        this.opts.tmp = null;
    } else {
        var path = this.opts.dbpath + '/_design/' + parts[0] + '/_view/' + parts[1];
    }
    if (cb) {
        request.get(path).query({include_docs:true}).query({limit:5}).end(function(res) {
            (res.ok) ? cb(null, fdocs(res)) : cb(res.text.trim(), null);
        })
    }
    return request.get(path).query({include_docs:true}).query({limit:5});
};

Relax.prototype.show = function(method) {
    var parts = method.split('/');
    var path = this.opts.dbpath + '/_design/' + parts[0] + '/_show/' + parts[1];
    this.opts.tmp = path;
    return this;
};

Relax.prototype.list = function(method) {
    var parts = method.split('/');
    var path = this.opts.dbpath + '/_design/' + parts[0] + '/_list/' + parts[1];
    this.opts.tmp = path;
    return this;
};

Relax.prototype.update = function(method, doc, cb) {
    // FIXME: что?
    if (cb) return cb(false);
    var docid = (doc && doc.constructor == Object) ? doc._id : doc;
    var parts = method.split('/');
    var path = this.opts.dbpath + '/_design/' + parts[0] + '/_update/' + parts[1];
    return (doc && docid) ? request.put(path + '/' + docid) : request.post(path);
};

Relax.prototype.getall = function(doc, cb) {
    var path = this.opts.href + '/_all_docs';
    request
        .get(path)
        .query({include_docs: true})
        .end( function(res){
            (res.ok) ? cb(null, fdocs(res)) : cb(res.text.trim(), null);
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


/*
 * Authentication methods
 */

Relax.prototype.login = function(name, password, cb) {
    var path = this.opts.server + '/_session';
    request
        .post(path)
        .send({name: name, password: password})
        .end(function(res) {
            cb(res);
        });
};

Relax.prototype.logout = function(cb) {
    var path = this.opts.server + '/_session';
    request
        .del(path)
        .end(function(res) {
            cb(res);
        });
};

Relax.prototype.session = function(cb) {
    var path = this.opts.server + '/_session';
    request
        .get(path)
        .end(function(res) {
            cb(res);
        });
};

/*
 * private common functions
 */

function merge(a, b) {
    var keys = Object.keys(b);
    keys.forEach(function(key) {
        a[key] = b[key] || a[key];
    })
    //a.auth = b.auth;
    //a.dbname = a.pathname.replace(/^\//,''); // FIXME: ========== попробовать с простым /dbname
    a.dbname = a.pathname.split('/')[0];
    var auth = (a.auth) ? a.auth+'@' : '';
    a.href = a.protocol+'//'+auth+a.host+'/'+a.dbname; // FIXME: убрать
    a.server = a.protocol+'//'+auth+a.host;
    a.dbpath = a.server+'/'+a.dbname;
    return a;
};

function log () { console.log.apply(console, arguments) }

/*
*/
