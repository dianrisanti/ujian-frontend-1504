import React from 'react'
import {
    InputGroup,
    Form,
    FormControl,
    Button,
    Modal
} from 'react-bootstrap'

import Axios from 'axios'

import {Redirect} from 'react-router-dom'
import {connect} from 'react-redux'
import {login} from '../action'

class Login extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            visible: false,
            emailInvalid: false,
            passInvalid: false,
            loginError: [false, ""],
            toHome: false
        }
    }

    closeLoginError = () => this.setState({loginError: [false, ""]})

    emailValid = (e) => {
        let email = e.target.value
        let regex = /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if(!regex.test(email)) return this.setState({emailInvalid: [true, "*Email invalid"]})
        this.setState({ emailInvalid: [false, ""] })
    }

    passValid = (e) => {
        let password = e.target.value
        let num = /[0-9]/

        if(!num.test(password) || password.length < 6) return this.setState({passInvalid: [true, "*Must include number, and min 6 chars"]})
        this.setState({ passInvalid: [false, ""]})
    }

    loginHandler = () => {
        let email = this.refs.email.value
        let password = this.refs.password.value

        if(!email || !password) return this.setState({loginError: [true, "Username or password isn't complete"]})

        Axios.get(`http://localhost:2000/users?email=${email}&password=${password}`)
        .then((res2) => {
            if(res2.data.length !== 0){
                this.props.login(res2.data[0])
                this.setState({toHome: true})
            }
            if(res2.data.length === 0){
                Axios.post('http://localhost:2000/users', {
                    email,
                    password,
                    cart: []
                })
                .then((res3) => {
                    this.props.login(res3.data[0])
                    localStorage.email = email
                    this.setState({toHome: true})
                })
                .catch((err) => console.log(err))
            }
        })
        .catch((err2) => console.log(err2))

        this.refs.email.value = ""
        this.refs.password.value = ""
    }

    render() {
        const {visible, emailInvalid, passInvalid, toHome} = this.state
        if(toHome) return <Redirect to='/' />
        return(
            <div style={styles.container}>
                <div style={styles.center}>
                    <div style={{marginBottom: "20px"}}>
                        <h1>Login</h1>
                    </div>
                    <div>
                        <InputGroup className="mb-3">
                            <InputGroup.Prepend>
                                <InputGroup.Text id="basic-addon1">
                                    <i className="fas fa-user"></i>
                                </InputGroup.Text>
                                </InputGroup.Prepend>
                            <FormControl
                                placeholder="Email"
                                aria-label="Email"
                                aria-describedby="basic-addon1"
                                ref="email"
                                onChange={(e) => this.emailValid(e)}
                            />
                        </InputGroup>
                        <Form.Text className="mb-3" style={{color: "red"}}>
                            {emailInvalid[1]}
                        </Form.Text>

                        <InputGroup className="mb-3">
                            <InputGroup.Prepend style={{cursor: 'pointer', width: '40px'}} onClick={() => this.setState({visible: !visible})}>
                                <InputGroup.Text id="basic-addon1">
                                    {visible ? <i className="fas fa-eye"></i> : <i className="fas fa-eye-slash"></i> }
                                </InputGroup.Text>
                                </InputGroup.Prepend>
                            <FormControl
                                type={visible ? "text" : "password"}
                                placeholder="Password"
                                aria-label="Password"
                                aria-describedby="basic-addon1"
                                ref="password"
                                onChange={(e) => this.passValid(e)}
                            />
                        </InputGroup>
                        <Form.Text className="mb-3" style={{color: "red"}}>
                            {passInvalid[1]}
                        </Form.Text>
                        
                    </div>
                    
                    <Button variant="primary" onClick={this.loginHandler} style={{width: "100px"}}>Login <i className="fas fa-sign-in-alt"></i></Button>{' '}
                    
                    <Modal show={this.state.loginError[0]} onHide={this.closeLoginError}>
                        <Modal.Header closeButton>
                            <Modal.Title>Ooooops⚠</Modal.Title>
                        </Modal.Header>
                            <Modal.Body>{this.state.loginError[1]}</Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={this.closeLoginError}>
                                Close
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            </div>
        )
    }
}

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        height: '100vh',
        background: 'url(https://images.unsplash.com/photo-1480604031858-87b1458cb5b5?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80) no-repeat center',
        backgroundSize: '100vw 100vh'
    },
    center: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '150px',
        padding: '10px 30px',
        width: '350px',
        height: '50vh',
        borderRadius: "10px",
        backgroundColor: 'rgba(255, 255, 255, .6)'
    }
}

const mapStateToProps = (state) => {
    return{
        username: state.user.username
    }
}

export default connect(mapStateToProps, {login})(Login)