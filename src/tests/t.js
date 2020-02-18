/*
test.only('no test', () => { })
import * as actions from './actions.js'
import { getAction, set, remove } from './utils.js'

const log = (...rest) => console.log(...rest)
const dir = (...rest) => console.dir(...rest)

console.groupCollapsed('actions')
console.log('2 empty actions, true, true, false and constructor')
let Empty = getAction([])
let ea = new Empty()
console.log(new Empty(), new Empty(34, 'bla'))
console.log(
  ea instanceof Empty,
  ea.constructor === Empty,
  ea.constructor == getAction,
  ea.constructor
)

console.log('simple actions: foo 5, undefined and foo x bar 76, same ')
let Simple = getAction(['foo', 'bar'])
console.log(new Simple(5), new Simple('x', 76), new Simple('x', 76, 'fooo'))

console.log('Payload actions: only and foo. and prints 66.')
let Pay1 = getAction([], () => 1)
let Pay2 = getAction(['foo'], function() {
  console.log(this.foo)
})
console.log(new Pay1(), new Pay2(55))
let ac = new Pay2(66)
ac.thunk()

log('Enchanced action with foo. then prints bar')
let E = getAction(
  ['foo'],
  function() {
    log(this.foo)
  },
  true
)
let enchanced = new E('bar')
console.log(enchanced)
enchanced.thunkFirst()

let keys = Object.keys(actions)
log('15 actions ', keys.length)
keys.forEach(key => {
  let Type = actions[key]
  let action = new Type()
  log(key, action, action.constructor === Type, action instanceof Type)
})
console.groupEnd()

console.groupCollapsed('utils')
console.log(
  'bla changed, bar and hoo assigned. then false and two same and false'
)
let init = { bla: 55, foo: 66 }
let newState = set(init, { bla: 77 }, { bar: 100, hoo: 'hoo' })
console.log(init, newState)
console.log(init == newState)
let copy = set(init)
console.log(init, copy, init == copy)

let o = { a: 1, b: 2, c: 3 }
let rem = remove(o, 'b')
log('b removed and false')
log(o, rem, o == rem)
console.groupEnd()

console.group('Reducers')
function testReducer(key, actions) {
  console.group('Reducer ' + key)
  let reducer = reducers[key]
  let init = reducer()
  log('Initial state: ', init, '\n')
  actions.reduce((state, action) => {
    dir('Action dispatched: ', actionKey(action.constructor) + ' ', action)
    let newState = reducer(state, action)
    dir('Resulted state: ', newState, '\n\n')

    return newState
  }, init)
  console.groupEnd()
}
function actionKey(action) {
  return Object.keys(actions)[Object.values(actions).indexOf(action)]
}

import * as reducers from './reducer.js'

import { DEFAULT_MODE, BY_TIME, BY_DISTANCE } from './consts.js'
testReducer(
  'profileMode',
  [
    new actions.ToogleProfile(BY_TIME),
    new actions.ToogleProfile(BY_DISTANCE),
    new actions.ToogleProfile(BY_DISTANCE),
    new actions.ToogleProfile(BY_TIME)
  ]
)

import { DEFAULT_SYSTEM, METRIC, IMPERIAL } from './consts.js'
testReducer('system', [
  new actions.ToogleSystem(METRIC),
  new actions.ToogleSystem(IMPERIAL),
  new actions.ToogleSystem(IMPERIAL),
  new actions.ToogleSystem(METRIC)
])

testReducer('isWorking', [
  new actions.Load(),
  new actions.Add(),
  new actions.Reverse(),
  new actions.Add(),
  new actions.Estimate(),
  new actions.Result()
])

testReducer('message', [
  new actions.Message('bla'),
  new actions.Failure('bla-bla')
])

import {
  DEFAULT_PARAMS,
  BIKE_WEIGHT,
  RIDERS_WEIGHT,
  LOAD_WEIGHT,
  TYRES,
  ROAD_SURFACE,
  POSITION,
  GRAVEL,
  ROAD,
  DROPS,
  MTB
} from './consts.js'

testReducer('params', [
  new actions.Params({ [BIKE_WEIGHT]: 10 }),
  new actions.Params({ [BIKE_WEIGHT]: 13, [RIDERS_WEIGHT]: 50 }),
  new actions.Params({ [TYRES]: MTB, [ROAD_SURFACE]: GRAVEL }),
  new actions.Params({ [TYRES]: ROAD, [POSITION]: DROPS }),
  new actions.Params({ [LOAD_WEIGHT]: 25 }),
  new actions.Params({ [LOAD_WEIGHT]: 25 }),
  new actions.Params({ [BIKE_WEIGHT]: 12 })
])

testReducer('tracksView', [
  new actions.Add([{ id: 11 }]),
  new actions.Remove(11),
  new actions.Add([{ id: 22 }, { id: 33 }]),
  new actions.Activate(22),
  new actions.Remove(22),
  new actions.Add([{ id: 44 }]),
  new actions.Add([]),
  new actions.Activate(33),
  new actions.Remove(44)
])

testReducer('results', [
  new actions.Result('11', {}),
  new actions.Result('22', {}),
  new actions.Remove('11')
])
testReducer('tracks', [
  new actions.Add([{ id: '11' }]),
  new actions.Remove('11'),
  new actions.Add([{ id: '22' }, { id: '33' }]),
  new actions.Remove('22'),
  new actions.Add([{ id: '44' }]),
  new actions.Add([]),
  new actions.Remove('44')
])
console.groupEnd()
*/