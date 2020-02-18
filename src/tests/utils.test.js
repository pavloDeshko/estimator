/*import { payloadThunk, getAction } from './utils.js'
test.only('no test',()=>{})
let dispatch = jest.fn(action =>
  console.log('dispatch is called with:', action)
)
let next = jest.fn(action => console.log('next is called with:', action))

let sideAction = getAction([])
let actionAfter = { bla: 10 }

let thunk = jest.fn(function(dispatch, getState) {
  dispatch(new sideAction())
  if (next.mock.calls.length < 1)
    throw new Error('next was not called before thunk')
})
let thunkF = jest.fn(function(dispatch, getState) {
  this.bla = getState() * 2 + this.bla
  dispatch(new sideAction())
  if (next.mock.calls.length > 0) {
    throw new Error('next was called before thunkFirst')
  }
})

let curried = payloadThunk({ dispatch, getState: jest.fn(() => 8) })(next)

let cases = [
  ['Vannila action', new (getAction(['bla']))(10), false],
  ['Thunk action', new (getAction(['bla'], thunk))(10), true],
  ['Thunk first action', new (getAction(['bla'], thunkF, true))(-6), true]
]

cases.forEach(testCase => {
  test(testCase[0], () => {
    next.mockClear()
    dispatch.mockClear()

    curried(testCase[1])
    console.log(
      testCase[0],
      'Next calls: ',
      next.mock.calls,
      'Dispatch.calls: ',
      dispatch.mock.calls
    )
    expect(next.mock.calls[0][0]).toEqual(expect.objectContaining(actionAfter))
    if (testCase[2]) {
      expect(dispatch.mock.calls[0][0]).toEqual(expect.any(sideAction))
    }
  })
})
*/