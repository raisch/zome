'use strict';
/* eslint-env node, es6 */

const _ = require('lodash')

module.exports = _.mixin({
  isNonEmptyString: s => _.isString(s) && !_.isEmpty(s),
  toKey: (row, col) => String.fromCharCode(65 + row) + col.toString(),
  toCoords: key => {
    if (!_.isNonEmptyString(key)) {
      throw new Error('requires a key')
    }
    const row = Number(key.slice(0, 1).toUpperCase().charCodeAt(0) - 65)
    const column = Number(key.slice(1)) - 1
    return { row, column }
  }
})
