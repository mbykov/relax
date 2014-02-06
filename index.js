var url = require('url');
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
    var req = request.head(path);
    if (!cb) return req;
    req.end(function(err, res) {
        (res.ok) ? cb(null, res.ok) : cb(null, res.ok);
    });
};

Relax.prototype.create = function(name, cb) {
    var path = this.opts.server+'/' + name;
    var req = request.put(path);
    if (!cb) return req;
    req.end(function(err, res) {
        (res.ok) ? cb(null, res.ok) : cb(null, JSON.parse(res.text.trim()) );
    });
};

Relax.prototype.drop = function(name, cb) {
    var path = this.opts.server+'/'+name;
    var req = request.del(path);
    if (!cb) return req;
    req.end(function(err, res) {
        (res.ok) ? cb(null, res.ok) : cb(null, JSON.parse(res.text.trim()) );
    });
};

Relax.prototype.changes = function(cb) {
    var path = this.opts.dbpath+'/_changes';
    var req = request.get(path);
    if (!cb) return req;
    req.end(function(err, res) {
        (res.ok) ? cb(null, JSON.parse(res.text.trim())) : cb(null, JSON.parse(res.text.trim()) );
    });
};

Relax.prototype.info = function(cb) {
    var path = this.opts.dbpath+'/';
    var req = request.get(path);
    if (!cb) return req;
    req.end(function(err, res) {
        (res.ok) ? cb(null, JSON.parse(res.text.trim())) : cb(null, JSON.parse(res.text.trim()) );
    });
};

/*
 * CRUD methods for doc or docs array
*/

Relax.prototype.get = function(doc, cb) {
    var id = docid(doc);
    var mess = 'can not get - doc has no id';
    if (!id) (cb) ? cb(mess, null) : new Error(mess);

    var path = (this.opts.tmp || this.opts.dbpath) + '/' + docid(doc);
    this.opts.tmp = null;
    var req = request.get(path); //.query({include_docs: true});
    if (!cb) return req;
    req.end(function(err, res) {
        var json = JSON.parse(res.text.trim());
        (res.ok) ? cb(null, json) : cb(null, json);
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
        (res.ok) ? cb(null, json) : cb(null, json);
    });
};

Relax.prototype.post = function(doc, cb) {
    var path = (this.opts.tmp || this.opts.dbpath);
    this.opts.tmp = null;
    var req = request.post(path).send(doc);
    if (!cb) return req;
    req.end(function(err, res) {
        var json = JSON.parse(res.text.trim());
        (res.ok) ? cb(null, json) : cb(null, json);
    });
};

Relax.prototype.bulk = function(doc, cb) {
    var mess = 'docs isnt array';
    if ('array' != type(doc)) return (cb) ? cb(mess) : new Error(mess);
    var path = this.opts.dbpath + '/_bulk_docs';
    var req = request.post(path).send({docs: doc});
    if (!cb) return req;
    req.end(function(err, res) {
        var json = JSON.parse(res.text.trim());
        //log(err, res.text);
        (err) ? cb(null, json) : cb(null, json);
    });
};

Relax.prototype.all = function(doc, cb) {
    var mess = 'docs isnt array';
    if ('array' != type(doc)) return (cb) ? cb(mess) : new Error(mess);
    var path = this.opts.dbpath + '/_all_docs';
    var req = request.get(path);
    if (!cb) return req;
    req.end(function(err, res) {
        var json = JSON.parse(res.text.trim());
        (err) ? cb(null, json) : cb(null, json);
    });
};

Relax.prototype.del = function(doc, cb) {
    var path = this.opts.dbpath + '/' + docid(doc);
    var req = request.del(path).query({rev: docrev(doc)})
    if (!cb) return req;
    req.end(function(res) {
        var json = JSON.parse(res.text.trim());
        (res.ok) ? cb(null, json) : cb(null, json);
    });
}

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

// Relax.prototype.push = function(doc, cb) {
//     var dbpath = this.opts.dbpath;
//     var path = this.opts.dbpath + '/' + doc._id;
//     request.get(path, function( err, res) {
//         if (!res.ok) return cb(err);
//         var dbdoc = JSON.parse(res.text);
//         doc._rev = dbdoc._rev;
//         request.put(path, function( err, res) {
//             var json = JSON.parse(res.text.trim());
//             (res.ok) ? cb(null, json) : cb(null, json);
//         })
//     }
// };

/*
 * design document handlers
 *
 */

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

/*
 * Server-level methods
 *
 */

Relax.prototype.uuids = function(count, cb) {
    if (type(count) === 'function') cb = count, count = 1;
    var path = this.opts.server + '/_uuids';
    var req = request.get(path).query({count:count})
    if (!cb) return req;
    req.end(function(err, res){
        (res.ok) ? cb(null, JSON.parse(res.text).uuids) : cb(err, null);
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

Relax.prototype.signup = function(cb) {
    // FIXME:
    // var path = this.opts.server + '/_session';
    // request
    //     .get(path)
    //     .end(function(res) {
    //         cb(res);
    //     });
};

/*
 * helpers
 */

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
    a.dbname = a.pathname.split('/')[0];
    var auth = (a.auth) ? a.auth+'@' : '';
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

function log () { console.log.apply(console, arguments) }
