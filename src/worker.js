import {default as register} from 'promise-worker/register'
import {UP, DOWN, FLAT,BIT_DOWN,BIT_UP,VERY_DOWN,VERY_UP} from './consts.js'
import {parse,reverse,estimate} from './estimator.js'

const main = function(action){
	console.log('Worker got action: ', action)
	if(action.type == 'Parse'){

        return parse(action)

      }else if (action.type == 'Reverse'){

        return reverse(action)

      }else if (action.type == 'Estimate'){
		  
		return estimate(action)

      }else{
        console.log('unknow action')
        throw new Error()

      }
}

const testPost = function(action){
  console.log('Action dispatched to worker: ',action)
  
    
      if(action.type == 'Parse'){

        if(flip()) throw new Error()
        else return flip() ? [track()]: tracks()

      }else if (action.type == 'Reverse'){

        if (flip()) throw new Error()
        else return reverseT(action.track)

      }else if (action.type == 'Estimate'){

        if (flip()) throw new Error()
        else return result(action.track)

      }else{
        console.log('unknow action')
        throw new Error()

      }
    
  
}


register(main)
const trackOne = {
  id:'3452345',
  name:'trackOne',
  filename:'file.gpx',
  reversed:false,
  max: 400,
  min: 100,
  maxSlope: 20,
  minSlope:-10,
  distance: 100,
  gain:350,
  loss:250,
  maxSlope:20,
  breaks: [2, 3],
  points: [
    {
      offset: 0,
      ele: 100
    },
    {
      offset: 10,
      ele: 300
    },
    {
      offset: 30,
      ele: 400
    },
    {
      offset: 50,
      ele: 250
    },
    {
      offset: 100,
      ele: 100
    }
  ],
  slopes: [
    {
      start: 0,
      end: 10,
      slopeType: UP
    },
    {
      start: 10,
      end: 30,
      slopeType: BIT_UP
    },
    {
      start: 30,
      end: 50,
      slopeType: FLAT
    },
    {
      start: 50,
      end: 55,
      slopeType: BIT_DOWN
    },
    {
      start: 55,
      end: 100,
      slopeType: DOWN
    }
  ],
  bins: {
    [VERY_UP]:{
      distance: 0,
      percent:10,
      slopeType: VERY_UP
    },
    [UP]:{
      distance: 20,
      percent: 10,
      slopeType: UP
    },
    [BIT_UP]:{
      distance: 25,
      percent: 10,
      slopeType: BIT_UP
    },
    [FLAT]:{
      distance: 50,
      percent: 10,
      slopeType: FLAT
    },
    [BIT_DOWN]:{
      distance: 20,
      percent: 10,
      slopeType: BIT_DOWN
    },
    [DOWN]:{
      distance: 25,
      percent: 10,
      slopeType: DOWN
    },
    [VERY_DOWN]:{
      distance: 0,
      percent: 10,
      slopeType: VERY_DOWN
    }
  }
}

let trackTwo = {
  id:'768967867',
  name:'trackTwo',
  filename:'file.gpx',
  reversed:false,
  max: 500,
  min: 100,
  maxSlope: 20,
  minSlope:-10,
  distance: 100,
  gain:350,
  loss:250,
  breaks: [4],
  points: [
    {
      offset: 0,
      ele: 100
    },
    {
      offset: 10,
      ele: 300
    },
    {
      offset: 40,
      ele: 400
    },
    {
      offset: 50,
      ele: 250
    },
    {
      offset: 100,
      ele: 100
    }
  ],
  slopes: [
    {
      start: 0,
      end: 10,
      slopeType: VERY_UP
    },
    {
      start: 10,
      end: 30,
      slopeType: UP
    },
    {
      start: 30,
      end: 50,
      slopeType: FLAT
    },
    {
      start: 50,
      end: 55,
      slopeType: BIT_DOWN
    },
    {
      start: 55,
      end: 100,
      slopeType: VERY_DOWN
    }
  ],
  bins: {
    [VERY_UP]: {
      distance: 10,
      percent:20,
      slopeType: VERY_UP
    },
    [UP]: {
      distance: 15,
      percent: 10,
      slopeType: UP
    },
    [BIT_UP]: {
      distance: 25,
      percent: 10,
      slopeType: BIT_UP
    },
    [FLAT]: {
      distance: 60,
      percent: 10,
      slopeType: FLAT
    },
    [BIT_DOWN]: {
      distance: 10,
      percent: 10,
      slopeType: BIT_DOWN
    },
    [DOWN]: {
      distance: 25,
      percent: 10,
      slopeType: DOWN
    },
    [VERY_DOWN]: {
      distance: 0,
      percent: 10,
      slopeType: VERY_DOWN
    }
  }
}

/*Result
  id
  speed
  time
  points []
    offset
  slopes []
    start
    end
    speed
    slopeType
  bins {}
    time
    speed
    percentTime*/
let resultTwo = {
  id: '768967867',
  speed: 11,
  time: 60,
  breaks: [15, 65],
  points: [
    {
      offset: 0,
      ele: 100,
    },
    {
      offset: 50,
      ele: 200 ,
    },
    {
      offset: 60,
      ele: 400,
    },
    {
      offset: 70,
      ele:300 ,
    },
    {
      offset: 80,
      ele: 100,
    }
  ],
  slopes: [
    {
      start: 0,
      end: 50,
      slopeType: VERY_UP,
      speed:5
    },
    {
      start: 50,
      end: 60,
      slopeType: UP,
      speed: 9
    },
    {
      start: 60,
      end: 70,
      slopeType: FLAT,
      speed: 11
    },
    {
      start: 70,
      end: 75,
      slopeType: BIT_DOWN,
      speed: 11
    },
    {
      start: 75,
      end: 80,
      slopeType: VERY_DOWN,
      speed: 40
    }
  ],
  bins: {
    [VERY_UP]: {
      time: 10,
      speed: 6,
      percentTime: 10,
      slopeType: VERY_UP
    },
    [UP]: {
      time: 10,
      speed: 10,
      percentTime: 10,
      slopeType: UP
    },
    [BIT_UP]: {
      time: 10,
      speed: 10,
      percentTime: 10,
      slopeType: BIT_UP
    },
    [FLAT]: {
      time: 30,
      speed: 10,
      percentTime: 10,
      slopeType: FLAT
    },
    [BIT_DOWN]: {
      time: 10,
      speed: 10,
      percentTime: 10,
      slopeType: BIT_DOWN
    },
    [DOWN]: {
      time: 10,
      speed: 10,
      percentTime: 10,
      slopeType: DOWN
    },
    [VERY_DOWN]: {
      time: 10,
      speed: 40,
      percentTime: 10,
      slopeType: VERY_DOWN
    }
  }
}
function track(){
  let tr = Object.assign({}, flip() ? trackOne: trackTwo)
  tr.id = Math.floor(Math.random()*Math.pow(2,20)).toString()
  return tr
}
function tracks(){
  return [track(),track()]
}
function result(origin){
  let res = Object.assign({}, resultTwo)
  res.id = origin.id
  return res
}
function reverseT(origin) {
  let tr = track()
  tr.reversed = origin.name
  return tr
}
function flip(){
  return (Math.random()*2)>1
}