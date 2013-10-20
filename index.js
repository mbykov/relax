// в cradle есть метод connection, кажется, лишний?
// нужно парсить строки urs, opts, как в крадле
// вопрос - нужно ли добавить сразу db в опции? - это как пользователю удобнее
// вопрос - нужно ли добавить вместо опций, и перед ними, url

var type = require('type');
var query = require('querystring');
var url = require('url');
var _ = require('underscore');
var request = require('superagent');
var noop = function() {};

module.exports = Relax;

/**
 * Initialize `Relax`
 */

function Relax_() {
    return this;
}
function Relax(par) {
    var opts = {};
    var defaults = {protocol: 'http:', hostname: 'localhost', port: 5984};
    if(type(par) === 'string') {
        opts = _.compactObject(url.parse(par));
        if (opts.port) opts.port = parseInt(opts.port);
        opts.dbname = setSlash(opts.pathname);
        opts = _.extend(defaults, opts);
    } else if (type(par) === 'object') {
        //opts = par;
    } else opts = defaults;
    _.extend(this, opts);
    setUrl(this);
    //console.log("\n==OPTS: " + JSON.stringify(opts));    // TODO: delete лишнее
    return this;
}

setUrl = function(opts) {
    var path;
    path = opts.protocol + '//' + opts.hostname + ':' + opts.port;
    if (opts.dbname) path += opts.dbname;
    if (opts.ddocname) path += '/_design/' + opts.ddocname;
    if (opts.viewname) path += '/_view/' + opts.viewname;
    opts.url = path;
};

setSlash = function(str) {
    if (!str || str === '/') return null;
    return (str[0] === '/') ? str : ('/' + str);
};

Relax.prototype.database = function(name) {
    name= (name[0] === '/') ? name : ('/' + name);
    this.dbname = name;
    setUrl(this);
    return this;
};

Relax.prototype.create = function(fn) {
    this.path = "http://admin:kjre4317@localhost:5984" + this.dbname;
    //this.path = "http://localhost:5984" + this.dbname;
    request
        .put(this.path)
        .end(function(res){
            fn(res);
        });
};
Relax.prototype.drop = function(fn) {
    this.path = "http://admin:kjre4317@localhost:5984" + this.dbname;
    //this.path = "http://localhost:5984" + this.dbname;
    request
        .del(this.path)
        .end(function(res){
            fn(res);
        });
};

Relax.prototype.all_dbs = function(fn) {
    this.path = "/_all_dbs";
    console.log("ARRAY " + this.path);
    request
        .get('http://localhost:5984/_all_dbs')
        .end(function(res){
            fn(res);
        });
};


// Relax.prototype.all_dbs = function(fn) {
//     this.path = "/_all_dbs";
//     console.log("ARRAY " + this.path);
//     request
//         .get(this.path)
//         .end(function(res){
//             fn(res);
//         });
// };

function Relax_(par) {
    var opts = {};
    var defaults = {protocol: 'http:', hostname: 'localhost', port: 5984};
    if(type(par) === 'string') {
        opts = _.compactObject(url.parse(par));
        parsePath(opts);
        _.extend(opts, defaults, opts);
    } else if (type(par) === 'object') {
        //opts = par;
        //opts.db= (opts.db[0] === '/') ? opts.db : ('/' + opts.db);
    } else opts = defaults;
    _.extend(this, opts); // defaults,
    //setPath(this);
    // TODO: delete лишнее
    return this;
}

// Relax.prototype.create = function() {
//     console.log("CREATE: " + this.dbname);
//     console.log("REQUEST: " + JSON.stringify(request));
//     request
//         .get(this.dbname)
//         .end(function(res){
//             //cb(res);
//             if (res.ok) {
//                 console.log('yay got ' + JSON.stringify(res.body));
//             } else {
//                 console.log('Oh no! error ' + res.text);
//             }
//         });
// };



// // это все устарело, следую jquery.couch
// Relax.prototype.set = function(obj) {
//     // setPath();
//     // тут нужно вычислить path. Но opts уже нет.
//     _.extend(this, obj);
//     setPath(this);
//     //console.log("opts: " + JSON.stringify(obj));
// };


//   //  /^\/(?:([^\/]+?))\/_design\/(?:([^\/]+?))\/_view\/(?:([^\/]+?))\/?$/i


// parsePath = function(opts) {
//     var path = opts.pathname;
//     var re = /^\/?(\w+)(\/_design\/)?(\w+)?((\/_view\/)?(\w+)|(\/_show\/)?(\w+))?\/?$/i
//     var matches = re.exec(path);
//     dbname = matches[1]; //path.match(re);
//     viewname = matches[6]; //path.match(re);
//     console.log("REG " + matches);
//     opts.dbname = matches[1];
//     opts.ddocname = matches[3];
//     opts.viewname = matches[6];
//     opts.showname = matches[8];
// };

// parsePath_ = function(opts) {
//     var parts = opts.pathname.split('/');
//     if (parts[1])opts.dbname = parts[1];
//     if (parts[2] === '_design') opts.ddocname = parts[3];
//     if (parts[4] === '_view') opts.viewname = parts[5];
// };

// validate = function(args) {
//     // args - по очереди проверить на существование
// };

// // Relax.prototype.get = function(fn) {
// //     console.log("url==: " +url);
// //     //inspect(request);
// //     request
// //         .get(url)
// //         .end(fn)
// //         // .end(function(res){
// //         //     console.log("first");
// //         // });
// //     return this;
// // };

// // Relax.prototype.db = function(name) {
// //     this.url += name[0] === '/' ? name : ('/' + name);
// //     return this;
// // };


function inspect(object){
    console.log("== inspect == " + object.toString());
    var result = '';
    for (var key in object){
        result += key + ': ' + object[key] + '\n';
    }
    console.log(result);
    //return result;
}

_.mixin({
    compactObject : function(o) {
        _.each(o, function(v, k){
            if(!v)
                delete o[k];
        });
        return o;
    }
});

// // delete:
// // parse: [Function],
// // format: [Function],
// // resolve: [Function],
// // resolveObject: [Function],
// // parseHost: [Function] } to be falsey
