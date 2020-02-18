/*import { WorkerEmul as Worker } from './worker.js'
import { PARSE, REVERSE, ESTIMATE } from './consts.js'

test.only('no test',()=>{})

let sampleTrack = expect.objectContaining({
  id: expect.any(String)
})
let sampleTracks = expect.arrayContaining([sampleTrack])
let sampleResults = expect.objectContaining({
  id: expect.any(String),
  result: expect.any(Object)
})

let worker = new Worker('./worker.js')
;[
  ['Parse test', { type: PARSE, data: 'balaba' }, sampleTracks],
  ['Reverse test', { type: REVERSE, track: { id: '11' } }, sampleTrack],
  ['Error test', {}, false],
  [
    'Estimate test',
    { type: ESTIMATE, track: { id: '22' }, params: {} },
    sampleResults
  ]
].forEach(test => workerTest(...test))

function workerTest(testName, toSend, toMatch) {
  test(testName, function() {
    console.group(testName)
    expect.assertions(1)
    let promise = new Promise((resolve, reject) => {
      worker.onmessage = m => resolve(m.data)
      worker.onerror = e => reject(e)
      console.log('Sent: ', toSend)
      worker.postMessage(toSend)
    })
    if (toMatch) {
      return promise.then(data => {
        console.log('Got: ', data)
        expect(data).toEqual(toMatch)
      })
    } else
      return promise.catch(e => {
        console.log('Got error: ', e.constructor)
        expect(e).toEqual(expect.anything())
      })
  })
}

import appWorker from './appWorker.js'
test('AppWorker sucsess', () => {
  let promises = [
    appWorker.parse('eoudorecudoercu'),
    appWorker.reverse({ id: '11' }),
    appWorker.estimate({ id: '11' }, {})
  ]
  console.log('promises are: ', promises)
  return Promise.all(promises)
})

test('AppWorker failure', async () => {
  let parse = appWorker.parse('eoudorecudoercu')
  let fail = appWorker.parse(22)
  let reverse = appWorker.reverse({ id: '11' })
  let hang = appWorker.parse('HANG')
  let estimate = appWorker.estimate({ id: '11' }, {})
  await expect(fail).rejects.toEqual(expect.anything())
  await expect(hang).rejects.toEqual(expect.anything())
  return Promise.all([parse, reverse, estimate])
})
*/