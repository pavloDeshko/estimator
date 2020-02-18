import React from 'react'
import * as d3 from 'd3'
import { withFauxDOM } from 'react-faux-dom'
import styled, { css } from 'styled-components'
import { default as q } from "js-quantities"
import {formatD3, slopesColors} from '../utils.js'
import {IMPERIAL, METRIC, BY_DISTANCE, BY_TIME} from '../consts.js'

//consts
const
  width = 1000,
  height = 130,
  marginBottom= 25,
  marginLeft=50,
  margin= 15,
  legendDist = 15
//derived
const
  innerWidth = width-(margin+marginLeft),
  innerHeight = height-(margin+marginBottom)

const graphCss = css`
  ${slopesColors('.slope', 'fill')}
  
  ${props => props.selected ? `
    .slope{
      opacity: 0;
    }
    ${'.slope.' + props.selected}{
      opacity: 1;
    }
  `: ``}

  .clip {
    fill: ${p=>p.theme.light};
  }
  .back{
	  fill: white;
  }
  .line{
    fill: none;
    stroke: ${p=>p.theme.dark};
    stroke-width: 1;
  }
  .break{
    stroke-width: 1;
    stroke: ${p=>p.theme.contrast};
    fill: none;
  }
  .xAxis{
	  font-size:80%
  }
  width: 100%;
  height: 1px;
  padding-bottom: ${() => height / width * 100 + '%'};
  overflow: visible;
`

class Graph extends React.Component {
  componentDidMount() {
    this.renderD3()
  }
  componentDidUpdate(prevProps) {
    //console.log('Graph updated: ', this.props.selected)
    if (this.props.data != prevProps.data)
      this.renderD3()
  }
  shouldComponentUpdate(nextProps){
    if(nextProps.data != this.props.data || nextProps.chart != this.props.chart)
	  return true
	else 
		return false
  }
  render() {
    let result = this.props.chart ?  this.props.chart:
      (<div className="no-data"/>)
    return result
  }
  renderD3(){
    let root = d3.select(this.props.connectFauxDOM('div', 'chart', true))
    this.drawD3(root, this.props.data, this.props.type)
  }

  drawD3(root, data,graphType) {
    if(!data){
      root
        .append('div')
        .attr('class',"no-data")
        .text(graphType==BY_DISTANCE?'Add track, please':'Analyze added track')
      return
    }
    //helpers
    function translate(x, y) {
      return 'translate(' + x + ',' + y + ')'
    }
    const toMiles = q.swiftConverter('km','mile')
    const toKm = q.swiftConverter('miles','km')
    const toFeets = q.swiftConverter('m','ft')
    const toMeters = q.swiftConverter('ft','m')

    //scales
	let imperial = data.system == IMPERIAL
    let impX, x = d3
      .scaleLinear()
      .domain([0, data.len])
      .range([0, innerWidth])
    if (imperial && (graphType==BY_DISTANCE)){
      impX = x
        .copy()
        .domain(toMiles(x.domain()))
    }

    let impY, y = d3
      .scaleLinear()
      .domain([data.min, data.max])
      .range([innerHeight, 0])
    if (imperial){
      impY = y
        .copy()
        .domain(toFeets(y.domain()))
        .nice()
       y = y.domain(toMeters(impY.domain()))
    }else{
      y = y.nice()
    }
    //formatter
    let format = formatD3(data.system)
    
    //axises
    const customizeAxis = function(axis, textFormatter){
      return g => {
        g.call(axis)
        g.selectAll('.tick text')
          .data(axis.scale().ticks())
          .text(null)
          .each(textFormatter)
      }
    }
    
    let yAxis = customizeAxis(
	
      d3.axisLeft(imperial? impY : y).ticks(5),
      format.elevation(imperial ? d=>toMeters(d) : d=>d)
    )
    let xAxis = customizeAxis(
      d3.axisBottom(imperial &&  graphType == BY_DISTANCE ? impX: x),
      graphType == BY_DISTANCE ? format.distance(imperial?d=>toKm(d):d=>d)
	    : format.time()
    )
    
    //axis legends
    let yLegend = 'elevation'
    let xLegend = graphType == BY_DISTANCE ? 'distance': 'time'

    //clipping shape
    let clip = d3
      .area()
      .x(d => x(d.offset))
      .y0(d => y(d.ele))
      .y1(-1)(data.points)
    
	let back = d3
	  .area()
	  .x(d => x(d.offset))
      .y0(innerHeight)
      .y1(d => y(d.ele))(data.points)
	  
    //line
    let line = d3
      .line()
      .x(d => x(d.offset))
      .y(d => y(d.ele))(data.points)
    
    //container render 
    let svg = root
      .append('svg')
      .attr('viewBox',[0,0,width,height])
      .attr('preserveAspectRatio', 'xMidYMin slice')
    let container = svg
      .append('g')
      .attr('transform', translate(marginLeft,margin))
      .attr('class','container')
    //axises render
    container
      .append('g')
      .call(yAxis)
	  .attr('transform', translate(-1, 0))
      .attr('class', 'yAxis')
    container
      .append('g')
      .call(xAxis)
      .attr('transform', translate(0, innerHeight))
      .attr('class', 'xAxis')
    
    //legends render
    /*container
      .append('g')
        .attr('class','y-legend legend')
      .append('text')
        .text(yLegend)
        .attr('text-anchor','middle')
        .attr('transform',translate(-marginLarge+legendDist,innerHeight/2)+' rotate(270)')

    container
      .append('g')
      .attr('class', 'x-legend legend')
      .append('text')
      .text(xLegend)
      .attr('text-anchor','middle')
      .attr('transform', translate(innerWidth/2,innerHeight+legendDist))
      .attr('dy','1em')*/
	//background render
	container
      .append('path')
	  .attr('d',back)
	  .attr('class','back')
      
    //slopes render
    container
      .selectAll('rect')
      .data(data.slopes)
      .enter()
      .append('rect')
      .attr('x', d => x(d.start))
      .attr('y', 0)
      .attr('width', d => x(d.end) - x(d.start))
      .attr('height', innerHeight)
      .attr('class', (d) => d.slopeType+' slope')
    
    //clip render
    container
      .append('path')
      .attr('d', clip)
      .attr('class', 'clip')
    
    //line render
    container
      .append('path')
      .attr('d', line)
      .attr('class', 'line')
    
    //segmets breaks render
	let nToOffset = d=>x(data.points[d].offset)
    container.selectAll('.break')
      .data(data.breaks)
      .enter()
      .append('line')
      .attr('x1',nToOffset)
      .attr('y1', 0)
      .attr('x2', nToOffset)
      .attr('y2', innerHeight+margin)
      .attr('class','break')
  }
}
const WrappedGraph = props=>(<div className={props.className}><Graph {...props}/></div>)
export const DistanceGraphChart =  
  withFauxDOM(styled(WrappedGraph).attrs({ type: BY_DISTANCE }) `${graphCss}`)
export const TimeGraphChart = 
  withFauxDOM(styled(WrappedGraph).attrs({ type: BY_TIME })`${graphCss}`)