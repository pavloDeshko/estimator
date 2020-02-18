import { combineReducers } from 'redux'
import { set, remove, filter, convertParams } from './utils'
import * as actions from './actions'
/*eslint import/first:0*/
import { DEFAULT_TRACKS } from './consts.js'
 function tracks(state = DEFAULT_TRACKS, action = {}) {
  switch (action.type) {
    case actions.Add.type: {
      let newTracks = {}
      action.tracks.forEach(track => {
        newTracks[track.id] = track
      })
      return set(state, newTracks)
    }
    case actions.Remove.type:
      return remove(state, action.id)
    default:
      return state
  }
}

import { DEFAULT_RESULTS } from './consts.js'

 function results(state = DEFAULT_RESULTS, action = {}) {
  switch (action.type) {
    case actions.Result.type:
      return set(state, { [action.result.id]: action.result })
    case actions.Remove.type:
      return remove(state, action.id)
    default:
      return state
  }
}

import { DEFAULT_TRACKS_VIEW } from './consts.js'

 function tracksView(state = DEFAULT_TRACKS_VIEW, action = {}) {
  switch (action.type) {
    case actions.Add.type: {
      let newList = [...state.list, ...action.tracks.map(track => track.id)]
      let lastNewIndex = action.tracks.length - 1
      let active =
        lastNewIndex >= 0 ? action.tracks[lastNewIndex].id : state.active
      return { list: newList, active }
    }
    case actions.Activate.type:
      return set(state, { active: action.id })
    case actions.Remove.type: {
      let active = state.active
      if (active == action.id) {
        let index = state.list.indexOf(action.id)
        active = index > 0 ? state.list[index - 1] : state.list[1] || null
      }
      return { list: state.list.filter(id => id != action.id), active }
    }
    default:
      return state
  }
}

import {
  DEFAULT_PARAMS,
  BIKE_WEIGHT,
  RIDERS_WEIGHT,
  LOAD_WEIGHT,
  TYRES,
  ROAD_SURFACE,
  POSITION
} from './consts.js'

const params = function(state = DEFAULT_PARAMS, action = {}) {
  if (action.type == actions.Params.type) {
    let change = filter(action.change,value=>value=='' || !isNaN(parseFloat(value)) )
    return set(state, change)
  } else if (action.type == actions.ToogleSystem.type){
    return convertParams(state, action.system)
  }
  else return state
}

function message(state = '', action = {}) {
  if (action.type == actions.Message.type || action.type == actions.Failure.type){
    return action.text?action.text:''
  }
  else return state
}

function isWorking(state = false, action = {}) {
  switch (action.type) {
    case actions.StartWork.type:
    case actions.Load.type:
    case actions.Parse.type:
    case actions.Reverse.type:
    case actions.Estimate.type:
      return true
    case actions.StopWork.type:
      return false
    default:
      return state
  }
}

import { DEFAULT_SYSTEM, METRIC, IMPERIAL } from './consts.js'

const system = function(state = DEFAULT_SYSTEM, action = {}) {
  if (action.type == actions.ToogleSystem.type) return action.system
  else return state
}

const slope = function(state = null, action = {}) {
  if (action.type == actions.SelectSlope.type) return action.slope
  else return state
}

const ui = combineReducers({ params, system, slope, isWorking, message })
const appReducer = combineReducers({ ui, tracks, results, tracksView })
export default appReducer

export { slope, system, isWorking, message, params,tracksView,results,tracks }
