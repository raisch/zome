'use strict'
/* eslint-env node, es6 */
const _ = require('lodash')
const path = require('path')


const GameState = require('./GameState')
const Cell = require('./Cell')

const STATES = GameState.States

class GameBoard {
  constructor (opts) {
    this.init(opts)
  }

  init (opts) {
    if (opts && !_.isPlainObject(opts)) {
      throw new Error('requires an opts:Object')
    }
    _.merge(this, {
      player: _.get(opts,'player',{}),
      rows: 8,
      columns: 8,
      cells: [],
      keys: {}
    }, opts)
    return this.initCells()
  }

  initCells () {
    if (!(_.isNumber(this.rows) && this.rows >= 0)) {
      throw new Error(`rows ${this.rows} must be an integer greater than zero`)
    }
    if (!(_.isNumber(this.columns) && this.columns >= 0)) {
      throw new Error(`columns ${this.columns} must be an integer greater than zero`)
    }
    for (let i = 0; i < this.rows; i++) {
      let cols = []
      for (let j = 0; j < this.columns; j++) {
        const cell = new Cell(i, j, this, new GameState('empty'))
        cols.push(cell)
        this.keys[_.toKey(i, j + 1)] = cell
      }
      this.cells.push(cols)
    }
    return this
  }

  at(row, column) {
    if (!(_.isNumber(row) && row >= 0)) {
      throw new Error('requires a row')
    }
    if (!(_.isNumber(column) && column >= 0)) {
      throw new Error('requires a column')
    }
    const cell = this.cells[row][column]
    if(!cell instanceof Cell) {
      throw new Error(`no cell found at ${row}@${column}`)
    }
    return cell
  }

  getRuler() {
    let ruler = ''
    for(let i = 0; i < this.rows; i++) {
      ruler += '+---'
    }
    return `  ${ruler}+`
  }

  getHeader() {
    let result = '  '
    for(let i = 0; i < this.rows; i++) {
      const ch = String.fromCharCode(Number(65 + i))
      result += `| ${i + 1} `
    }
    return result + '+'
  }

  toString() {
    let result = ''
    let rows = 0
    this.cells.forEach(row => {
      const key = String.fromCharCode(Number(65 + rows))
      result += `${key} `
      row.forEach(cell => {
        result += `| ${cell.toGlyph()} `
      })
      result += `| ${key}\n`
      rows += 1
    })
    return `${this.getRuler()}\n${this.getHeader()}\n${this.getRuler()}\n${result}${this.getRuler()}\n${this.getHeader()}\n${this.getRuler()}`
  }

}

module.exports = GameBoard

// const b = new GameBoard({rows: 8, columns: 8})
// b.at(2,1).hit()
// b.at(2,2).kill()
//
// console.log(b.toString())

// console.log(JSON.stringify(b, null, 2))
