#TESTS = test/node/couch_api.js
#TESTS = test/node/db_api.js
#TESTS = test/node/query_opts.js
#TESTS = test/node/view_api.js
TESTS = test/node/*.js
#REPORTER = dot
REPORTER = spec

build: components index.js #test
	@component build --dev

components: component.json
	@component install --dev

relax: components index.js test/node/*.js
	@component build \
		--standalone relax \
		--out . --name relax

test:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--require should \
		--reporter $(REPORTER) \
		--timeout 2000 \
		$(TESTS)

clean:
	rm -fr build components template.js relax.js

couch:
	@component build
	cd ~/web/Component/relax-couch; grunt


# test:
# 	@mocha-phantomjs test/index.html


.PHONY: test

#		--growl \
