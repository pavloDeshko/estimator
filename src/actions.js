import { getAction, every, read, parseParams} from './utils'
import workerDispatch from './appWorker.js'

export const Load = getAction('Load',['files'], loadThunk)
function loadThunk(dispatch) {
  let files = Array.from(this.files)
  every(files.map(file => {
    return read(file)
    .then(
      result=>{
        let prom = dispatch(Parse(result,file.name))
        return prom},
      err => dispatch(Failure('Failed to load ' + file.name + ', try again, please.'))
    )
  }))
    .finally( ()=>dispatch(StopWork()) )
}

export const Parse = getAction('Parse',['data', 'filename'], parseThunk)
function parseThunk(dispatch) {
  return workerDispatch(WorkerParse(this.data,this.filename)).then(
    tracks => dispatch(Add(tracks,this.filename)),
    err => dispatch(Failure(err.message.includes('elevation')? err.message
	:'Failed to parse '+this.filename+', make sure this file is valid GPX.'))
  )
}

export const Result = getAction('Result',[ 'result'])

export const Reverse = getAction('Reverse',['id'], reverseThunk)
function reverseThunk(dispatch, getState) {
  return workerDispatch(WorkerReverse(getState().tracks[this.id]))
    .then(
      track => dispatch(Add([track], track.filename)),
      err => dispatch(Failure('Something went wrong, can\'t reverse the track!'))
    ).finally(()=>dispatch(StopWork()))
}

export const Add = getAction('Add',['tracks','filename'],function(dispatch){
  if (this.tracks.length ==0) dispatch(Message(
    'Looks like '+this.filename+' doesn\'t contain any tracks.'))
})

export const Remove = getAction('Remove',['id'])

export const Activate = getAction('Activate',['id'])

export const Params = getAction('Params',['change'])

export const Estimate = getAction('Estimate',[], estimateThunk)
function estimateThunk(dispatch, getState) {
  let state = getState()
  return workerDispatch(
    WorkerEstimate(state.tracks[state.tracksView.active], parseParams(state.ui.params)))
    .then(
      result => dispatch(Result(result)),
      err => dispatch(Failure('Ups! Can\'t estimate - something went wrong.'))
    ).finally(()=>dispatch(StopWork()))
}

export const SelectSlope = getAction('SelectSlope',['slope'])

export const ToogleSystem = getAction('ToogleSystem',['system'])

const resetText = function(dispatch){
  if(this.text != '')setTimeout(()=>dispatch(Message('')),20000)
}
export const Message = getAction('Message',['text'],resetText)
export const Failure = getAction('Failure', ['text'],resetText)

export const StartWork = getAction('StartWork')

export const StopWork = getAction('StopWork')

export const WorkerParse = getAction('Parse',['data','filename'])//return [tracks]

export const WorkerReverse = getAction('Reverse',['track'])//return track

export const WorkerEstimate  = getAction('Estimate',['track','params'])//return result