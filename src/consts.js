export const POWER = 'POWER'
export const BIKE_WEIGHT = 'BIKE_WEIGHT'
export const RIDER_WEIGHT = 'RIDER_WEIGHT'
export const LOAD_WEIGHT = 'LOAD_WEIGHT'
export const TYRES = 'TYRES'
export const ROAD_SURFACE = 'ROAD_SURFACE'
export const POSITION = 'POSITION'

export const METRIC = 'METRIC'
export const IMPERIAL = 'IMPERIAL'

export const BY_TIME ='BY_TIME'
export const BY_DISTANCE='BY_DISTANCE'

export const PARSE = 'PARSE'
export const REVERSE = 'REVERSE'
export const ESTIMATE = 'ESTIMATE'
export const WORKER_TIMEOUT = 2000

export const TARMAC = '0'
export const GRAVEL = '0.005'
export const OFFROAD = '0.010'

export const MTB = '0.014'
export const ROAD = '0.006'
export const HYBRID= '0.01'

export const ENDS = '0.5'
export const DROPS = '0.35'
export const AERO = '0.28'

export const DEFAULT_TRACKS = {}
export const DEFAULT_RESULTS = {}
export const DEFAULT_TRACKS_VIEW = { list: [], active: null }
export const DEFAULT_PARAMS = {
  [BIKE_WEIGHT]: 15,
  [RIDER_WEIGHT]: 60,
  [LOAD_WEIGHT]: 5,
  [TYRES]: MTB,
  [ROAD_SURFACE]: TARMAC,
  [POSITION]: ENDS,
  [POWER]: 200
}
export const DEFAULT_SYSTEM = METRIC
//export const DEFAULT_MODE = BY_DISTANCE


export const VERY_UP = 'VERY_UP'
export const VERY_UP_COLOR = 'hsl(0, 80%, 30%)'

export const UP = 'UP'
export const UP_COLOR = 'hsl(30, 80%, 50%)'

export const BIT_UP = 'BIT_UP'
export const BIT_UP_COLOR = 'hsl(60, 80%, 55%)'

export const FLAT = 'FLAT'
export const FLAT_COLOR = 'hsl(120, 70%, 45%)'

export const BIT_DOWN = 'BIT_DOWN'
export const BIT_DOWN_COLOR = 'hsl(195, 80%, 55%)'

export const DOWN = 'DOWN'
export const DOWN_COLOR = 'hsl(240, 80%, 45%)'

export const VERY_DOWN = 'VERY_DOWN'
export const VERY_DOWN_COLOR = 'hsl(300, 80%, 20%)'

export const SLOPE_TYPES = [VERY_UP, UP, BIT_UP, FLAT, BIT_DOWN, DOWN, VERY_DOWN]
export const SLOPE_DETAILS = {
  VERY_UP: {description: '10% and more', grades:[10,99]},
  UP: { description: '5% - 10% uphill',grades:[5,10]}, 
  BIT_UP: { description: '2% - 5% uphill',grades:[2,5]}, 
  FLAT: { description: '-2% - 2% flat',grades:[-2,2]},
  BIT_DOWN: { description: '-2% - -5% DH',grades:[-5,-2]},
  DOWN: { description: '-5% - 10% DH',grades:[-10,-5]},
  VERY_DOWN: { description: '-10% and less',grades:[-99,-10]}
}

