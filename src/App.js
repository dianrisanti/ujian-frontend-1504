import React from 'react'
import { Route, Switch } from 'react-router-dom'
import Axios from 'axios'
import { connect } from 'react-redux'
import { login } from './action'

import Navigation from './component/navigations'

import Home from './pages/home'
import Login from './pages/login'
import Cart from './pages/cart'
import History from './pages/history'

class App extends React.Component{
    componentDidMount(){
        Axios.get(`http://localhost:2000/users?email=${localStorage.email}`)
        .then((res) => {
            this.props.login(res.data[0])
        })
        .catch((err) => console.log(err))
    }

    render(){
        console.log(this.props.role)
        return(
            <div>
                <Navigation/>
                <Switch>
                    <Route path='/' component={Home} exact/>
                    <Route path='/login' component={Login}/>
                    <Route path='/cart' component={Cart}/>
                    <Route path='/history' component={History}/>
                </Switch>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return{
        email: state.user.email,
    }
}

export default connect(mapStateToProps, {login})(App)