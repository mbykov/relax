var url = require('url');
var isArray = require('isarray');
//var map = require('map-component');
var request = require('superagent');

try {
    var map = require('map-component');
} catch (err) {
    var map = require('map');
}

var type = require('type');

module.exports = Relax;

/**
 * Initialize `Relax`
 */

function Relax(uri) {
    //if (!(this instanceof Relax)) return new Relax(uri);
    var defaults = url.parse('http://localhost:5984');
    uri = uri || '';
    var opts = url.parse(uri)
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
    request.put(path, function(res){
        (res.ok) ? cb(null, res.ok) : cb(res.text.trim(), null);
    });
};

Relax.prototype.purge = function(name, cb) {
    var path = this.opts.server +'/' +name + '/_purge';
    log('PATH', path);
    request.post(path).type('application/json').end(function(res){cb(res.text)});
};

Relax.prototype.compact = function(name, cb) {
    var path = this.opts.server +'/' +name + '/_compact';
    log('PATH', path);
    request.post(path).type('application/json').end(function(res){cb(res.text)});
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
        .set('Accept', 'application/json')
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

function bulkSave_(path, docs, cb) {
    postDoc(path, {docs: docs}, function(res){
        var json = JSON.parse(res.text.trim());
        (res.ok) ? cb(null, json) : cb(json, null);
    });
}


/*
 * CRUD methods for doc or docs array
*/

Relax.prototype.get = function(doc, cb) {
    // if ('Array' === type(doc)) {
    //     var path = this.opts.dbpath + '/_all_docs';
    //     if (!cb) return request.post(path).send({docs: doc});
    //     allDocs(path, doc, cb);
    //     return;
    // }
    var id = docid(doc);
    var mess = 'can not get - doc has no id';
    if (!id) (cb) ? cb(mess, null) : new Error(mess);
    var path = (this.opts.tmp || this.opts.dbpath) + '/' + docid(doc);
    this.opts.tmp = null;
    var req = request.get(path); //.query({include_docs: true});
    if (!cb) return req;
    req.end(function(err, res) {
        var json = JSON.parse(res.text.trim());
        (res.ok) ? cb(null, json) : cb(json, null);
    });
}

Relax.prototype.put = function(doc, cb) {
    var id = docid(doc);
    var mess = 'can not put - doc has no id';
    if (!id) (cb) ? cb(mess, null) : new Error(mess);
    var path = (this.opts.tmp || this.opts.dbpath) + '/' + id;
    this.opts.tmp = null;
    var req = request.put(path).send(doc);
    if (!cb) return req;
    req.end(function(err, res) {
        var json = JSON.parse(res.text.trim());
        (res.ok) ? cb(null, json) : cb(json, null);
    });
};

Relax.prototype.post = function(doc, cb) {
    var path = (this.opts.tmp || this.opts.dbpath);
    this.opts.tmp = null;
    var req = request.post(path).send(doc);
    if (!cb) return req;
    req.end(function(err, res) {
        var json = JSON.parse(res.text.trim());
        (res.ok) ? cb(null, json) : cb(json, null);
    });
};

Relax.prototype.bulk = function(doc, cb) {
    var mess = 'docs isnt array';
    if ('array' != type(doc)) return (cb) ? cb(mess) : new Error(mess);
    var bulkpath = this.opts.dbpath + '/_bulk_docs';
    var req = request.post(bulkpath).send({docs: doc});
    if (!cb) return req;
    req.end(function(err, res) {
        (err) ? cb(null, res) : cb(err, null);
    });
};

Relax.prototype.view = function(method, cb) {
    var mess = 'no db name';
    if (!this.opts.dbname) return (cb) ? cb(mess, null) : new Error(mess);
    var parts = method.split('/');
    if (this.opts.tmp) {
        var path = this.opts.tmp + '/' + parts[1];
        log('TMP'); // FIXME: другое view - match? ==== тестировать =====
        this.opts.tmp = null;
    } else {
        var path = this.opts.dbpath + '/_design/' + parts[0] + '/_view/' + parts[1];
    }
    var req = request.get(path).query({limit:10}); // .query({include_docs:true})
    if (!cb) return req;
    req.end(function(err, res) {
        var text = res.text.trim();
        try {
            var obj = JSON.parse(text);
        } catch (err) {
            var obj = text; // _list only case
        }
        (err) ? cb(text, null) : cb(null, obj);
    });
};

Relax.prototype.push = function(doc, cb) {
    if (isArray(doc)) {
        var docs = doc;
        var alldocs = this.opts.dbpath + '/_all_docs';
        var bulkdocs = this.opts.dbpath + '/_bulk_docs';

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
    var dbpath = this.opts.dbpath;
    var path = this.opts.dbpath + '/' + doc._id;
    getDoc(path, function(res) {
        if (res.ok) {
            var dbdoc = JSON.parse(res.text);
            doc._rev = dbdoc._rev;
        }
        postDoc(dbpath, doc, function(res) {
            var json = JSON.parse(res.text.trim());
            (res.ok) ? cb(null, json) : cb(json, null);
        });
    })
};

Relax.prototype.del = function(doc, cb) {
    // if(!validate(doc)) {
    //     cb('not valid doc', null);
    //     return;
    // }
    var path = this.opts.dbpath + '/' + docid(doc);
    var req = request.del(path).query({rev: docrev(doc)})
    if (!cb) return req;
    req.end(function(res) {
        var json = JSON.parse(res.text.trim());
        (res.ok) ? cb(null, json) : cb(json, null);
    });
}

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

Relax.prototype.update = function(method, cb) {
    var parts = method.split('/');
    var path = this.opts.dbpath + '/_design/' + parts[0] + '/_update/' + parts[1];
    this.opts.tmp = path;
    return this;
};

Relax.prototype.update_ = function(method, doc, cb) {
    // FIXME: что?
    if (cb) return cb(false);
    var id = docid(doc);
    var parts = method.split('/');
    var path = this.opts.dbpath + '/_design/' + parts[0] + '/_update/' + parts[1];
    return (doc && id) ? request.put(path + '/' + id) : request.post(path);
};

Relax.prototype.getall = function(doc, cb) {
    // FIXME: all?
    var path = this.opts.server + '/_all_docs';
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

// FIXME - нужны проверки?
// var mess = 'no server name';
// if (!this.opts.server) (cb) ? cb(mess) : new Error(mess);

Relax.prototype.allDbs = function(cb) {
    var path = [this.opts.server, '_all_dbs'].join('/');
    var req = request.get(path);
    if (!cb) return req;
    req.end(function(err, res) {
        (res.ok) ? cb(null, res) : cb(err, null);
    });
};

Relax.prototype.stats = function(cb) {
    var path = [this.opts.server, '_stats'].join('/');
    var req = request.get(path);
    if (!cb) return req;
    req.end(function(err, res) {
        (res.ok) ? cb(null, JSON.parse(res.text)) : cb(err, null);
    });
};

Relax.prototype.config = function(section, key, cb) {
    if (!cb) cb = key, key = null;
    var path = [this.opts.server, '_config', section, key].join('/');
    var req = request.get(path);
    if (!cb) return req;
    req.end(function(err, res) {
        (res.ok) ? cb(null, JSON.parse(res.text)) : cb(err, null);
    });
};




Relax.prototype.info = function(cb) {
    var path = url.parse('http://localhost:5984/');
    request.get(path, function(res){cb(res.text)});
};

Relax.prototype.activeTasks = function(cb) {
    var path = url.parse('http://localhost:5984/_active_tasks');
    request.get(path, function(res){cb(res.text)});
};

Relax.prototype.uuids = function(count, cb) {
    if (type(count) === 'function') cb = count, count = 1;
    var path = this.opts.server + '/_uuids';
    request
        .get(path)
        .query({count:count})
        .end(function(res){
            cb(JSON.parse(res.text).uuids);
        });
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

Relax.prototype.frows = function(res) {
    if (!res.ok) return false;
    return JSON.parse(res.text).rows;
};

Relax.prototype.fdocs = function(res) {
    if (!res.ok) return false;
    return map(JSON.parse(res.text).rows, function(row) {return row.doc});
};

/*
 * private common functions
 */

function fdocs(res) {
    return map(JSON.parse(res.text).rows, function(row) {return row.doc});
}

function merge(a, b) {
    var keys = Object.keys(b);
    keys.forEach(function(key) {
        a[key] = b[key] || a[key];
    })
    //a.auth = b.auth;
    //a.dbname = a.pathname.replace(/^\//,''); // FIXME: ========== попробовать с простым /dbname
    a.dbname = a.pathname.split('/')[0];
    var auth = (a.auth) ? a.auth+'@' : '';
    //a.href = a.protocol+'//'+auth+a.host+'/'+a.dbname; // FIXME: убрать
    a.server = a.protocol+'//'+auth+a.host;
    a.dbpath = a.server+'/'+a.dbname;
    return a;
};


function docid(doc) {
    var doctype = type(doc);
    if (doctype === 'string' || doctype === 'number') return doc;
    if (doctype === 'object') {
        if (type(doc._id)) return doc._id;
        if (type(doc.id)) return doc.id;
    }
    return null;
}

function docrev(doc) {
    var doctype = type(doc);
    if (doctype === 'string' || doctype === 'number') return doc;
    if (doctype === 'object') {
        if (type(doc._rev)) return doc._rev;
        if (type(doc.rev)) return doc.rev;
    }
    return null;
}

function validate(doc) {
    if (!docid(doc) || !docrev(doc) ) return false;
    return true;
}
// if (!id || !rev) {
//     if (fnCallback)
//         fnCallback(new Error(notvalid), null);
//     return self;
// }


function log () { console.log.apply(console, arguments) }

/*
*/
