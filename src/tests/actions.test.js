/*import { Reverse, Parse, Estimate, Add, Result, Failure } from './actions.js'
import { payloadThunk } from './utils.js'
import appWorker from './appWorker.js'
test.only('no test',()=>{})
let state = {
  tracks: { 111: { id: '111' }, 222: { id: '222' }, toFail: { id: 346 } },
  ui: { params: {} }
}
let dispatch = jest.fn(action => {
  console.log('mock called with:', action)
})
let curried = payloadThunk({ getState: () => state, dispatch })(() => {})

beforeEach(() => dispatch.mockClear())

function expectAdd(action) {
  expect(action).toEqual(expect.any(Add))
  expect(action.tracks).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ id: expect.any(String) }),
      expect.objectContaining({ id: expect.any(String) })
    ])
  )
}

test('Parse', done => {
  curried(new Parse('222', 'bla.gpx'))

  setTimeout(() => {
    let calls = dispatch.mock.calls
    console.log('Number of dispatch calls:', calls.length)
    expect(calls.length).toEqual(1)
    expectAdd(calls[0][0])
    done()
  }, 2000)
})
test('Reverse', done => {
  curried(new Reverse('111'))

  setTimeout(() => {
    let calls = dispatch.mock.calls
    expect(calls.length).toEqual(1)
    expectAdd(calls[0][0])
    done()
  }, 2000)
})
test('Estimate', done => {
  curried(new Estimate('111'))
  setTimeout(() => {
    let calls = dispatch.mock.calls
    let action = calls[0][0]
    expect(calls.length).toEqual(1)
    expect(action).toEqual(expect.any(Result))
    expect(action).toMatchObject({
      id: expect.any(String),
      result: expect.any(Object)
    })
    done()
  }, 2000)
})

test('Failures', done => {
  curried(new Parse(346))
  curried(new Reverse('toFail'))
  curried(new Estimate('toFail'))

  setTimeout(() => {
    expect(dispatch).toHaveBeenCalledTimes(3)
    dispatch.mock.calls.forEach(call =>
      expect(call[0]).toEqual(expect.any(Failure))
    )
    done()
  }, 2000)
})
*/