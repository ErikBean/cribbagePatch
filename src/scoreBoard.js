import React, { Component } from 'react'
import { without, includes } from 'lodash'
import { getFifteens, getRuns, getPairs } from './points'

// Sum the length of all arrays in obj
function sumLengths(obj){
  return Object.keys(obj).map((k) => {
    return obj[k].length
  }).reduce((acc, curr) => {
    return acc + curr
  }, 0)
}

// Sum all values in obj
function sumValues(obj){
  return Object.keys(obj).map((k) => {
    return obj[k]
  }).reduce((acc, curr) => {
    return acc + curr
  }, 0)
}

const ScoreBoard = (props) => {
  const fifteens = getFifteens(props.cards)
  const pairs = getPairs(props.cards)
  const runs = getRuns(props.cards).length
  const numFifteens = sumLengths(fifteens)
  const numPairs = sumValues(pairs)
  return (
    <div>
      <ul>
        <li>
          Fifteens: {numFifteens}
        </li>
        <li>
          pairs: {numPairs}
        </li>
        <li>
          runs: {runs}
        </li>
      </ul>
    </div>
  )
}

export default ScoreBoard