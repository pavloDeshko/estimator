import * as consts from './consts.js'
import * as d3 from 'd3'
import { default as q } from "js-quantities"
import React from 'react'
import {css} from 'styled-components'
import {default as gpx} from 'gpx-parse'

export function set(state, ...toset) {
  return Object.assign({}, state, ...toset)
}

export function forEach(obj,func){
  Object.keys(obj).forEach(key=>{
    func(obj[key],key,obj)
  })
}

export function filter(obj,func){
  let result = {}
  forEach(obj,(value,key,obj)=>{
    if(func(value,key,obj)) result[key] = value
  })
  return result
}

export function map(obj,fun){
  let result = {}
  forEach(obj,(value,key,obj)=>{
    result[key] = fun(value,key,obj)
  })
  return result
}

export function remove(state, id) {
  let result = set(state)
  delete result[id]
  return result
}

export function extract(source, ...rest){
  let result = {}
  rest.forEach(item=>{
    if (Array.isArray(item)){
      result[item[1]] = source[item[0]]
    }else{
      result[item] = source[item]
    }
  })
  return result
}

export function getAction(type, keys=[], thunk, thunkFirst = false) {
  let creator = function() {
    let action = {}
    action.type=type
    Object.assign(action, ...keys.map((key, i) => ({ [key]: arguments[i] })))
    if (typeof thunk == 'function')
      Object.assign(action, thunkFirst ? { thunkFirst: thunk } : { thunk })
    return action
  }
  creator.type = type
  return creator
}

export const payloadThunk = store => next => action => {
  let promise
  if (typeof action.thunkFirst == 'function')
    promise = action.thunkFirst.call(action, store.dispatch, store.getState)
  let result = next(action)
  if (typeof action.thunk == 'function')
    promise =action.thunk.call(action, store.dispatch, store.getState)
  return promise instanceof Promise? promise: result
}

export const logger = store => next => action =>{
  console.log('Action dispatched: ',action.type,action)
  let result = next(action)
  console.log('New state: ',store.getState())
  return result
}

export function slopesColors(selector, property) {
  return consts.SLOPE_TYPES.reduce((result,slope)=>{
    return result + `
      ${selector}.${slope}{
        ${property}:${consts[slope+'_COLOR']}
      }
    `
  },'')
}
export function getType(grade){
	let result = ''
	forEach(consts.SLOPE_DETAILS,(slope,key)=>{
		if(grade >slope.grades[0] && grade<slope.grades[1]) result=key
	})
	if(result =='') console.log(grade)
	return result
}

export function slopesDesc(slope){
  return consts.SLOPE_DETAILS[slope].description
}
export function slopesGrades(slope){
  let grades = consts.SLOPE_DETAILS[slope].grades
  return grades[0]+'%..'+grades[1]+'%'
}

const formatters = {
  distance: function (value, system, convert=true) {
    let imperial = system == consts.IMPERIAL
    let result

    if (convert && imperial)
      result = q(value, 'km').to('mile')
    if (!convert && imperial)
      result = q(value, 'mile')
    else if (!imperial)
      result = q(value, 'km')

    if (result < 1 && result > 0)
      return (imperial ? result.to('ft') : result.to('m')).toPrec(1)
    else
      return result.toPrec(0.1)
  },

  elevation: function (value, system, convert=true) {
    let imperial = system == consts.IMPERIAL

    if (convert && imperial)
      return q(value, 'm').to('ft').toPrec(1)
    if (!convert && imperial)
      return q(value, 'ft').toPrec(1)
    else if (!imperial)
      return q(value, 'm').toPrec(1)

  },

  time: function (value) {
    let total = q(value, 'h')
    let hours = q(Math.floor(total.scalar),'hours')
    let mins = total.sub(hours).to('min').toPrec(1)

    return ([hours, mins])
  },

  speed: function (value, system, convert=true) {
    let imperial = system == consts.IMPERIAL

    if (convert && imperial)
      return q(value, 'kph').to('mph').toPrec(0.1)
    if (!convert && imperial)
      return q(value, 'mph').toPrec(0.1)
    else if (!imperial)
      return q(value, 'kph').toPrec(0.1)
  },

  slope: function (value, presize = false) {
    return q(value, '%').toPrec(presize ? 0.1 : 1)
  },

  percent: function (value){
    return q(value, '%').toPrec(1)
  }
}

const renderD3 = function (content, target) {
  let span = target.nodeName == 'text' ? 'tspan' : 'span'
  let that = d3.select(target)
  content = Array.isArray(content) ? content : [content]
  content.forEach(el => {
    that
      .append(span)
      .attr('class', 'value')
      .text(el.scalar + ' ')
    that
      .append(span)
      .attr('class', 'unit')
      .text(el.units() + ' ')
  })
}

const renderReact = function (content) {
  content = Array.isArray(content) ? content : [content]
  let result = []
  content.forEach((el,i) => {
    result.push(<span key={i+'v'+el.length} className='value'>{el.scalar + ' '}</span>)
    result.push(<span key={i+'u'+el.length} className='unit'>{el.units() + ' '}</span>)
  })
  return <span className="formatted-value">{result}</span>
}


export const formatD3 = function (system) {
  let generic = {}
  Object.keys(formatters).forEach(k => {
    generic[k] = function (acc=(d=>d),...options) {
      return function (d) {
        d=acc(d)
        renderD3(formatters[k](d, system, ...options), this)
      }
    }
  })
  return generic
}

export const formatReact = function (system) {
  let generic = {}
  Object.keys(formatters).forEach(k => {
    generic[k] = function (d, ...options) {
        return renderReact(formatters[k](d, system, ...options))
      }
  })
  return generic
}

/*const toKg = q.swiftConverter('lb', 'kg')

export const io = system=>({
  weightOut: value =>{
    if (value == undefined) return ''
    else { 
      return system == consts.IMPERIAL ? 
      q(value, 'kg').to('lb').toPrec(0.1).scalar: 
      q(value,'kg').toPrec(0.1).scalar
    }
  },
  weightIn: value => {
    if (value == '') return undefined
    value = parseFloat(value)
    if (isNaN(value)) return NaN
    else return system == consts.IMPERIAL ? toKg(value) : value
  },
  numberIn: value =>{
    if (value == '') return undefined
    value = parseFloat(value)
    if (isNaN(value)) return NaN
    else return value
  },
  numberOut: value =>{
    if (value == undefined) return ''
    else return q(value, 'kg').toPrec(0.1).scalar
  }
})*/

let round = v => Math.round(v * 10) / 10
let lbKg = q.swiftConverter('lb', 'kg')
let kgLb = q.swiftConverter('kg','lb')
const toLb = v=>round(kgLb(parseFloat(v)))+''
const toKg = v => round(lbKg(parseFloat(v)))+''

let paramsConverters = {
  [consts.RIDER_WEIGHT]:[toKg,toLb],
  [consts.BIKE_WEIGHT]:[toKg,toLb],
  [consts.LOAD_WEIGHT]: [toKg, toLb]
}

export const convertParams= function(params,system){
  let index = system == consts.METRIC ? 0 : 1
  let changed = map(paramsConverters, (conv,key)=>{
    if(params[key]=='') return ''
    else return conv[index](params[key])
  })
  return set(params, changed)
}


export const parseParams = (params,system)=>{
  if(system==consts.IMPERIAL) params = convertParams(params,consts.METRIC)
  return map(params, value => parseFloat(value))
}

export const every = function(arr){
  if (arr.length == 0) return Promise.resolve(arr)
  return new Promise((res,rej)=>{
    let full = Array(...Array(arr.length))
    let results = Array(...Array(arr.length))

    let check = ()=>{
      if(!full.includes(undefined)){
        if (!full.includes(null)){
          res(results)
        }else{
          rej(results)
        }
      }
    }

    arr.forEach((promise,i)=>{
      promise.then(result=>{
        results[i] = result
        full[i]= true
        check()
      },reason=>{
        results[i] = reason
        full[i] = null
        check()
      })
    })
  })
}

export const read = function(file){
  return new Promise((res,rej)=>{
    let reader = new FileReader()
    reader.onload = e => res(reader.result)
    reader.onerror = e => rej(e)
    reader.readAsText(file)
  })
}

let distance= gpx.utils.calculateDistance
export const dist = function(a,b){
	return Math.sqrt(Math.pow(distance(a.lat,a.lon,b.lat,b.lon),2)+Math.pow((b.elevation-a.elevation)/1000,2))
}

export const parseGpx = function(string){
	return new Promise((res,rej)=>{
	  gpx.parseGpx(string,(error,result)=>{
		if(error) rej(error)
	    else res(result.tracks.map(track=>{
			let breaks = []
			let points = []
			track.segments.filter(seg=>seg.length>0).forEach((segment,i,all)=>{
				points = points.concat(segment)
				if(i<all.length-1) breaks.push(segment.length-1)
			})
			return {breaks,points,name:track.name}
		}))
	  })
	})
}