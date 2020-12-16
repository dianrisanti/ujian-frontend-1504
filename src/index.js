import React from 'react'
import ReactDOM from 'react-dom'

import 'bootstrap/dist/css/bootstrap.min.css';

import {BrowserRouter} from 'react-router-dom'

import {createStore} from 'redux'

import {Provider} from 'react-redux'

import allReducers from './reducer'

import App from './app'

const globalState = createStore(allReducers)

globalState.subscribe(() => console.log("Global state: ", globalState.getState()))

ReactDOM.render(
    <Provider store={globalState}>
        <BrowserRouter>
            <App/>
        </BrowserRouter>
    </Provider>,
    document.getElementById('root')
)