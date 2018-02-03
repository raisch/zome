'use strict';
/* eslint-env node, es6 */

const _ = require('../lodash_extended')
const stringify = require('json-stringify-safe')
const EventEmitter = require('events')

const GameState = require('../GameState')
const GameBoard = require('../GameBoard')

class Computer extends EventEmitter {
  constructor(name, opponent) {
    super()
    name = name || 'Computer'
    if(!_.isNonEmptyString(name)) {
      throw new Error(`requires a name`)
    }

    _.merge(this, {
      name: name,
      board: new GameBoard(),
      opponent: opponent
    })
  }

  takeTurn() {
    console.log(`${this.name}'s turn...'`)
    // if result of turn is 'hit' or 'killed', take another turn
  }

}

module.exports = Computer
