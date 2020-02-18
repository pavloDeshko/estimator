import React from 'react'
import styled,{css} from 'styled-components'
import {formatReact, slopesDesc} from '../utils.js'
import {IMPERIAL,METRIC, POWER, BIKE_WEIGHT,RIDER_WEIGHT, LOAD_WEIGHT, TYRES, ROAD_SURFACE,POSITION,
  TARMAC, GRAVEL, OFFROAD, ENDS, DROPS, AERO, MTB, ROAD, HYBRID
} from '../consts.js'

const sharedCss = css`
 caption{
	 margin-top:0.4em;
	 font-weight: bold;
 }
 table{
	width:100%;
	padding: 0.5em 1em;
}
`

const NoData = ({text})=>(<div className='no-data'>{text}</div>)

const Summary = function({className,empty,system,distance,time,speed,gain,loss,maxSlope,minSlope}){
  if(empty) return <div className={"track-summary "+className}> 
    <NoData text='Add track from a file, please' />
  </div>
  let format = formatReact(system)
  
  return (
  <div className={"track-summary "+className}> 
    <table><tbody>
        <tr><td>Length</td><td>{format.distance(distance)}</td></tr>
        <tr><td>Time</td><td>{time ? format.time(time) : '-'}</td></tr>
        <tr><td>Average Speed</td><td>{speed ? format.speed(speed) : ' - '}</td></tr>
        <tr><td>Elevation gain</td><td>{format.elevation(gain)}</td></tr>
        <tr><td>Elevation loss</td><td>{format.elevation(loss)}</td></tr>
        <tr><td>Max climb slope</td><td>{format.slope(maxSlope)}</td></tr>
        <tr><td>Max DH slope</td><td>{format.slope(minSlope)} </td></tr>
    </tbody></table>
   </div>
  )
}
export const SummaryChart = styled(Summary)`
  ${sharedCss}
`

const Slope = function({className, empty,system, slope, distance, time, speed, percent,percentTime}){
  if (empty) return <div className={"slope-summary "+ className}>
    <NoData text="Hover over a slope type segment" />
  </div>
  let format = formatReact(system)
  return (
   <div className={"slope-summary "+ className}>
    <table >
	  <caption>{slopesDesc(slope)}</caption>
      <tbody>
	    <tr><td>Slope</td><td>{slopesDesc(slope)}</td></tr>
        <tr><td>Distance</td><td>{format.distance(distance)}</td></tr>
        <tr><td>% of distance</td><td>{format.percent(percent)}</td></tr>
        <tr><td>Time</td><td>{time ? format.time(time) : ' - '}</td></tr>
        <tr><td>Speed</td><td>{speed ? format.speed(speed) : ' - '}</td></tr>
        <tr><td>% of time</td><td>{percentTime? format.percent(percentTime):'-'}</td></tr>
      </tbody>
    </table>
   </div>
  )
}
export const SlopeChart = styled(Slope)`
  ${sharedCss}
`


const Params = function({className,system, values, toChange}){
  let weightUnit = system == IMPERIAL ? 'lbs' : 'kg'

  let cb = function(e){
    toChange({ [e.target.name]: e.target.value})
  }

  return (
   <div className={"params " +className}  >
    <table >
      <caption>Parameters</caption>
      <tbody>
      <tr><td>Power</td><td>
        <input className={values[POWER]==''?'wrong':''} value={values[POWER]} name={POWER} type="text" onChange={cb}></input>
        <span className="unit">W</span>
      </td></tr>
      <tr><td>Bike weight</td><td>
          <input className={values[BIKE_WEIGHT]==''?'wrong':''} value={values[BIKE_WEIGHT]} name={BIKE_WEIGHT} type="text" onChange={cb}></input>
        <span className="unit">{weightUnit}</span>
      </td></tr>
      <tr><td>Rider weight</td><td>
          <input className={values[RIDER_WEIGHT]==''?'wrong':''} value={values[RIDER_WEIGHT]} name={RIDER_WEIGHT} type="text" onChange={cb}></input>
        <span className="unit">{weightUnit}</span>
      </td></tr>
      <tr><td>Load weight</td><td>
          <input className={values[LOAD_WEIGHT]==''?'wrong':''} value={values[LOAD_WEIGHT]} name={LOAD_WEIGHT} type="text" onChange={cb}></input>
        <span className="unit">{weightUnit}</span>
      </td></tr>
      <tr><td>Tyres</td><td>
        <select value={values[TYRES]} name={TYRES} onChange={cb}>
          <option value={ROAD}>Road</option>
          <option value={HYBRID}>Hybrid</option>
          <option value={MTB}>MTB</option>
        </select>
      </td></tr>
      <tr><td>Position</td><td>
        <select value={values[POSITION]} name={POSITION} onChange={cb}>
          <option value={AERO}>Aerobars</option>
          <option value={DROPS}>Drops</option>
          <option value={ENDS}>Ends</option>
        </select>
      </td></tr>
      <tr><td>Road surface</td><td>
        <select value={values[ROAD_SURFACE]} name={ROAD_SURFACE} onChange={cb}>
          <option value={TARMAC}>Tarmac</option>
          <option value={GRAVEL}>Gravel</option>
          <option value={OFFROAD}>Offroad</option>
        </select>
      </td></tr>
      </tbody>
    </table>
	</div>
  )
}
export const ParamsChart =styled(Params)`
  ${sharedCss}
  
  input,select{
	  width:5em;
	  margin: auto 0.2em;
  }
  input.wrong{
	  background-color: rgb(245,232,233);
  }
`

const Options = function({className,system,onChange}){
  let cb = function(e){
    if (e.target.checked && e.target.value != system) onChange(e.target.value)
  }
  return(
  <div className={'options ' +className} >
    <table ><tbody>
    <tr><td>
      <label><input value={METRIC} checked={system == METRIC} name="SYSTEM" type="radio" onChange={cb}></input>Metric<span className='mark' /></label>
      <label><input value={IMPERIAL} checked={system == IMPERIAL} name="SYSTEM" type="radio" onChange={cb} ></input>Imperial<span className='mark' /></label>
    </td></tr>
    </tbody></table>
  </div>
  )
}
export const OptionsChart = styled(Options)`
  ${sharedCss}
  text-align: right;
  label{
	  margin: 0 1.5em;
  }
 
  label {
    display: inline-block;
    position: relative;
    
    cursor: pointer;
    
}

  input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
}

.mark {
    position: absolute;
    top: -3px;
    left: -30px;
    height: 25px;
    width: 25px;
    background-color: ${p=>p.theme.medium};
    border-radius: 50%;
	opacity:0.5;
}


label input:checked ~ .mark {
    background-color: ${p=>p.theme.contrast};
	opacity:1;
}

.mark:after {
    content: "";
    position: absolute;
    display: block;
}

 input:checked ~ .mark:after {
    display: block;
}

label .mark:after {
 	top: 9px;
	left: 9px;
	width: 8px;
	height: 8px;
	border-radius: 50%;
	background: ${props=>props.theme.light};
}
  
 
`
/*const Tooltip = function ({ className, system, offset, offsetTime, slope, ele, speed }){
  let format = formatReact(system)
  return <div className={className}>
    <div>{format.distance(offset)}</div>
    <div>{format.time(offsetTime)}</div>
    <div>{format.elevation(ele)}</div>
    <div>{format.slope(slope)}</div>
    <div>{format.speed(speed)}</div>
  </div>
}
export const TooltipTable = styled(Tooltip) `

`
*/