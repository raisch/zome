'use strict';
/* eslint-env node, es6 */

const _ = require('./lodash_extended')

/**
 * Different states used in game.
 */
class GameState {
  constructor(name = 'empty') {
    if(!_.isNonEmptyString(name)) {
      throw new Error('requires a name')
    }
    this._state = name.toUpperCase()
  }

  set state(name) {
    if(!_.isNonEmptyString(name)) {
      throw new Error('requires a name')
    }
    this._state = name.toUpperCase()
  }

  toString() {
    return this._state
  }

  /**
   * Returns a glyph based on state.
   * @return {string}
   */
  toGlyph() {
    let result = '?'
    switch(this._state) {
      case 'EMPTY':
        result = ' '
        break
      case 'MISS':
        result = '-'
        break
      case 'HIT':
        result = 'X'
        break
      default:
        result = '?'
    }
    return result
  }
}

GameState.States = {
  EMPTY: new GameState('empty'),
  OCCUPIED: new GameState('occupied'),
  MISS: new GameState('miss'),
  HIT: new GameState('hit'),
  DEAD: new GameState('dead')
}

module.exports = GameState
