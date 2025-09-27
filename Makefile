.PHONY: test

test:
	node --test test/**/*.test.js

test-watch:
	node --watch --test test/**/*.test.js
