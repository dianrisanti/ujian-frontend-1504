import React from 'react'
import Axios from 'axios'
import { connect } from 'react-redux'
import {
    Redirect,
    Link,
} from 'react-router-dom'

import { login } from '../action'

import {
    Table,
    Button,
    FormControl,
    Modal
} from 'react-bootstrap'

class Cart extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            products: [],
            selectedIndex: null,
            productId: "",
            qty: 0,
            checkQty: false,
            cartEmp: false,
            showConfirmation: false,
            toHistory: false
        }
    }

    componentDidMount(){
        Axios.get(`http://localhost:2000/products`)
        .then((res) => this.setState({products: res.data}))
        .catch((err) => console.log(err))
    }

    deleteItemHandler = (index) => {
        let tempCart = this.props.cart

        // console.log(tempCart)
        tempCart.splice(index, 1)

        Axios.patch(`http://localhost:2000/users/${this.props.id}`, {cart: tempCart})
        .then((res) => {
            // console.log(res.data)

            Axios.get(`http://localhost:2000/users/${this.props.id}`)
            .then((res2) => this.props.login(res2.data))
            .catch((err2) => console.log(err2))
        })
        .catch((err) => console.log(err))
    }

    editItemHandler = (index, qty, productId) => {
        // console.log(`edit clicked index: ${index} qty: ${qty} name: ${name}`)
        this.setState({selectedIndex: index, qty: qty, productId: productId})
    }

    changeQty = (e) => {
        this.setState({qty: e.target.value})
    }

    minusHandler = () => {
        if(this.state.qty <= 0) return

        this.setState({qty: this.state.qty - 1})
    }

    plusHandler = () => {
       const { products, productId, qty } = this.state
       
       const product = products.filter(item => item.id === productId)
    //    console.log(product[0].stock)

       if(qty >= product[0].stock) return this.setState({checkQty: true})
       this.setState({qty: qty + 1})
    }

    doneHandler = (index) => {
        // console.log("done clicked " + index)
        const { products, productId, qty } = this.state
       
        const product = products.filter(item => item.id === productId)
        if(qty >= product[0].stock) return this.setState({checkQty: true})

        let tempProduct = this.props.cart[index]
        tempProduct.qty = parseInt(this.state.qty)
        tempProduct.totalPrice = parseInt(this.state.qty) * this.props.cart[index].price

        // menambahkan qty baru ke dalam array cart
        let tempCart = this.props.cart
        tempCart.splice(index, 1, tempProduct)
        console.log(tempCart)

        // kirim perubahan ke database
        Axios.patch(`http://localhost:2000/users/${this.props.id}`, {cart: tempCart})
        .then((res) => {
            // console.log(res.data)

            // update data di globalstate
            Axios.get(`http://localhost:2000/users/${this.props.id}`)
            .then((res2) => this.props.login(res2.data))
            .catch((err2) => console.log(err2))

            this.setState({selectedIndex: null})
        })
        .catch((err) => console.log(err))
    }

    countTotal = () => {
        let counter = 0
        this.props.cart.map(item => counter += item.totalPrice)
        return counter
    }

    checkoutHandler = () => {
        // console.log("button checkout")
        
        if(this.props.cart.length === 0) return this.setState({cartEmp: true})
        this.setState({showConfirmation: true})
    }

    userConfirmHandler = () => {
        // console.log(this.props.cart[0].qty)
        let tempCart = this.props.cart
        // console.log(tempCart)
        let tempProduct = this.state.products
        // console.log(tempProduct[0].stock)

        let updateProduct = []
        for(let cart of tempCart){
            for(let products of tempProduct){
                if(cart.id === products.id) updateProduct.push(products)
            }
        }
        // console.log(updateProduct)
        
        let updateStock = []
        for(let product of updateProduct){
            for(let cart of tempCart){
                if(product.id === cart.id){
                    let update = {
                        id: product.id,
                        updatedStock: product.stock - cart.qty  
                    }
                    updateStock.push(update)
                } 
            }
        }
        // console.log(updateStock)

        for(let update of updateStock){
            let tempStock = update.updatedStock
            Axios.patch(`http://localhost:2000/products/${update.id}`, {stock: tempStock})
                .then((res) => {
                    console.log(res.data)
                })
                .catch((err) => console.log(err))
        }

        let orderTotal = this.countTotal()
        let history = {
            userID: this.props.id,
            email: this.props.email,
            date: new Date().toLocaleString(),
            total: orderTotal,
            product: this.props.cart,
            payment: "belum bayar"
        }
        
        Axios.post(`http://localhost:2000/history`, history)
        .then((res) => {
            console.log(res.data)
            
            // clear cart
            Axios.patch(`http://localhost:2000/users/${this.props.id}`, {cart: []})
            .then((res) => {
                console.log(res.data)
                
                // update redux
                Axios.get(`http://localhost:2000/users/${this.props.id}`)
                .then((res) => {
                    console.log(res.data)
                    this.props.login(res.data)
                    this.setState({reqPayment: false, toHistory: true})
                })
                .catch((err) => console.log(err))
            })
            .catch((err) => console.log(err))
        })
        .catch((err) => console.log(err))

        console.log("berhasil add history?")
    }

    renderThead = () => {
        return(
            <thead style={{textAlign: "center"}}>
                <tr>
                    <th>No</th>
                    <th>Product</th>
                    <th>Description</th>
                    <th>Price</th>
                    <th>Qty</th>
                    <th>Total</th>
                    <th>Action</th>
                </tr>
            </thead>
        )
    }

    renderTbody = () => {
        const { selectedIndex, qty } = this.state
        return(
            <tbody>
                {this.props.cart.map((item, index) => {
                    return(
                        <tr key={index}>
                            <td style={{textAlign: "center"}}>{index + 1}</td>
                            <td style={{textAlign: "center"}}>
                                <img src={item.image} alt={item.name} style={styles.imgCart}/>
                            </td>
                            <td>{item.name}</td>
                            <td>IDR. {item.price.toLocaleString()}</td>
                            <td style={{textAlign: "center"}}>
                                {
                                    selectedIndex === index 
                                    ?
                                    <div style={{display: "flex", width:"200px"}}>
                                        <Button onClick={this.minusHandler}>
                                            <i className="fas fa-minus-circle"></i>
                                        </Button>

                                        <FormControl type="text" value={qty} onChange={(e) => this.changeQty(e)}/>

                                        <Button onClick={this.plusHandler}>
                                            <i className="fas fa-plus-circle"></i>
                                        </Button>
                                    </div>
                                    :
                                    item.qty
                                }
                            </td>
                            <td>
                                {
                                    selectedIndex === index
                                    ?
                                    <p>IDR. {(qty * item.price).toLocaleString()}</p>
                                    :
                                    <p>IDR. {item.totalPrice.toLocaleString()}</p>
                                }
                            </td>
                            <td style={{textAlign: "center"}}>
                                {
                                    selectedIndex === index
                                    ?
                                    <div>
                                        <Button style={{margin: "5px", backgroundColor: "#ef233c"}} onClick={() => this.setState({selectedIndex: null})}><i className="fas fa-window-close"></i></Button>
                                        <Button style={{margin: "5px", backgroundColor: "#55a630"}} onClick={() => this.doneHandler(index)}><i className="fas fa-check-square"></i></Button>
                                    </div>
                                    :
                                    <div>
                                        <Button style={{margin: "5px", backgroundColor: "#457b9d"}} onClick={() => this.editItemHandler(index, item.qty, item.id)}><i className="fas fa-edit"></i></Button>
                                        <Button style={{margin: "5px", backgroundColor: "#ef233c"}} onClick={() => this.deleteItemHandler(index)}><i className="fas fa-trash-alt"></i></Button>
                                    </div>
                                }
                            </td>
                        </tr>
                    )
                })}
            </tbody>
        )
    }

    renderSumary = () => {
        return(
            <div style={{display: "flex", justifyContent: "space-between"}}>
                <div style={{marginTop: "40px"}}>
                    <Button as={Link} to="/" style={{backgroundColor: "#feeafa", color: "black"}}>Continue Shopping</Button>
                </div>
                <div style={{display: "flex", flexDirection: "column", width: "25vw", height: "100px"}}>
                    <div style={{display: "flex", justifyContent: "space-between"}}>
                        <h4>Order Total</h4>
                        <h4>IDR. {this.countTotal().toLocaleString()}</h4>
                    </div>
                    <Button style={{backgroundColor: "#fca311"}} onClick={this.checkoutHandler} disabled={this.state.cartEmp}>Checkout</Button>
                </div>
            </div>
        )
    }

    render(){
        // console.log(this.state.products.length)

        if(!this.props.id) return <Redirect to="/login"/>

        if(this.state.toHistory) return <Redirect to='/history'/>

        return(
            <div style={styles.container}>
                <Table striped bordered hover>
                    {this.renderThead()}
                    {this.renderTbody()}
                </Table>
                {this.renderSumary()}
                <Modal show={this.state.checkQty} onHide={() => this.setState({checkQty: false})}>
                    <Modal.Header closeButton>
                        <Modal.Title>Sorry🙏</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Your order is over our stock😢
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.setState({checkQty: false})}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={this.state.showConfirmation} onHide={() => this.setState({showConfirmation: false})}>
                    <Modal.Header closeButton>
                        <Modal.Title>User Confirmation</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Are you sure to checkout your order?
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.userConfirmHandler}>
                            Yes
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}

const styles = {
    container: {
        padding: "0 30px",
        marginTop: "100px",
        fontFamily: "PT Serif"
    },
    imgCart: {
        width: "100px",
        height: "100px"
    }
}

const mapStateToProps = (state) => {
    return{
        id: state.user.id,
        email: state.user.email,
        password: state.user.password,
        cart: state.user.cart,
    }
}

export default connect(mapStateToProps, {login})(Cart)