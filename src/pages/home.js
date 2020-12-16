import React from 'react'
import Axios from 'axios'
import { connect } from 'react-redux'
import { login } from '../action'
import { Redirect } from 'react-router-dom'
import { 
    Card,
    Button,
    Modal,
    Toast 
} from 'react-bootstrap'

class Home extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            products: [],
            selectedProd: {},
            total: 1,
            showModal: false,
            toLogin: false,
            successAddtoCart: false
        }
    }

    componentDidMount(){
        Axios.get("http://localhost:2000/products")
        .then((res) => this.setState({products: res.data}))
        .catch((err) => console.log(err))
    }

    buyHandler = (id) => {
        // console.log("add to cart clicked " + id)

        let products = this.state.products
        let product = products.filter(item => item.id === id)
        // console.log(product)
        this.setState({selectedProd: product[0], showModal: true})
    }

    plusHandler = () => {
        const {total, selectedProd} = this.state

        total >= selectedProd.stock ? alert("Sorry, your order is over our stock") : this.setState({total: total + 1})
    }

    addToCartHandler = () => {
        console.log("add to cart clicked")

        const {selectedProd, total} = this.state
        
        if(!this.props.id) return this.setState({toLogin: true})
        
        let tempCart = this.props.cart
        let sameCart = [false]
        for(let temp of tempCart){
            if(selectedProd.id === temp.id){
                temp.qty = temp.qty + total
                temp.totalPrice = temp.qty * temp.price
                sameCart.splice(0, 1, true)
            }
        }

        console.log(sameCart)

        if(!sameCart[0]){
            let cartData = {
                id: selectedProd.id,
                name: selectedProd.name,
                image: selectedProd.img,
                qty: total,
                price: selectedProd.price,
                totalPrice: total * selectedProd.price
            }
            tempCart.push(cartData)
        }
        // console.log(this.props.cart[0].id)
        // console.log(tempCart)
    
        Axios.patch(`http://localhost:2000/users/${this.props.id}`, {cart: tempCart})
        .then((res) => {
            Axios.get(`http://localhost:2000/users/${this.props.id}`)
            .then((res2) => {
                this.props.login(res2.data)
                this.setState({successAddtoCart: true})
            })
            .catch((err2) => console.log(err2))
        })
        .catch((err) => console.log(err))
    }

    render(){
        const {selectedProd, total, showModal, toLogin, successAddtoCart} = this.state

        if(toLogin) return <Redirect to='/login'/>

        return(
            <div style={{padding: "50px"}}>
                <Toast show={successAddtoCart} onClose={() => this.setState({successAddtoCart: false})}>
                    <Toast.Header>
                        <img
                        src="holder.js/20x20?text=%20"
                        className="rounded mr-2"
                        alt=""
                        />
                        <strong className="mr-auto">Good news!</strong>
                    </Toast.Header>
                    <Toast.Body>Woohoo, you have added {selectedProd.name} to your shopping cart!</Toast.Body>
                </Toast>
                <h1>Products</h1>
                <div style={styles.container}>
                {this.state.products.map((item, index) => {
                    return(
                        <Card style={styles.card} key={index}>
                            <Card.Img variant="top" src={item.img} />
                            <Card.Body style={{display: "flex", flexDirection: "column", justifyContent: "space-between"}}>
                                <Card.Title>{item.name}</Card.Title>
                                <Card.Text style={{height: "4rem", fontSize: "20px"}}>
                                    <p>{item.price ? `Rp. ${item.price.toLocaleString()}` : 0}</p>
                                    <p>Available stock: {item.stock}</p>
                                </Card.Text>
                                <div style={{display: "flex", justifyContent: "center"}}>
                                    <Button style={{margin: "20px 10px"}} onClick={() => this.buyHandler(item.id)}>Buy</Button>
                                </div>
                            </Card.Body>
                        </Card>
                    )
                })}
                </div>
                <Modal show={showModal} onHide={() => this.setState({showModal: false})}>
                    <Modal.Header closeButton>
                    <Modal.Title>{selectedProd.name}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div>
                            <img src={selectedProd.img} alt="product" style={{width: "300px", height: "200px"}}/>
                            <div style={styles.description}>
                                <h3>IDR. {selectedProd.price}</h3>
                                <p>Description: {selectedProd.description}</p>
                            </div>
                            <div style={styles.qty}>
                                    <div>
                                        <p>Quantity: </p>
                                    </div>
                                    <div style={{display: "flex", margin: "15px"}}>
                                        <button
                                        disabled= {total <= 1 ? true : false}
                                        onClick={() => this.setState({total: total - 1})}
                                        style={{height: "2rem", margin: "10px", borderRadius: "30px"}}
                                        ><i className="fas fa-minus"></i></button>
                                            
                                        <h2 style={{fontSize: "40px"}}>{total}</h2>

                                        <button
                                        disabled= {total > selectedProd.stock ? true : false}
                                        onClick={this.plusHandler}
                                        style={{height: "2rem", margin: "10px", borderRadius: "30px"}}
                                        ><i className="fas fa-plus"></i></button>
                                    </div>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                    <Button variant="secondary" onClick={this.addToCartHandler}>
                        Add to Cart
                    </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}

const styles = {
    container: {
        display: "flex", 
        flexWrap: "wrap",
        justityContent: "space-between", 
    },
    card: {
        width: "16.5rem",  
        margin: "10px",
    },
    description: {
        fontSize: "13px",
        fontWeight: "350", 
    },
}

const mapStatetoProps = (state) => {
    return{
        id: state.user.id,
        cart: state.user.cart
    }
}
export default connect(mapStatetoProps, {login})(Home)