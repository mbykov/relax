# Relax, superagent on a couch

Relax is a small  [component](http://github.com/component/component) and node.js module.

Relax is a high-level CouchDB client on a top of [superagent](http://github.com/visionmedia/superagent). It's goal is to help you write not so criminally-long http-requests in Couch style, leaving the rest of a heavy job to powerful superagent. It can be a lightweight replacement of a [jquery.couch.js](https://github.com/apache/couchdb/tree/master/share/www/script) and has almost the same methods. Except those that are easier and more reasonable to be used in the console. And it is is tiny ~ 10K.

## Usage

````javascript
var Relax = require('relax');
var relax = new Relax();
relax.dbname('relax-specs');
var admin = new Relax('http://admin:kjre4317@localhost:5984');
````

## Chainable or callback forms

Each method has chainable and callback-style api. Chainable form always returns [superagent](http://github.com/visionmedia/superagent)-response. While callback form returns what you are expect to be returned from CouchDB:

Chainable-form:

````javascript
relax
  .get(doc)
  .query({conflicts: true})
  .set('X-API-Key', 'foobar')
  .end(function(err, res){
    JSON.parse(res.text).text.should.equal('some text');
  })
````

Callback-form:

````javascript
relax.get(uuid, function(err, res){
  res.text.should.equal('some text');
})
````

## complex ddoc handlers

Note complex form of ddoc handlers **.show().get(), .list().view(), .update().post(), .update().put()**


## Methods

### setters

**- .dbname()**

### session methods

**- .login(), .logout(), .session()**

### server methods

**- .uuids()**

#### example:

````javascript
  relax
    .uuids(2)
    .end(function(res) {
      console.log(JSON.parse(res.text));
    });
````
````bash
--> {"uuids":["11eaa495bfae96d36d6a53f21a01adf6","11eaa495bfae96d36d6a53f21a01b9b7"]}
````

````javascript
  relax.uuids(2, function(err, res) {
      console.log(res);
  });
````
````bash
--> ["11eaa495bfae96d36d6a53f21a01adf6","11eaa495bfae96d36d6a53f21a01b9b7"]
````

### database methods

**- .exists(), .create(), .drop(), .info()**

#### example:

````javascript
relax.exists(name)
  .end(function(err, res){
    console.log(res.ok);
  })
````

````bash
--> true
````

### document methods

**- .get(), .post(), .put(), .del(), .push()** (aka crude get-then-put, use .update instead)

#### example:

````javascript
var doc = {text: 'some text', count: 1};
relax.post(doc)
  .end(function(err, res){
    doc._id = res.id;
    console.log(res);
  })
````

````bash
--> {
  ok: true,
  id: '11eaa495bfae96d36d6a53f21a0e357c',
  rev: '1-69aed0cf2cf6e13d7209219e4e814c74' }
````

````javascript
relax.get(doc, function(err, res){
    console.log(res);
  })
````

````bash
--> {
  _id: '11eaa495bfae96d36d6a53f21a0ede9d',
  _rev: '1-69aed0cf2cf6e13d7209219e4e814c74',
  text: 'some text',
  count: 1 }
````

### array of documents methods

**- .all(), .bulk()**

````javascript
relax
  .all(docs)
  .query({startkey: '"1"', endkey: '"2"'})
  .end(function(err, res){
    log(err, JSON.parse(res.text));
  })
````

````bash
-->
{ total_rows: 5,
  offset: 1,
  rows:
   [ { id: '1', key: '1', value: [Object] },
     { id: '2', key: '2', value: [Object] } ] }
````

### design doc handlers

**- .view(), .show().get(), .list().view(), .update().post(), .update().put()**

**_view**

design document:

````javascript
function(doc) { emit(doc.text, null) };
````

program:

````javascript
relax
  .view('spec/byText')
  .query({startkey:'"some text 1"', endkey:'"some text 3"'})
  .end(function(err, res){
    console.log(JSON.parse(res.text));
  });
````

````bash
-->
{ total_rows: 5,
  offset: 1,
  rows:
   [ { id: '1', key: 'some text 1', value: null },
     { id: '2', key: 'some text 2', value: null },
     { id: '3', key: 'some text 3', value: null } ] }
````

**_show**

design document:

````javascript
var justText = function(doc, req) {
  return { body : "just " + doc.text };
}
var doc = {_id: 'some-id', text: 'some text', count: 0};
var ddoc = {_id: '_design/spec', shows: {'justText': justText.toString() } };
````

program:

````javascript
relax
  .show('spec/justText')
  .get(doc)
  .end(function(res){
    console.log(res.text);
  });
````

````bash
-->
just some text
````

**_list**

design document:

````javascript
    var basicList = function(head, req) {
        start({"headers":{"Content-Type" : "text/html"}});
        send("head");
        var row;
        while(row = getRow()) {
            send(row.key);
        };
        return "tail";
    };
````

program:

````javascript
relax
  .list('spec/basicList')
  .view('spec/basicView', function(err, res) {
    log(res.text);
  });
````

````bash
-->
headsome texttail
````


### not included

**- .allDbs, .activeTasks, .stats, .config, .compact, .replicate, .viewCleanUp, etc**

if you need them,  use straight SA-request.get(path) instead

## Installation

With node.js:

````bash
$ npm install relax-component
````
or with [component](http://github.com/component/component)

````bash
$ component install mbykov/relax
````

Or as standalone and minified version:

````html
<script src="relax.min.js"></script>
````

## API

View more examples in test suite

## Running node tests

````bash
$ make test
````

## Running browser tests

include xxx

## License

  GNU GPL
