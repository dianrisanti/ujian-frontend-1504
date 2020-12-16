import React from 'react'
import { Link } from 'react-router-dom'
import {
    Nav,
    Navbar,
    Dropdown,
    Badge,
    Button,
    Popover,
    OverlayTrigger
} from 'react-bootstrap'

import { connect } from 'react-redux'

import { logout } from '../action'

class Navigation extends React.Component{
    logoutHandler = () => {
        this.props.logout()
        localStorage.removeItem('email')
    }

    render(){
        return(
            <Navbar expand="lg" fixed="top" style={styles.navbar}>
                <Navbar.Brand>
                    <strong style={{color: "white", fontSize: "30px", fontFamily: "Patrick Hand"}}>Shoes Shop</strong>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link as={Link} to='/' style={{color: "white", fontFamily: "Dosis"}}>Home</Nav.Link>
                    </Nav>
                    <div style={{display: "flex", width: "22%", justifyContent: "space-between"}}>
                        <Nav>
                            {
                                this.props.cart
                                ?
                                <OverlayTrigger
                                    trigger="hover"
                                    key={'bottom'}
                                    placement={'bottom'}
                                    overlay={
                                        <Popover id={`popover-positioned-${'bottom'}`}>
                                            <Popover.Title as="h3">Your Cart: {this.props.cart.length}</Popover.Title>
                                            <Popover.Content>
                                                {
                                                    this.props.cart.map((item, index) => {
                                                        return(
                                                            <div key={index} style={{display: "flex", justifyContent: "space-between"}}>
                                                                <div>
                                                                    <img src={item.image} alt={item.name} style={{width: "80px", height: "80px"}}/>
                                                                </div>
                                                                <div style={{marginLeft: "7px"}}>
                                                                    <p>{item.name}</p>
                                                                    <p>Size: {item.size}, {item.qty}pcs</p>
                                                                </div>
                                                                <div>
                                                                    <h6>IDR. {item.totalPrice.toLocaleString()}</h6>
                                                                </div>
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </Popover.Content>
                                        </Popover>
                                    }
                                    >
                                    <Button as={Link} to='/cart' style={{backgroundColor: "#2b2d42", fontFamily: "Dosis"}} >
                                        <i className="fas fa-shopping-cart"></i> <Badge variant="light">{this.props.cart.length ? this.props.cart.length : []}</Badge>
                                    </Button>
                                </OverlayTrigger>
                                :
                                <Button as={Link} to='/cart' style={{backgroundColor: "#2b2d42", fontFamily: "Dosis"}} >
                                        <i className="fas fa-shopping-cart"></i>
                                </Button>
                            }
                        </Nav>
                        <Dropdown style={{marginRight: "4%"}}>
                            <Dropdown.Toggle style={{backgroundColor: "#2b2d42", fontFamily: "Dosis"}} id="dropdown-basic">
                                {this.props.email ? <i className="far fa-smile"> {this.props.email} </i> : <i className="fas fa-user"> LOG IN</i>}
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                {
                                    this.props.email
                                    ?
                                    <div>
                                        <Dropdown.Item onClick={this.logoutHandler}>Logout</Dropdown.Item>
                                        <Dropdown.Item as={Link} to='/history'>Order History</Dropdown.Item>
                                    </div>
                                    :
                                    <Dropdown.Item as={Link} to='/login'>Login</Dropdown.Item>
                                }
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                </Navbar.Collapse>
            </Navbar>
        )
    }
}

const styles = {
    navbar: {
        height: "4rem",
        backgroundColor: "#4a4e69",
        display: "flex",
        justifyContent: "space-between",
        padding: "0 20px"
    }
}

const mapStateToProps = (state) => {
    return{
        id: state.user.id,
        email: state.user.email,
        cart: state.user.cart
    }
}

export default connect(mapStateToProps, { logout })(Navigation)