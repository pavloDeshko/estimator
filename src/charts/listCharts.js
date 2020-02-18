import React from 'react'
import styled,{css} from 'styled-components'
import {formatReact} from '../utils.js'

const listCss = css``
const List = function({className,system, tracks, active, working,toAdd, itemCbacks}){
  return (
    <div className={"track-list "+className}>
      {tracks.length<1 ? <div className="no-data">No tracks yet, add one</div>:
        <ul>
          {tracks.map(track => <Item key={track.id} active={active==track.id}
            format={formatReact(system)} {...{working}} {...track} {...itemCbacks}
          />)}
        </ul>
      }
      <label className={(working?'off ':'')+"add-button"}>
        <input type="file" onChange={e => toAdd(e.target.files)} 
          accept='.gpx' disabled={working}></input>
        Choose GPX file...
      </label>
    </div>
  )
}

function Item({format,active,id,filename,name,reversed,distance,working,toSelect,toRemove,toReverse}){
  return (
    <li className={'item'+(active?' active':'')} key={id} onClick={()=>toSelect(id)}>
	  <span className='file'>File: </span>
      <span className='filename'>{filename+' '}</span>
      {name ? <span className='name'>{reversed ? <span className='reversed'>Reversed: </span> : ''}{name+' '}</span> : '-'}   
      <span className='length'>{format.distance(distance)}</span> 
      <input type="button" className="reverse" value={'Reverse'} disabled={working}
        onClick={(e)=>{e.stopPropagation();toReverse(id)}}></input>
      <input type="button" className="remove" value={'Remove'} disabled={working}
        onClick={(e) => {e.stopPropagation(); toRemove(id)}}></input>
    </li>
  )
}

export const TracksChart = styled(List) `
  height:100%;
  text-align:center;
  
  ul{ 
	  padding:0 0.5em;
	  max-height:45%;
	  overflow-y:scroll;
	  list-style:none;
	  text-align:left;
	  margin: 0.5em 1em 0.5em 1em;
  }
  .item .name{
	  margin: auto 1.5em
  }
  .item{
	  border-style: solid;
	  border-width: 0px 0px 1px 0px;
	  border-color: ${props=>props.theme.dark};
	  padding: 0 0.5em
  }
  .item:first-child{
	  border-top-width: 1px;
  }
  .item.active{
	  background-color:${props=>props.theme.medium};
	  color: white;
  }
  .file, .reversed {
	  font-weight: bold;
  }
  .length{
	  font-weight: bold;
	  font-style: italic;
  }
  .filename{
	  font-style: italic;
  }
  .item input{
	 float:right;
	 border:0;
	 text-decoration: underline;
	 color: ${p=>p.theme.contrast};
	 background-color: rgba(0,0,0,0.0);
	 font-size:1em;
	 cursor: pointer;
  }
  
  .add-button input {
	width: 0.1px;
	height: 0.1px;
	opacity: 0;
	overflow: hidden;
	position: absolute;
	z-index: -1;
  }
  .add-button{
    font-size: 1.1em;
    font-weight: 700;
    color: white;
    background-color: ${props=>props.theme.contrast};
    display: inline-block;
	cursor: pointer;
	margin: 5px auto;
	padding: 0.8em;
	padding-bottom: 0.5em;
  }
  .add-button.off{
	  opacity:0.3;
  }
  div.no-data{
	  padding-top:1em;
	  padding-bottom:1em;
  }
  
`
