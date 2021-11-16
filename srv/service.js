/*eslint-env node, es6 */ /*eslint no-console: 0,*/
"use strict";

async function _actionAssertCheckCreate(req) {

  return "Hello";
}

module.exports = cds.service.impl(async function () {
  this.on("readPackages", _actionAssertCheckCreate);
  this.on("readPackages2", _actionAssertCheckCreate);
});
