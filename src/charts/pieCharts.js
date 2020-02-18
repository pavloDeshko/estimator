import React from 'react'
import * as d3 from 'd3'
import { withFauxDOM } from 'react-faux-dom'
import styled, { css } from 'styled-components'
import { formatD3, slopesColors,slopesGrades} from '../utils.js'

//consts
const
  width = 600,
  padding = 30,
  paddingLarge=105,
  inner = 0,
  start = -Math.PI / 2,
  end = Math.PI / 2,
  corner = 3,
  pad = 0.01,
  labelsSpace = 20,
  labelsPointsDist= 5,
  labelsDist = 5,
  minForText = Math.PI / 10,
  textLift = '0.5em'

//derived
const
  outer = (width - paddingLarge * 2) / 2,
  height = outer+padding*2

let sharedCss = css`
  ${slopesColors('.arc', 'fill')}
  
  .segment{
    opacity: ${props=>props.selected?'0.1':'1'};
    }
  .segment${props => props.selected ? '.' +props.selected:''} {
    opacity: 1;
  }

  .arc-text {
    text-anchor: middle;
	font-size: 130%;
	text-shadow: 1px 1px white;
  }
  .label {
	  font-size: 120%;
  }
  .line{
    stroke-width: 2px;
    stroke: black;
    opacity: 0.5;
    fill:none;
  }
  &>div{
    width: 100%;
    height: 1px;
    padding-bottom: ${height / width * 100 + '%'};
    overflow: visible;
  }
`

let pieCss = css`
  ${sharedCss}
  
`
let polarCss = css`
  ${sharedCss}
  .full-arc{
    opacity: 0.1
  } 
`

//helpers
const middleAngle = function (d) {
  return (d.endAngle - d.startAngle) / 2 + d.startAngle
}

class Pie extends React.Component {
  componentDidMount() {
    this.renderD3()
  }
  /*shouldComponentUpdate(newProps) {
    if (this.props.data != newProps.data) this.renderD3()
    return this.props.chart != newProps.chart
  }*/
  componentDidUpdate(prevProps){
    //console.log('Pie updated, new prop is ',this.props.selected)
    if(prevProps.data != this.props.data) this.renderD3()
  }
  render() {
    //console.log('Pie render, selected: ', this.props.selected)
    let result = <div className={this.props.className+' pie'}>{this.props.chart}</div> ||
      (<div className={this.props.className + " no-data"} />)
    return result
  }
  renderD3(){
    //console.log('Pie d3 rerendered')
    let root = d3.select(this.props.connectFauxDOM('div', 'chart', true))
    //root.attr('class',this.props.className)
    this.drawD3(root,this.props.data,this.props.toSelectSlope)
  }
  drawD3(root,data,cb) {    
    if (!data) {
      root
        .append('div')
        .attr('class', "no-data")
        .text('Add track from a file, please')
      return
    }
    //spreads values betwee start and end
    function spread(arr, space=labelsSpace, start=-height, end=0) {
      start += space / 2
      end -= space / 2
      let result = []
      arr.forEach((pos, i) => {
        let min = start + i * space
        let max = end - (arr.length - (i + 1)) * space
        //limits.push([lower,higher])
        
        if (i != 0){
          let pillow = pos - result[i - 1] - space
          pos = pillow < 0 ? pos - (-pillow) : pos
        }

        if (pos < min)
          result.push(min)
        else if (pos > max)
          result.push(max)
        else
          result.push(pos)
      })
      return result
    }


    //pie data
    const format = formatD3(data.system)
    const pie = d3
      .pie()
      .value(d => d.distance)
      .sort(null)
      .startAngle(start)
      .endAngle(end)
      .padAngle(pad)
    let pieData = pie(data.segments)
    
    //arcs
    const arc = d3
      .arc()
      .innerRadius(inner)
      .outerRadius(outer)
      .cornerRadius(corner)
    const outerArc = d3
      .arc()
      .innerRadius(outer)
      .outerRadius(outer)
    const textArc = d3
      .arc()
      .outerRadius(outer)
      .innerRadius((outer-inner)/3 + inner)
    const labelsPointsArc = d3
      .arc()
      .innerRadius(outer+labelsPointsDist)
      .outerRadius(outer+labelsPointsDist)
 
    //add labels and label points to pieData 
    {
      let leftPoints =
        pieData.filter(d => middleAngle(d) < 0).map(d => labelsPointsArc.centroid(d))
      let rightPoints =
        pieData.filter(d => middleAngle(d) >= 0).map(d => labelsPointsArc.centroid(d))
      //console.log("raw points:",leftPoints,rightPoints)
      let leftLabels = spread(leftPoints.map(p=>p[1]).reverse()).reverse()
        .map((y,i)=>[-outer-labelsDist,y])
      let rightLabels = spread(rightPoints.map(p=>p[1]))
        .map((y,i)=>[outer+labelsDist,y])
      //console.log('labels', leftLabels,rightLabels)
      leftPoints.concat(rightPoints).forEach((p,i)=>{
        pieData[i].labelPoint = p
      })
      leftLabels.concat(rightLabels).forEach((p,i)=>{
        pieData[i].label = p
      })
    }
    //console.log('pieData:',pieData)
    //render container
    let container = root
      .append('svg')
        .attr('viewBox','0,0,'+[width,height])
        .attr('preserveAspectRatio', 'xMidYMin slice')
      .append('g')
        .attr('transform', 'translate(' +[width/2, height-padding] + ')')
        .attr('class', 'container')
    
    /*//render arc background
    container
      .append('path')
      .attr('d', d =>
        fullArcPreset()
      )
      .attr('class', 'arcs-background')
    */

    //render segments
    let segment = container
      .selectAll()
      .data(pieData)
      .enter()
      .append('g')
      .attr('class', d=>d.data.slopeType+' segment')
      .on('mouseenter',d=>cb(d.data.slopeType))
      .on('mouseleave',e=>cb(null))

    //render arcs
    segment
      .append('path')
      .attr('d', arc)
      .attr('class', d => d.data.slopeType+' arc')

    //render text
    segment
      .filter(d=>d.endAngle-d.startAngle>minForText)
      .append('text')
      .attr('transform', d => 'translate(' + textArc.centroid(d) + ')')
      .each(format.distance(d=>d.data.distance))
      .attr('dy', textLift)
      .attr('class','arc-text')
    
    //render lines
    segment
      .append('polyline')
      .attr('points', d=>[d.label,d.labelPoint,outerArc.centroid(d)])
      .attr('class', 'line')
    //render labels
    segment
      .append('text')
      .attr('transform', d => "translate(" + d.label +')')
      .text( d=>slopesGrades(d.data.slopeType))
      .attr('text-anchor', d=> middleAngle(d)>=0 ?'start':'end')
      .attr('class', 'label')
    /*
    //render extensions
    let exten = segment.append('g')
      .attr('class', 'exten')
    

    // render outer exent
    exten
      .append('path') 
      .attr('d', d =>
        arcPreset()
          .outerRadius(radius + 6)
          .innerRadius(radius - corner)(d)
      )
      .attr('class', d => d.slopeType+' outer-exten')
    
    //render big arc
    exten
      .append('path') 
      .attr('d', d =>
        fullArcPreset()
          .outerRadius(inner)
          .innerRadius(inner - 5)(d)
      )
      .attr('class', d => d.slopeType+' full-arc')
    
    //render inner bridge
    exten
      .append('path') 
      .attr('d', d =>
        arcPreset()
          .outerRadius(inner + corner)
          .innerRadius(inner - 5)(d)
      )
      .attr('class', d => d.slopeType+' inner-bridge')

    // render inner area
    exten
      .append('path') 
      .attr(
        'd',
        fullArcPreset()
          .outerRadius(inner - 4)
          .innerRadius(0)()
      )
      .attr('class', d => d.slopeType+' inner-area')
    */
  }
}

class Polar extends React.Component {
  componentDidMount() {
    this.renderD3()
  }
  componentDidUpdate(prevProps){
    if (this.props.data != prevProps.data) this.renderD3()
  }
  /*
  shouldComponentUpdate(newProps) {
    if (this.props.data != newProps.data) this.renderD3()
    return this.props.chart != newProps.chart
  }*/
  render() {
    let result = <div className={this.props.className+' pie'}>{this.props.chart}</div> ||
      (<div className={this.props.className+" no-data"} />)
    return result
  }
  renderD3(){
    let root = d3.select(this.props.connectFauxDOM('div', 'chart', true))
    this.drawD3(root,this.props.data,this.props.toSelectSlope)
  }
  drawD3(root,data,cb) {
    if (!data) {
      root
        .append('div')
        .attr('class', "no-data")
        .text('Analyse track to get information on time and speed')
      return
    }
    //helpers
    //time to radius scale
    const getRadius = function () {
      let innerArea = Math.pow(inner, 2)
      let area = d3
        .scaleLinear()
        .domain([0, d3.max(data.segments, d => d.time)])
        .range([0, Math.pow(outer, 2) - innerArea])
      return d => Math.sqrt(area(d.data.time) + innerArea)
    }()

    //polar pie
    
    const polar = d3
      .pie()
      .value(1)
      .sort(null)
      .startAngle(start)
      .endAngle(end)
      .padAngle(pad)
    
    //formatter
    const format = formatD3(data.system)

    //main arc
    const arc = d3.arc()
      .innerRadius(inner)
      .outerRadius(getRadius)
    //outer main arc
    const outerArc = d3.arc()
      .innerRadius(getRadius)
      .outerRadius(getRadius)
    //full transperent arc
    const fullArc = d3.arc()
      .outerRadius(outer)
      .innerRadius(inner)
      .cornerRadius(corner)
    // text arc
    const textArc = d3.arc()
      .outerRadius(outer)
      .innerRadius((outer - inner) / 3 + inner)
    //points arc
    const labelsPointsArc = d3.arc()
      .innerRadius(outer+labelsPointsDist)
      .outerRadius(outer+labelsPointsDist)

    //render container
    let container = root
      .append('svg')
      .attr('viewBox', '0,0,' + [width, height])
      .attr('preserveAspectRatio','xMidYMin slice')
      .append('g')
      .attr('transform', 'translate(' + [width / 2, height-padding] + ')')
      .attr('class', 'container')
    //render segment
    let segment = container
      .selectAll()
      .data(polar(data.segments))
      .enter()
      .append('g')
      .attr('class', d => d.data.slopeType + ' segment')
      .on('mouseenter', d => cb(d.data.slopeType))
      .on('mouseleave', e => cb(null))
    //full arc render
    segment
      .append('path')
      .attr('d', fullArc)
      .attr('class', d => d.data.slopeType+ ' arc full-arc')
    //full arc render
    segment
      .append('path')
      .attr('d', arc)
      .attr('class', d => d.data.slopeType+ ' arc')
    //text render
    segment
      .append('text')
      .attr('transform', d => 'translate(' + textArc.centroid(d) + ')')
      .each(format.time(d => d.data.time))
      .attr('dy', textLift)
      .attr('class', 'arc-text')

    //render lines
    segment
      .append('polyline')
      .attr('points', d =>{
        let point = labelsPointsArc.centroid(d)
        return [[middleAngle(d) >= 0 ? 
          outer+labelsDist : -outer-labelsDist ,point[1]], point, outerArc.centroid(d)]
      })
      .attr('class', 'line')

    //render labels
    segment
      .append('text')
      .attr('transform', d => 'translate('+
        [middleAngle(d) >= 0 ?
         outer + labelsDist : -outer - labelsDist, labelsPointsArc.centroid(d)[1]]
      +')'
      )
      .text(d => slopesGrades(d.data.slopeType))
      .attr('text-anchor', d => middleAngle(d) >= 0 ? 'start' : 'end')
      .attr('class', 'label')
  }
}
/*
const sharedAttrs = {
  width : 500,
  padding : 50,
  inner : 0,
  start : -Math.PI / 2,
  end : Math.PI / 2,
  corner : 3,
  pad : 0.01,
  labelsSpace : 20,
  labelsPointsDist : 5,
  labelsDist : 10,
  minForText : Math.PI / 10,
  textLift : '0.5em'
}
//derived
Object.assign({
  height : sharedAttrs.width / 2,
  outer: (sharedAttrs.swidth - sharedAttrs.padding * 2) / 2
},sharedAttrs)
*/


export const PieChart = withFauxDOM(styled(Pie)`${pieCss}`)
export const PolarChart = withFauxDOM(styled(Polar) `${polarCss}`)