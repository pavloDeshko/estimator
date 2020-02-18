import {default as PromiseWorker} from 'promise-worker'
import {UP, DOWN, FLAT,BIT_DOWN,BIT_UP,VERY_DOWN,VERY_UP} from './consts.js'
import Worker from './worker.js'

let rawWorker
let worker

const reset = function(){
  if(worker)rawWorker.terminate()
  rawWorker = new Worker()
  worker = new PromiseWorker(rawWorker)
}
reset()

function TimeoutError(m){
  this.message=m
  this.stack= (new Error()).stack
}
TimeoutError.prototype = new Error()

const timeout = function(promise, time = 20){
  return Promise.race([promise,
  new Promise((_,rej)=>{
    setTimeout(()=>rej(new TimeoutError('Looks like we were stuck...')),time*1000)
  })])
}

const workerDispatch = function(action){
  return timeout(worker.postMessage(action))
    .catch(err=>{
      if(err instanceof TimeoutError) reset()
      throw err
    })
}


export default workerDispatch


/*import { WorkerEmul } from './worker.js'
Worker = WorkerEmul

const workerDefault = './worker.js'
import { PARSE, REVERSE, ESTIMATE, WORKER_TIMEOUT } from './consts.js'

let worker = undefined
let q = []
let busy = false

function parse(data) {
  return new Promise((res, rej) => {
    q.push({ res, rej, load: { type: PARSE, data } })
    doIt()
  })
}
function reverse(track) {
  return new Promise((res, rej) => {
    q.push({ res, rej, load: { type: REVERSE, track } })
    doIt()
  })
}
function estimate(track, params) {
  return new Promise((res, rej) => {
    q.push({ res, rej, load: { type: ESTIMATE, track, params } })
    doIt()
  })
}

function doIt(reset = false) {
  if (reset && worker) {
    worker.terminate()
    worker = undefined
  }
  if (!worker) worker = new Worker(workerDefault)

  if (q.length > 0 && !busy) {
    busy = true
    let task = q.shift()
    let timeout = setTimeout(
      failThisOne,
      WORKER_TIMEOUT,
      new Error('Worker Timeout')
    )
    worker.onmessage = e => {
      task.res(e.data)
      busy = false
      clearTimeout(timeout)
      doIt()
    }
    worker.onerror = () => {
      clearTimeout(timeout)
      failThisOne()
    }
    worker.postMessage(task.load)
    function failThisOne(e) {
      let error =
        e instanceof Error ? e : new Error('Something went wrong in the worker')
      task.rej(error)
      busy = false
      doIt(true)
    }
  }
}

const appWorker = { parse, estimate, reverse }
export default appWorker
*/