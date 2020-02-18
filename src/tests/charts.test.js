import * as d3 from 'd3'
import {
  VERY_UP,
  UP,
  BIT_UP,
  FLAT,
  BIT_DOWN,
  DOWN,
  VERY_DOWN
} from '../consts.js'

export var graphData = {
  system: 'IMPERIAL',
  max: 400,
  min: 100,
  length: 100,
  breaks: [15,65],
  points: [
    {
      offset: 0,
      elev: 100
    },
    {
      offset: 10,
      elev: 300
    },
    {
      offset: 30,
      elev: 400
    },
    {
      offset: 50,
      elev: 250
    },
    {
      offset: 100,
      elev: 100
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
  ]
}
export var pieData ={
  system : 'METRIC',

  segments: [
  {
    name: 'Very_steep',
    slopes: [12, 100],
    length: 1,
    percent: 1,
    time: 120,
    speed: 5,
    slopeType: VERY_UP
  },
  {
    name: 'Steep',
    slopes: [7, 12],
    length: 3,
    percent: 15,
    time: 180,
    speed: 10,
    slopeType: UP
  },
  {
    name: 'A_bit_steep',
    slopes: [3, 7],
    length: 15,
    percent: 10,
    time: 20,
    speed: 15,
    slopeType: BIT_UP
  },
  {
    name: 'Flat',
    slopes: [-3, 3],
    length: 5,
    percent: 30,
    time: 72,
    speed: 25,
    slopeType: FLAT
  },
  {
    name: 'A_bit_downhill',
    slopes: [-7, -3],
    length: 5,
    percent: 10,
    time: 20,
    speed: 30,
    slopeType: BIT_DOWN
  },
  {
    name: 'Downhill',
    slopes: [-12, -7],
    length: 15,
    percent: 15,
    time: 25,
    speed: 35,
    slopeType: DOWN
  },
  {
    name: 'Very_downhill',
    slopes: [-100, -12],
    length: 1,
    percent: 1,
    time: 15,
    speed: 40,
    slopeType: VERY_DOWN
  }
]
}
