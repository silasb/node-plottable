# Get a relative npm bin path /usr/foo/node_modules/.bin -> ./node_modules/.bin
npmbin := $(subst $(CURDIR),.,$(shell npm bin))
jshint := $(npmbin)/jshint
jscs   := $(npmbin)/jscs
mocha  := $(npmbin)/mocha
pre_commit_hook := .git/hooks/pre-commit

test_log ?= /dev/null
lint_log ?= /dev/null

define MAKEFILE_USAGE
Usage instructions:
    make lint                        runs jshint and jscs on the codebase
    make test                        runs the unit tests
    make test grep=[filter]          filter and run runs the unit test
endef
export MAKEFILE_USAGE

define GITHOOK
#!/bin/bash
set -e

changed_files=$$(git diff-index --cached --name-only HEAD)
changed_js_files=$$(echo "$$changed_files" | grep '.js$$' || true)

# Run unit tests and lint if JS files have changed.
if [ "$$changed_js_files" != "" ]; then
  make test
  echo "$$changed_js_files" | xargs $$(npm bin)/jshint
fi

# TODO: Commented out until we start using npm shrinkwrap in this repo
# Re-generate the shrinkwrap file if package.json has changed.
# if echo "$$changed_files" | grep package.json > /dev/null; then
#   npm shrinkwrap && git add npm-shrinkwrap.json
# fi
endef
export GITHOOK

default: help

# Try and provide some useful debug output when installing this module fails
# due to missing PKG_CONFIG_PATH. This only applies to OSX development though.
.PHONY: install-check
install-check:
	@ if [ "$$PKG_CONFIG_PATH" = "" ] && [ -d /usr/X11/lib/pkgconfig ]; then \
	    echo "No pkgconfig eviroment variable found, run:\n\n  $$ PKG_CONFIG_PATH=/usr/X11/lib/pkgconfig npm install\n"; \
	    exit 1; \
	  fi

.PHONY: test
test: $(mocha)
	@NODE_ENV=test $(mocha) --grep "$(grep)" 'test/**/*_test.js' # Pass glob to mocha

.PHONY: lint
lint: $(jshint) $(jscs)
	@$(jshint) --exclude-path=.gitignore .
	@$(jscs) .

.PHONY: help
help:
	@echo "$$MAKEFILE_USAGE"


# Install a pre-commit hook into the local git directory if present.
$(pre_commit_hook):
	@ if [ -d $(shell dirname $@) ]; then \
	    echo "$$GITHOOK" > $@; \
	    chmod +x $@; \
	  fi

$(jshint) $(mocha) $(jscs):
	@npm install --quiet
