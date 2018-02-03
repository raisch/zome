'use strict'
/* eslint-env node, es6 */

const _ = require('./lodash_extended')
const stringify = require('json-stringify-safe')
const readline = require('readline')

const GameBoard = require('./GameBoard')
const Human = require('./Players/Human')
const Computer = require('./Players/Computer')

class Game {
  constructor (opts = {}) {
    if (!_.isPlainObject(opts)) {
      throw new Error(`opts must be an object`)
    }

    const computer = new Computer()
    const human = new Human(computer)

    computer.opponent = human

    _.merge(this, {
      human,
      computer
    }, opts)

    // console.log(stringify(this, null, 2))
  }

  initialize () {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    })
    rl.question(`What is your name [${this.human.name}]?`, (ans) => {
      rl.close()
      this.human.name = ans.trim() || this.human.name
      console.log(`\nHello ${this.human.name}! Let's play Battleship...\n`)
      this.human.takeTurn()
    })
  }

  run () {
    this.initialize()
  }

}

module.exports = Game
