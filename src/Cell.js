'use strict'
/* eslint-env node, es6 */
const _ = require('./lodash_extended')

const GameState = require('./GameState')

class Cell {
  constructor (row, column, player, state = new GameState('empty')) {
    if (!(_.isNumber(row) && row >= 0)) {
      throw new Error(`requires a row index equal to or greater than zero: ${row}`)
    }
    if (!(_.isNumber(column) && column >= 0)) {
      throw new Error(`requires a column index equal to or greater than zero: ${column}`)
    }
    if (!state instanceof GameState) {
      throw new Error('requires a state')
    }

    this.row = row
    this.column = column
    this.key = _.toKey(row, column)

    this.player = player
    this._state = state
  }

  set state(name) {
    if(!_.isNonEmptyString(name)) {
      throw new Error('name must be a string')
    }
    this._state = new GameState(name)
  }

  get state() {
    return this._state
  }

  hit () {
    this._state = new GameState('hit')
    return this
  }

  kill () {
    this._state = new GameState('killed')
    return this
  }

  toString () {
    const state = this._state
    const glyph = state.toGlyph()
    return `[${this.key}] "${glyph}" `
  }

  toGlyph() {
    return `${this.state.toGlyph()}`
  }
}

module.exports = Cell

// const c = new Cell(0,0)
// c.state = 'occupied'
// console.log({state:c.state.toString(), glyph: c.toGlyph(), str: c.toString()})
// console.log(JSON.stringify(c,null,1))
