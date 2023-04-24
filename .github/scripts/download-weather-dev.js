#!/usr/bin/env node
//const gem = require('./.github/scripts/node.util/gem')
const gem = require('./node.util/gem')
;
gem.prepare()
gem.fetch()
gem.store()
