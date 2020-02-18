import React from 'react'
import {connect} from 'react-redux'
import {extract,forEach} from './utils.js'
import styled ,{ThemeProvider,injectGlobal} from 'styled-components'
import {createSelector as selector} from 'reselect'

import {TracksChart} from './charts/listCharts.js'
import {SummaryChart,SlopeChart,ParamsChart,OptionsChart} from './charts/tableCharts.js'
import {PieChart,PolarChart} from './charts/pieCharts.js'
import {DistanceGraphChart,TimeGraphChart} from './charts/graphCharts.js'

import {SLOPE_TYPES,DOWN} from './consts.js'
import {Load,Remove,Reverse,Activate,SelectSlope,Estimate,Params,ToogleSystem} from './actions.js'

const pullWorking = state => state.ui.isWorking

export const Tracks = connect(
  state=>({
    system: state.ui.system,
    tracks: state.tracksView.list.map(id=>state.tracks[id]),
    active: state.tracksView.active,
    working: pullWorking(state)
  }),
  dispatch=>({
    toAdd: files=>dispatch( Load(files)),
    itemCbacks:{
      toSelect: id=>dispatch( Activate(id)),
      toRemove: id=>dispatch( Remove(id)),
      toReverse: id =>dispatch( Reverse(id))
    }
  })
)(TracksChart)

export const Summary = connect(
  state=>{
    let id = state.tracksView.active
    if(!id) return {empty:true}
    return{
      system:state.ui.system,
      ...extract(state.tracks[id],'distance','gain','loss','maxSlope','minSlope'),
      ...state.results[id] ? extract(state.results[id],'time','speed'):{}
    }
    
  }
)(SummaryChart)

//{system, slope, distance, speed, percent}
export const Slope = connect(
  state=>{
    let id = state.tracksView.active
    let slope = state.ui.slope
    if(!slope || !id) return{empty:true}
    return {
      slope,
      system: state.ui.system,
      ...extract(state.tracks[id].bins[slope],'distance','percent'),
      ...state.results[id] ? 
        extract(state.results[id].bins[slope], 'speed', 'time', 'percentTime') : {}
    }
  }
)(SlopeChart)


const pullSystem = state=>state.ui.system
const pullTrack = state=>state.tracks[state.tracksView.active]

const getDistanceGraphData = selector([pullSystem,pullTrack], (system,track)=>{
  return track ? {
    system,
    ...extract(track, ['distance', 'len'], 'min', 'max', 'points', 'slopes', 'breaks')
  }: null
})

export const DistanceGraph = connect(
  state => ({ data: getDistanceGraphData(state), selected: state.ui.slope})
)(DistanceGraphChart)

const pullResult = state=>state.results[state.tracksView.active]
const getTimeGraphData = selector([pullSystem,pullTrack,pullResult],(system,track,result)=>{
  return result ?{
    system,
    ...extract(track, 'min', 'max'),
    ...extract(result, ['time', 'len'], 'points', 'slopes', 'breaks')
  }:null
})
export const TimeGraph = connect(
  state=>({data: getTimeGraphData(state), selected:state.ui.slope})
)(TimeGraphChart)


const getDistancePieData = selector([pullSystem,pullTrack],(system,track)=>{
  return track ? {
    system,
    segments: SLOPE_TYPES.map(slope => track.bins[slope])
  }: null
})
export const DistancePie = connect(
  state=>({data: getDistancePieData(state), selected: state.ui.slope}),
  dispatch=>({
    toSelectSlope: id=>dispatch( SelectSlope(id))
  })
)(PieChart)

const getTimePieData = selector([pullSystem,pullTrack,pullResult],(system,track,result)=>{
  return result ? {
    system,
    segments: SLOPE_TYPES.map(slope => result.bins[slope])
  }:null
})
export const TimePie = connect(
  state =>({ data: getTimePieData(state), selected: state.ui.slope}),
  dispatch => ({
    toSelectSlope: id => dispatch( SelectSlope(id))})
)(PolarChart)

export const Parameters = connect(
  state=>({
    system: state.ui.system,
    values: state.ui.params,
  }),
  dispatch=>({
    toChange: change=>{
      dispatch( Params(change))}
  })
)(ParamsChart)

export const Options = connect(
  state=>({system: state.ui.system}),
  dispatch=>({onChange: system=>dispatch( ToogleSystem(system))})
)(OptionsChart)

const pullParams = state => state.ui.params
const pullActive = state => state.tracksView.active
const getAvail = selector(pullParams, pullActive, pullWorking, (params, active, working) => {
  return active && !working && !Object.values(params).includes('')
})
export const TheButton =styled(connect(
  state=>({avail: getAvail(state)}),
  dispatch => ({ onEstimate: e=>dispatch(Estimate())})
)(
  function ({ className,avail, onEstimate }) {
    return <div className={className}><input type="button" className={(avail ? 'on' : 'off' )} disabled={!avail}
      onClick={onEstimate} value="Estimate" ></input></div>
  }
))`
  
  text-align:center;
  input{
	font-size: 1.1em;
    font-weight: 700;
    color: white;
    background-color: ${props=>props.theme.contrast};
    display: inline-block;
	cursor: pointer;
	margin: 0.5em auto 1em
	padding: 0.8em;
	padding-bottom: 0.7em;  
	border: 0;
  }
  input.off{
	  opacity:0.3
  }
`

export const Status = connect(
  state=>({working:pullWorking(state),
          message: state.ui.message})
)(styled(function({className,working,message}){
  return <div className={'status '+className}>
    <span className="spinner">Working...</span>
    <span className='message'> {message} </span>
	<span className='hidden'>OK</span>
  </div>
}) `
  .hidden{
	  opacity: 0;
  }
  padding: 2px 1em 1px;
  overflow:hidden;
  .spinner{
    display:${props => props.working ? 'inline' : 'none'};
	float:left;
	font-style: italic;
  }
  .message{
	  float:left;
	  font-weight:bold;
  }
`)


const AppComponent = function({className}){
  return (
    <div className={className}>
      <div className="tracks-block block">
        <Tracks/>
      </div>
	  <div className='header-block block'>
	    <div className="logo"/>
		<Options />
	  </div>
      <div className="info-block block">
        <Summary />
          <DistancePie />
          <TimePie />
        <Slope />
      </div>

	  <div className="graphs-block block">
        <DistanceGraph />
        <TimeGraph />
      </div>
      <div className="params-block block">
        <Parameters />
        <TheButton />
      </div>
	  <div className="status-block block">
        <Status />
	  </div>
    </div>
  )
}

const theme = {
	dark:'rgb(32, 35, 42)',
	medium:'rgb(172, 190, 190)',
	light:'rgb(244, 244, 239)',
	contrast:'rgb(160, 29, 38)'
}


const AppUnprovided= styled(AppComponent)`
 background-color: ${props=>props.theme.medium};
 overflow:hidden;
 color:${props=>props.theme.dark};
 font-family: Helvetica, Arial, sans-serif;
 font-size: 16px;
 
*, *:before, *:after {
  box-sizing: border-box;
}
.block{
	box-shadow: 2px 1px 2px black
	background-color: ${props=>props.theme.light};
	border-width: 0px;
	margin: 0.5%;
	overflow:hidden;
	border-radius: 3px;
	
}


.tracks-block {
  height: 9em;
  width:79%;
  float:left;
}
.header-block{
  width:19%;
  float:right;
}
.info-block{
  width:99%;
  float:left;
}
.graphs-block{
  width:79%;
  float:left;
}
.params-block{
  width:19%;
  float:right;
}
.status-block{
	width:79%;
	float:left;
	margin-top: 0;
}

.info-block > *{
  width:20%;
  float:left;
  padding:0.5%;
}
.info-block .pie {
	width:30%;
	padding:2em 0 0 0 ;
}
.info-block table{
	width:100%;
}

.no-data{
	text-align:center;
	padding: 3em;
	margin: 0 auto;
	opacity:0.5;
	font-size:1.2em;
}


`
const App= function(){
	return <ThemeProvider theme={theme}><AppUnprovided/></ThemeProvider>
}
export default App

injectGlobal`
  body{
	  margin: 10px;
	  background-color: ${theme.medium};
  }
`