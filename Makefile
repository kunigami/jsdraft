ALL_TRANSPILED_JS_FILES = $(shell find bin/ -type f -name '*.js')

BIN_DIR := bin
SRC_DIR := src

WORLD_TRAVEL_DIR = world_travel

world_travel: src/js/$(WORLD_TRAVEL_DIR)/*.js
	./node_modules/.bin/babel src/js/$(WORLD_TRAVEL_DIR) --out-dir build/js/$(WORLD_TRAVEL_DIR)
	node_modules/.bin/webpack

.flowconfig:
	flow init

# Make sure the code passes typechecking
typecheck: .flowconfig
	./node_modules/.bin/flow

test: transpile
	./node_modules/.bin/jest bin/tests/*.test.js
