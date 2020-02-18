
import { POWER, POSITION, ROAD_SURFACE, TYRES, BIKE_WEIGHT, RIDER_WEIGHT, LOAD_WEIGHT, SLOPE_TYPES } from './consts.js'
import { map, forEach, getType, dist, parseGpx } from './utils.js'

const findIndexFrom = function (arr, cb, start = 0) {
  for (let i = start; i < arr.length; i++) {
    if (cb(arr[i], i, arr)) return i
  }
  return -1
}
const G = 9.8067 //g
const R = 1.088  //air dencity
const min = 4
const max = 120

/*
los - Drivetrain loss,in percent
slope - In percent
mass -In kg
rr - roling resistance coeficient
cda - air drag 
*/
export const getPower = (mass, cda, rr, loss = 3) => (slope) => {
  /*
  speed - In kmh
  {return}power  
  */
  return function (speed) {
    speed = speed * 0.277778
    return Math.pow(1 - loss / 100, -1) * (
      G * mass * (Math.sin(Math.atan(slope / 100)) + rr * Math.cos(Math.atan(slope / 100)))
      + (0.5 * cda * R * Math.pow(speed, 2))
    ) * speed
  }
}

export function solveSpeed(power, func) {
  if (func(min) > power) return min
  if (func(max) < power) return max
  else return find(min, max, power, func)
}

function find(start, end, target, func) {
  let middle = start + (end - start) / 2
  let take = func(middle)
  if (Math.abs(take - target) < 1) return middle
  else if (take > target) return find(start, middle, target, func)
  else if (take < target) return find(middle, end, target, func)
}



export function parse({ data, filename }) {
  return parseGpx(data)
    .then(tracks=>{
	  return tracks.map(track => {
        let constructed = construct(toOffsets(track))
        Object.assign(constructed, {
          filename,
          name: track.name,
        })
        return constructed
      })	
	})
  
    
}

export function reverse({ track }) {
  let reversed = construct(reversePoints(track))
  Object.assign(reversed, {
    filename: track.filename,
    name: track.name,
    reversed: track.name
  })
  return reversed
}

export function estimate({ track, params }) {
  let power = getPower(
    params[BIKE_WEIGHT] + params[RIDER_WEIGHT] + params[LOAD_WEIGHT],
    params[POSITION],
    params[TYRES] + params[ROAD_SURFACE]
  )

  let slopes = []
  let bins = map(track.bins, (bin,key) => ({ time: 0, speed: undefined, percentTime: undefined,slopeType:key}))
  //estimate time while populating slopes and adding to bins[].time
  let time = track.slopes.reduce((timeOffset, slope) => {
    let speed = solveSpeed(params[POWER], power(slope.grad))
    let time = (slope.end - slope.start) / speed

    slopes.push({
      speed,
      start: timeOffset,
      end: timeOffset + time,
      slopeType: slope.slopeType,
      grad: slope.grad
    })

    bins[slope.slopeType].time += time

    return timeOffset + time
  }, 0)

  forEach(bins, (bin, key) => {
    bin.speed = track.bins[key].distance / bin.time
    bin.percentTime = (bin.time / time) * 100
  })

  let points = []
  let cash = 0
  let speedBefore = function (distance) {
    let i = findIndexFrom(track.slopes, slope => slope.end >= distance ? true : false, cash)
    cash = i
    if (i == -1) throw new Error('slopes are not covering to the end!')
    return slopes[i].speed
  }
  track.points.reduce((prev, point, i) => {
    let timeOffset = prev ?
      (point.offset - prev[0]) / speedBefore(point.offset) + prev[1]
      : 0
    points[i] = { offset: timeOffset, ele: point.ele }
    return [point.offset, timeOffset]
  }, null)

  return {
    id: track.id,
    time,
    speed: track.distance / time,
    slopes,
    bins,
    points,
	breaks: track.breaks
  }
}


//helpers
function reversePoints({points,breaks,name}){
  let max = points.length>0 ? points[points.length-1].offset: 0
  return {
    points: points.map(point => ({
       ele: point.ele,
       offset: max - point.offset
      })).reverse(),
    breaks: breaks.map(br=>points.length-1-br).reverse(),
    name
  }
}

function mark({points,breaks}){
  breaks.forEach(i => { points[i].breakEnd = true })
}
function unMark({points,breaks}) {
  console.log('unmark')
  breaks.forEach(i => { delete points[i].breakEnd  })
}

function toOffsets(track) {
  mark(track)
  let points =[]
  track.points.reduce((prev, rawPoint) => {
    let offset = !prev ? 0 : prev._break ? prev.offset : prev.offset + dist(rawPoint, prev) 
    let point = {
      offset: offset,
      ele: rawPoint.elevation
    }
    points.push(point)
	rawPoint.offset=offset
    return rawPoint
  }, null)
  unMark(track)
  return {points,breaks:track.breaks,name:track.name}
}

function construct({points,breaks}) {
	
  let result = {
    id: Math.random().toString(),
    distance: 0,
    gain: 0,
    loss: 0,
    max: undefined,
    min: undefined,
    maxSlope: undefined,
    minSlope: undefined,
    points,
    breaks
  }
  console.log('construct')
  const minMax = (value, slope) => {
    let max = slope ? 'maxSlope' : 'max'
    let min = slope ? 'minSlope' : 'min'
    if (result[max] == undefined || result[max] < value) result[max] = value
    if (result[min] == undefined || result[min] > value) result[min] = value
  }

  let slopes = []
  let bins = SLOPE_TYPES.reduce((obj, key) => { obj[key] = {slopeType:key, distance: 0 }; return obj }, {})
  mark(result)
    points.reduce((prev, point) => {
      //CHANGE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      if(point.ele == -1) throw new Error('Error! Not all points have correct elevation values.')
      minMax(point.ele)
      if (prev && !prev._break) {
		
        let gain = point.ele - prev.ele
        let distance = point.offset - prev.offset
        let grad = (gain / (distance*1000)) * 100
        let slopeType = getType(grad)
		
        //console.log(grad,slopeType)
		
        result.distance += distance
        bins[slopeType].distance += distance
        minMax(grad, true)
        if (gain > 0) result.gain += gain
        else result.loss += gain
        
        slopes.push({
          start: prev.offset,
          end: point.offset,
          grad,
          slopeType
        })
      }
      return point
    }, null)
	
  unMark(result)
  
  forEach(bins, bin => { bin.percent = (bin.distance / result.distance) * 100 })
 
  Object.assign(result, {slopes, bins })
  
  return result
}
/* 
Track
  id
  name
  filename
  reversed
  min
  max
  maxSlope
  minSlope
  gain
  loss
  distance
  points []
    offset
    ele
  breaks[]
  slopes []
    start
    end
    slopeType
    grad
  bins {}
    percent
    distance

Result
  id
  speed
  time
  breaks
  points []
    offset
    ele
  slopes []
    start
    end
    speed
    slopeType
  bins {}
    time
    speed
    percentTime
*/