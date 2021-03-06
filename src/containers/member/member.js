import React, { Component } from 'react'
import { connect } from 'react-redux'
import store, { history } from 'store'
import Lightbox from 'react-images'
import { getMemberInfo, addToFavorite, removeFromFavorite, addViewed, toggleLightBox, setReceiverToShop, getContactsDetails, addToInterest, removeFromInterest } from 'actions'
import { Grid, Row, Col, FormGroup } from 'react-bootstrap'
import style from './style.css'
import AvatarImg from 'components/gallery/avatar_img.js'
import MemberInfo from 'components/members/info.js'
import Zodiac from 'components/zodiac'
import BtnMain from 'components/form/buttons/main_button.js'
import { Loader } from 'containers'

class Member extends Component {
    constructor(props) {
        super(props)
        store.dispatch(getMemberInfo(props.user.token, props.match.params.id))
    }

    openLightBox = () => {
       store.dispatch(toggleLightBox('avatar', 0))
    }

    closeLightbox = () => {
        store.dispatch(toggleLightBox(''))
    }

    toggleFavorite = () => {
        if (this.props.members.data.favorite) {
            store.dispatch(removeFromFavorite(this.props.members.data.id, this.props.user.token))
        } else {
            store.dispatch(addToFavorite(this.props.members.data.id, this.props.user.token))
        }
    }

    toggleInterest = () => {
        if (this.props.members.data.interest) {
             store.dispatch(removeFromInterest(this.props.members.data.id, this.props.user.token))
        } else {
            store.dispatch(addToInterest(this.props.members.data.id, this.props.user.token))
        }
    }

    getContactsDetails = () => {
        store.dispatch(getContactsDetails(this.props.user.token, this.props.members.data.id))
    }

    goToShop = () => {
        store.dispatch(setReceiverToShop(this.props.members.data))
        history.push('/shop')
    }

    componentDidMount() {
        let localStorage = window.localStorage
        let date = new Date();
        date = date.getTime() / 1000
        date = date.toFixed(0)
        let viewed = localStorage.getItem('viewed')
        if (! viewed) {
            let data = [{[this.props.match.params.id]: date}]
            localStorage.setItem('viewed', JSON.stringify(data))
            store.dispatch(addViewed(this.props.match.params.id, this.props.user.token))
        } else {
            let data = JSON.parse(localStorage.viewed)

            for (let k in data) {
                if (data[k][this.props.match.params.id] < date - 60) {
                    data.splice(k, 1)
                }
            }

            let check = data.some((element, index, array) => {
                if (this.props.match.params.id in array[index]) {
                    return true
                }
            })
            
            if (! check) {
                data.push({[this.props.match.params.id]: date})
                store.dispatch(addViewed(this.props.match.params.id, this.props.user.token))
            }
            
            localStorage.setItem('viewed', JSON.stringify(data))
        }
    }

    checkRequest = () => {
        return this.props.match.params.id * 1 === this.props.members.data.id
    }

    render() {
        return (
            <div className={style.homeWrapper}>
                <div className="pt-66 bg-blue">
                    <Grid className="bg-white pt-15">
                        {
                            ! this.checkRequest()
                            ?   <Loader />
                            :   <Row>
                                    <Col md={3}>
                                        <AvatarImg
                                            src={this.props.members.data.avatar.croped} 
                                            onClick={this.openLightBox} />
                                        <FormGroup className="text-center">
                                            <h2>
                                                <strong className="font-bebas">{this.props.members.data.first_name}</strong>
                                            </h2>
                                            <strong className="text-grey">ID: {this.props.members.data.profile_id}</strong>
                                        </FormGroup>
                                        <FormGroup className="text-center">
                                            <span>{this.props.members.data.country}, {this.props.members.data.city}</span>
                                        </FormGroup>
                                        <FormGroup className="text-center">
                                            <span>{this.props.members.data.age} years ( {<Zodiac name={this.props.members.data.zodiac} />} )</span>
                                        </FormGroup>
                                        {
                                            this.props.user.data.role === 'client'
                                            ?   <FormGroup className="text-center">
                                                    <BtnMain
                                                        type="button"
                                                        bsStyle="success"
                                                        text="Share contact details"
                                                        onClick={this.getContactsDetails}
                                                        color="main" />
                                                </FormGroup>
                                            :   ''
                                        }
                                        <FormGroup className="text-center">
                                            <BtnMain
                                                type="button"
                                                bsStyle="success"
                                                text={this.props.members.data.favorite ? "Remove from favorite" : "Add to favorite"}
                                                color="main"
                                                onClick={this.toggleFavorite} />
                                        </FormGroup>
                                        {
                                            this.props.user.data.role === 'client'
                                            ?   <FormGroup className="text-center">
                                                    <BtnMain
                                                        type="button"
                                                        bsStyle="success"
                                                        text="Send Gift"
                                                        color="main"
                                                        onClick={this.goToShop} />
                                                </FormGroup>
                                            : ''
                                        }
                                        {
                                            this.props.user.data.role === 'client'
                                            ?   <FormGroup className="text-center">
                                                    <BtnMain
                                                        type="button"
                                                        bsStyle="success"
                                                        text={this.props.members.data.interest ? "Remove from interest" : "Express the interest"}
                                                        color="pink"
                                                        onClick={this.toggleInterest} />
                                                </FormGroup>
                                            : ''
                                        } 
                                    </Col>
                                    <Col md={9}>
                                        <MemberInfo
                                            options={this.props.members.data}
                                            client={this.props.user.data.role === 'client'} />
                                    </Col>
                                </Row>
                        }
                    </Grid>
                </div>
                <Lightbox
                    images={[{src: this.props.members.data.avatar.original}]}
                    isOpen={this.props.services.gallery.show_light_box === 'avatar'}
                    backdropClosesModal={true}
                    showImageCount={false}
                    onClose={this.closeLightbox} />
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        services: {
            gallery: {
                show_light_box: state.services.gallery.show_light_box,
                avatar: state.services.gallery.avatar
            }
        },
        members: {
            data: state.members.data
        },
        user: {
            token: state.user.token,
            data: {
                role: state.user.data.role
            }
        }
    }
}

export default connect(
    mapStateToProps
)(Member)