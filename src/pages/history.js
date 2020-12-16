import React from 'react'
import Axios from 'axios'
import { connect } from 'react-redux'
import { login } from '../action'

import { 
    Table, 
    Button,
    Modal 
} from 'react-bootstrap'

class History extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            history: [],
            products: [],
            message: false
        }
    }
    componentDidMount(){
        Axios.get(`http://localhost:2000/history?userID=${this.props.id}`)
        .then((res) => {
            // console.log(res.data)
            this.setState({history: res.data})
            // Axios.get('http://localhost:2000/products')
            // .then((res) => this.setState({products: res.data}))
            // .catch((err) => console.log(err))
        })
        .catch((err) => console.log(err))
    }

    cancelHandler = (index) => {
        console.log("cancel clicked " + index)
        let tempHistory = this.state.history

        console.log(tempHistory)
        let deletedHistory = tempHistory.splice(index, 1)
        console.log(deletedHistory)
        this.setState({message: true})
        // console.log(tempHistory)

        // gimana sih caranya masukin semua ini?????
        // Axios.patch(`http://localhost:2000/history?userID=${this.props.id}`, {tempHistory})
        // .then((res) => {
        //     console.log(res.data)

        //     Axios.get(`http://localhost:2000/users/${this.props.id}`)
        //     .then((res2) => this.props.login(res2.data))
        //     .catch((err2) => console.log(err2))
        // })
        // .catch((err) => console.log(err))

        // balikin stock misal kalo berhasil
        /*
    
            let products = this.state.products
            let updateStock = []
            for(let i in deletedHistory){
                for(let delete of deletedHistory[i].product){
                    for(let product of products){
                        if(delete.name === product.name){
                            let update = {
                                name: product.name,
                                backStock: delete.stock
                            }
                            updateStock.push(update)
                        }
                    }
                }
            }

            updateStock.map(item => {
                Axios.patch(`http://localhost:2000/products?{item.name}`, {stock: item.backStock})
                .then((res) => {
                    console.log(res.data)
                    Axios.get(`http://localhost:2000/users?email=${localStorage.email}`)
                    .then((res) => {
                        this.props.login(res.data[0])
                    })
                    .catch((err) => console.log(err))
                })
                .catch((err) => console.log(err))
        */
    }

    renderThead = () => {
        return(
            <thead style={{textAlign: "center"}}>
                <tr>
                    <th>No</th>
                    <th>Date</th>
                    <th>Email</th>
                    <th>Product</th>
                    <th>Total Payment</th>
                    <th>Payment Status</th>
                    <th>Action</th>
                </tr>
            </thead>
        )
    }

    renderTbody = () => {
        return(
            <tbody>
                {this.state.history.map((item, index) => {
                    return(
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item.date}</td>
                            <td>{item.email}</td>
                            <td>
                                {item.product.map((item2, index2) => {
                                    return(
                                        <h6 key={index2}>{item2.name}</h6>
                                    )
                                })}
                            </td>
                            <td>{item.total}</td>
                            <td>{item.payment}</td>
                            <td>
                                <Button variant="warning" onClick={() => this.cancelHandler(index)}>Cancel</Button>
                            </td>  
                        </tr>
                    )
                })}
            </tbody>
        )
    }

    render(){
        return(
            <div style={styles.container}>
               <Table>
                   {this.renderThead()}
                   {this.renderTbody()}
               </Table>

               <Modal show={this.state.message} onHide={() => this.setState({message: false})}>
                <Modal.Header closeButton>
                <Modal.Title>Error</Modal.Title>
                </Modal.Header>
                <Modal.Body>Kaak gregetan bgt gabisa patch datanya!! trs aneh jd ke logout sendiri</Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={() => this.setState({message: false})}>
                    Close
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
        cart: state.user.cart,
    }
}

export default connect(mapStateToProps, {login})(History)