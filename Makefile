#TESTS = test/node/couch_api.js
#TESTS = test/node/db_api.js
#TESTS = test/node/query_opts.js
#TESTS = test/node/view_api.js
TESTS = test/node/*.js
#REPORTER = dot
REPORTER = spec

build: components index.js #test
	@component build #--dev

components: component.json
	@component install --dev

relax: components index.js test/node/*.js
	@component build  --use component-minify\
		--standalone relax \
		--out . --name relax.min

test:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--require should \
		--reporter $(REPORTER) \
		--slow 500 \
		--timeout 2000 \
		$(TESTS)

couch:
	@component build
	cd ~/web/Component/relax-couch; grunt

min: components index.js #test
	@component build --use component-minify
	cd ~/web/Component/relax-couch; grunt


clean:
	rm -fr build components template.js relax.js

# test:
# 	@mocha-phantomjs test/index.html


.PHONY: test clean

#		--growl \
