#!/usr/bin/env node
const gem = require('./node.util/gem')
;
(async () => {
  await gem.prepare()
  await gem.fetch()
  await gem.store()
})()
