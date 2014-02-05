# Relax, superagent on a couch

Relax is a small  [component](http://github.com/component/component) and node.js module.

Relax is a high-level CouchDB client on a top of [superagent](http://github.com/visionmedia/superagent). It will only help you not to write criminally-long http-requests in Couch style, leaving the rest to the mighty superagent. It can be a light replacement of a jquery.coush.js and has almost the same methods.

Relax is tiny - 8K.

## Usage

var Relax = require('relax');
var relax = new Relax();
relax.dbname('relax-specs');
var admin = new Relax('http://admin:kjre4317@localhost:5984');

## Chainable or callback forms

Each method has chainable and callback-style api. Chainable form always returns SA-response. While callbak form returns what you are expect from CouchDB:

Chainable-form:

```javascript
            relax
                .get(doc)
                .end(function(err, res){
                    JSON.parse(res.text).text.should.equal('some text');
                })
```

Callback-form:

```javascript
            relax
                .view('spec/byText', function(err, res) {
                    res.rows[1].key.should.equal('some text');
                })
```



## Methods

#### setters

- .dbname

#### server methods

- .uuids, .info

#### database methods

- .exists, .create, .drop, .info

#### document methods

- .get, .post, .put, .delete, .copy, .push (aka crude get-post)

#### array of documents methods

- .all, .bulk

#### design doc handlers

- .view, .show.get, .list.view, .update.post, .update.put

#### not included

- .allDbs, .activeTasks, .stats, .config, .compact, .replicate, .viewCleanUp, etc

if you need them,  use straight SA-request.get(path) instead

## Installation

With node.js:

```bash
$ npm install relax-component
```
or with [component](http://github.com/component/component)

```bash
$ component install mbykov/relax
```

Or as standalone and minified version:

```html
<script src="relax.min.js"></script>
```

## API

For full usage and API documentation, view the [documentation](http://github.com/).

## Running node tests

```bash
$ make test
```



## License

  GNU GPL
