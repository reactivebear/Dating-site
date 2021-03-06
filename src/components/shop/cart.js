import React, { Component } from 'react'
import { Row, Col, FormGroup } from 'react-bootstrap'
import { connect } from 'react-redux'
import store from 'store'
import { setCart, getMembers, setReceiverToShop, buyProducts } from 'actions'
import style from './style.css'
import ReceiverInfo from './receiver_info.js'

class Cart extends Component {
    constructor(props) {
        super(props)
        store.dispatch(getMembers(props.user.token))
        this.actions = false
    }

    getCart = () => {
        const data = window.localStorage.getItem('cart');
        return JSON.parse(data ? data : '[]');
    }

    addToCart = (product) => {
        let cart  = this.getCart()
        let check = false

        cart = cart.map((item) => {
            if (item.product && item.product.id === product.id) {
                item.count++
                check = true;
            }
            return item;
        });

        if ( ! check) {
            cart.push({product: product, count: 1});
        }
        
        window.localStorage.setItem('cart', JSON.stringify(cart));
        store.dispatch(setCart(this.getCart()))
    }

    removeFromCart = (product) => {
        let cart = this.getCart()
        cart = cart.map((item) => {
            if (item.product.id === product.id) {
                item.count--
            }
            return item
        })

        cart = cart.filter((item) => {
            return item.count !== 0
        })
        
        window.localStorage.setItem('cart', JSON.stringify(cart));
        store.dispatch(setCart(this.getCart()))
    }

    removeItemCart = (product) => {
         let cart = this.getCart()
         cart = cart.filter((item) => {
            return item.product.id !== product.id
        })
        window.localStorage.setItem('cart', JSON.stringify(cart));
        store.dispatch(setCart(this.getCart()))
    }

    clearCart = () => {
        window.localStorage.setItem('cart', '[]');
        store.dispatch(setCart(this.getCart()))
    }

    printCart = (item, i) => {
        return  <tr className="font-bebas" key={i}>
                    <td>
                        <img className={style.thumbnail} src={item.product.image} alt="" />
                    </td>
                    <td>
                        <span>{item.product.name}</span>
                    </td>
                    <td className="text-center">
                        <span>${item.product.price}</span>
                    </td>
                    <td className="text-center">
                        <span>
                            {
                                item.count > 1
                                ?   <span onClick={() => this.removeFromCart(item.product)} className={style.minus}>
                                        <i className="fas fa-minus"></i>
                                    </span>
                                :   <span className={style.hidden}>
                                        <i className="fas fa-minus"></i>
                                    </span>
                            }
                            
                            {item.count}
                            <span onClick={() => this.addToCart(item.product)} className={style.plus}>
                                <i className="fas fa-plus"></i>
                            </span> 
                        </span>
                    </td>
                    <td className="text-center">
                        <strong>${(item.count * item.product.price).toFixed(2)}</strong>
                    </td>
                    <td>
                        <span className={style.cross} onClick={() => this.removeItemCart(item.product)}>
                            <i className="fas fa-times text-danger"></i>
                        </span>
                    </td>
                </tr>
    }

    getTotal = () => {
        let total = 0
        this.props.shop.cart.map((item, i) => {
            total += item.product.price * item.count
        })
        return total.toFixed(2)
    }

    setReceiver = (receiver) => {
        store.dispatch(setReceiverToShop(receiver))
    }

    clearReceiver = () => {
        store.dispatch(setReceiverToShop({}))
    }

    componentDidMount() {
        window.paypal.Button.render({
            env: 'sandbox', // sandbox | production
            commit: true,
            style: {
                label: 'paypal',
                size:  'medium',    // small | medium | large | responsive
                shape: 'rect',     // pill | rect
                color: 'blue',     // gold | blue | silver | black
                tagline: false    
            },
            client: {
                sandbox:    'AfDGqe6kXnSsTM9gDI2OZdUXxrydoxVCG7CZbp76Nr-NdDvHjyKs7W52X7n8s8_i4k6cQqwF7gor72f_',
                production: 'AUjZF0corGMnwDfnp4_EGJkFESZn6u96_wnxqVL2XNQ_RCkqnHjLJaNRKSB9j4Ypn4LniWukXuSJ_bF7'
            },

            payment: (data, actions) => {
                return actions.payment.create({
                    payment: {
                        transactions: [
                            {
                                amount: { total: this.getTotal(), currency: 'USD' }
                            }
                        ]
                    }
                });
            },

            onAuthorize: (data, actions) => {
                return actions.payment.execute().then(() => {
                    let temp = {}
                    for (let k in this.props.shop.cart) {
                        temp[this.props.shop.cart[k].product.id] = this.props.shop.cart[k].count
                    }

                    const mas = {
                        girl_id: this.props.shop.receiver.id,
                        paypal_id:  data.paymentID,
                        products: temp
                    }

                    store.dispatch(buyProducts(mas, this.props.user.token))
                    this.clearCart()
                    this.clearReceiver()
                });
            }
        }, '#paypal-button-cart');
    }

	render() {
        const hiddenClass = this.props.shop.cart.length && this.props.shop.receiver.id ? '' : 'hidden'
        
        return (
            <Row>
                <Col xs={12}>
                    <FormGroup>
                        <div className="table-responsive">
                            <table className="table">
                                <thead>
                                    <tr className={style.titleTable}>
                                        <th>&nbsp;</th>
                                        <th>Products</th>
                                        <th className="text-center">Price</th>
                                        <th className="text-center">Quantity</th>
                                        <th className="text-center">Total</th>
                                        <th>&nbsp;</th>
                                    </tr>
                                </thead>
                                <tbody className={style.tableBody}>
                                    {this.props.shop.cart.map((item, i) => this.printCart(item, i))}
                                </tbody>
                                <tfoot>
                                    <tr className={style.titleTable}>
                                        <td></td>
                                        <td></td>
                                        <td className="text-center"></td>
                                        <td className="text-right font-bebas">
                                            <strong>Total:</strong>
                                        </td>
                                        <td className="text-center font-bebas">
                                            <strong>${this.getTotal()}</strong>
                                        </td>
                                        <td></td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </FormGroup>
                    <FormGroup>
                    &nbsp;
                    </FormGroup>
                    <Row>
                        <Col sm={8}>
                            <FormGroup>
                                <ReceiverInfo 
                                    inputRef={ref => { this.receiver = ref }} 
                                    value={this.props.shop.receiver}
                                    onClick={(receiver) => this.setReceiver(receiver)}
                                    clearReceiver={this.clearReceiver}
                                    list={this.props.members.list} />
                            </FormGroup>
                        </Col>
                        <Col sm={4}>
                            <div className={hiddenClass + " text-center"} id="paypal-button-cart"></div>
                        </Col>
                    </Row>
                </Col>
                <Col xs={2}>
                    
                </Col>
            </Row>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        shop: {
            cart: state.shop.cart,
            receiver: state.shop.receiver
        },
        user: {
            token: state.user.token
        },
        members: {
            list: state.members.list
        }
    }
}

export default connect(
    mapStateToProps
)(Cart)