
/*eslint import/first:0*/


import { set, remove, extract,getAction, payloadThunk,slopesColors, formatD3, formatReact,every } from './utils.js'
import {METRIC} from './consts.js'
describe('set test', ()=>{
  let initState = { bla: 55, foo: 66 }
  test('copy',()=>{
    let copiedState = set(initState)
    expect(copiedState).toMatchObject(initState)
    expect(copiedState).not.toBe(initState)
  })
  test('assign hoo, reasingn bar ',()=>{
    expect(set(initState,{bla:77},{bar:100,hoo:'hoo'})).toMatchObject(
      {bla:77,foo:66,bar:100,hoo:'hoo'}
    )
  })
})

describe('remove test',()=>{
  test("remove b",()=>{
    let o = { a: 1, b: 2, c: 3 }
    expect(remove(o,'b')).toMatchObject({a:1,c:3})
    expect(remove(o, 'b')).not.toHaveProperty('b')
  })
})

describe('extract test',()=>{
  test('extract a,c',()=>{
    let o = { a: 1, b: 2, c: 3 }
    let extr = extract(o, 'a', 'c')
    expect(extr).toMatchObject({a:1,c:3})
    expect(extr).not.toHaveProperty('b')
  })
})



describe('getAction test',()=>{
  test('foo,bar and undf action', ()=>{
    let action = getAction('action',['foo', 'bar', 'undf'])
    let instance = action(1,2)

    expect(instance.type).toEqual(action.type)
    expect(instance).toMatchObject({'foo':1,'bar':2,'undf':undefined})
  })
  test('thunk action',()=>{
    let thunk = jest.fn()
    let thunkFirstAction = getAction('action',['foo'], thunk, true)
    let thunkAction = getAction('thunkaction',['foo'], thunk)

    let thunkInstance = thunkAction(3)
    let thunkFirstInstance = thunkFirstAction(3)
    
    expect(thunkInstance.thunk).toEqual(thunk)
    expect(thunkFirstInstance.thunkFirst).toEqual(thunk)
  })
})

test('middleware test',()=>{
  
  let thunk = jest.fn()
  let next = jest.fn(action=>action)
  let middleware = payloadThunk({dispatch:()=>{},getState:()=>{}})(next)
  
  let action = getAction('action',['foo'])
  let thunkFirstAction = getAction('action',['foo'], thunk, true)
  let thunkAction = getAction('action',['foo'], thunk)
  
  expect(middleware(action(3)).type).toEqual(action.type)
  expect(middleware(thunkAction(3)).type).toEqual(thunkAction.type)
  expect(middleware(thunkFirstAction(3)).type).toEqual(thunkFirstAction.type)

  expect(thunk).toHaveBeenCalledTimes(2)
  expect(next).toHaveBeenCalledTimes(3)
})

test('slopes colors test',()=>{
  expect(slopesColors('div','fill')).toEqual(expect.any(String))
})


describe('formatters test',()=>{
  test('objects with functions', ()=>{
    Object.values(formatD3(METRIC)).forEach(value=>expect(value).toEqual(expect.any(Function)))
    Object.values(formatReact(METRIC)).forEach(value => expect(value).toEqual(expect.any(Function)))
    
  })
})

/*import * as actions from './actions.js'
describe('actions tests',()=>{
  test('basic actions',()=>{Object.values(actions).forEach(action=>{
    expect(action().type).toEqual(action.type)
    })
  })
})*/

describe('every test',()=>{
  test('resolves 1,2,3',()=>{
    return every([
      new Promise(res=>setTimeout(()=>res(1),100)),
      new Promise(res => setTimeout(() => res(2), 200)),
      new Promise(res => setTimeout(() => res(3), 300))
    ]).then(res=> expect(res).toEqual(expect.arrayContaining([1,2,3])) )
  })
  test('rejects 1,bla,3',()=>{
    expect.assertions(1)
    return every([
      new Promise(res => setTimeout(() => res(1), 100)),
      new Promise((res,rej) => setTimeout(() => rej('bla'), 200)),
      new Promise(res => setTimeout(() => res(3), 300))
    ]).catch( reason=>expect(reason).toEqual(expect.arrayContaining([1,'bla',3])) )
  })
})


