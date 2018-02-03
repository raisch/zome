'use strict'
/* eslint-env node, es6 */

const util = require('util')
const _ = require('../lodash_extended')
const EventEmitter = require('events')
const stringify = require('json-stringify-safe')
const readline = require('readline')

const GameBoard = require('../GameBoard')
const GameState = require('../GameState')

class Human extends EventEmitter {
  constructor (opponent, name = 'Human') {
    super()

    if (!_.isNonEmptyString(name)) {
      throw new Error(`requires a name`)
    }

    _.merge(this, {
      name: name,
      board: new GameBoard(),
      opponent: opponent,
      turns: 1
    })

    this.on('miss', key => {
      console.log(`A miss.`)
      this.miss(key)
      this.takeTurn() // computer's turn!
    })

    this.on('hit', (key) => {
      console.log(`A hit! A most palpable hit!`)
      this.hit(key)
      // check destroyed ship and emit 'killed'
      this.takeTurn()
    })

    this.on('killed', (opponent, ship) => {
      console.log(`You sank ${opponent}'s ${ship}`)
      // check opponents remaining ships and emit 'success'
      this.takeTurn()
    })

    this.on('success', (evt) => {
      console.log('YOU ARE VICTORIOUS!')
      process.exit()
    })

    this.on('failure', (evt) => {
      console.log('YOU ARE DEFEATED!')
      process.exit()
    })

    this.on('exit', (evt) => {
      console.log('\nBye!')
      process.exit()
    })
  }

  initialize () {
    console.log(`\nHello ${this.name}! Let's play Battleship...\n`)
    this.takeTurn()
  }

  targetToCoords (target = '') {
    if (!_.isNonEmptyString(target)) {
      return `no target`
    }
    const result = _.toCoords(target)

    const rows = Number(this.board.rows)
    if (!(_.isNumber(result.row) && result.row < rows)) {
      result.err = `bad row found for ${target}: ${stringify(result)}`
      return result
    }

    const cols = Number(this.board.columns)
    if (!(_.isNumber(result.column) && result.column < cols)) {
      result.err = `bad column found for ${target}: ${stringify(result)}`
      return result
    }

    return result
  }

  coordsToTarget (row = 0, col = 0) {
    return _.toKey(row, col)
  }

  validate (target) {
    if (!_.isNonEmptyString(target)) {
      return `no target`
    }

    const coords = this.targetToCoords(target)
    if (coords.err) {
      return coords.err
    }

    // more validation here
  }

  takeTurn () {
    console.log(`\n${this.name}'s turn #${this.turns}...`)

    const rows = Number(this.board.rows)
    const cols = Number(this.board.columns)

    const start = this.coordsToTarget(0, 1)
    const end = this.coordsToTarget(rows - 1, cols)

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    })

    console.log(`\n${this.opponent.board.toString()}\n`)

    rl.question(`Where would you like to fire [${start}-${end} or exit]? `, (ans) => {
      rl.close()
      ans = ans.toUpperCase()

      if (ans === 'EXIT') {
        this.emit('exit')
        return
      }

      const err = this.validate(ans)
      if (err) {
        console.error(`Whoops! ${err}\n`)
        this.takeTurn()
        return
      }

      console.log(`You fired on ${ans}`)

      this.turns += 1

      switch (this.checkTurnResult(ans)) {
        case 'miss':
          this.emit('miss', ans)
          break
        case 'hit':
          this.emit('hit', ans)
          break
        case 'killed':
          this.emit('kill', ans)
          break
        default:
          this.takeTurn()
      }
    })
  }

  checkTurnResult (ans) {
    if(!_.isNonEmptyString(ans)) {
      throw new Error('requires an answer')
    }
    const cell = this.getOpponentCell(ans)
    let result = 'miss'
    if (cell.state === GameState.States.OCCUPIED.toString()) {
      result = 'hit'
    }
    return result
  }

  miss (key) {
    if(!_.isNonEmptyString(key)) {
      throw new Error('requires a key')
    }
    const cell = this.getOpponentCell(key)
    cell.state = GameState.States.MISS.toString()
  }

  hit (key) {
    if(!_.isNonEmptyString(key)) {
      throw new Error('requires a key')
    }
    const cell = this.getOpponentCell(key)
    cell.state = GameState.States.HIT.toString()
  }

  getOpponentBoard () {
    const opponent = _.get(this, 'opponent')
    if (!opponent) throw new Error('cannot find opponent')
    const board = _.get(opponent, 'board')
    if (!board) throw new Error('cannot find opponents board')
    return board
  }

  getOpponentCell (key) {
    if(!_.isNonEmptyString(key)) {
      throw new Error('requires a key')
    }
    const board = this.getOpponentBoard()
    const cell = _.get(board, `keys.${key}`)
    if (!cell) throw new Error(`cannot find cell at ${key} on ${board.name}'s board`)
    return cell
  }
}

module.exports = Human
