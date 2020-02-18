import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'

import appReducer from './reducer'
import { payloadThunk as thunk, logger } from './utils'

import App from './components.js'

let store = createStore(appReducer, applyMiddleware(thunk))

/*eslint import/first:0*/


render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
/*render(
  <Provider store={store}>
    <div>
      <PieChart data={pieData} active='UP'/>
      <PolarChart data={pieData} active='DOWN'/>
      <DistanceGraph data={graphData} active='2' />
      <TimeGraph data = {graphData} />
    </div>
  </Provider>,
  document.getElementById('root')
)*/
