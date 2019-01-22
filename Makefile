ALL_TRANSPILED_JS_FILES = $(shell find bin/ -type f -name '*.js')

BIN_DIR := bin
SRC_DIR := src

# Execute code
# run: transpile typecheck
# 	node $(BIN_DIR)/eulerian_circuit.js

WORLD_TRAVEL_DIR = 05_visited

world_travel: $(WORLD_TRAVEL_DIR)/*.js
	./node_modules/.bin/babel $(WORLD_TRAVEL_DIR)/src --out-dir $(WORLD_TRAVEL_DIR)/prod

# When file changes, re-run babel
# transpile: $(SRC_DIR)/*.js
# 	./node_modules/.bin/babel $(SRC_DIR) --out-dir $(BIN_DIR)

.flowconfig:
	flow init

# Make sure the code passes typechecking
typecheck: .flowconfig
	./node_modules/.bin/flow

test: transpile
	./node_modules/.bin/jest bin/tests/*.test.js
