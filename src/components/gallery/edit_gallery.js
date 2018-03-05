import React, { Component } from 'react'
import { connect } from 'react-redux'
import store from 'store'
import { setClientInfo } from 'actions'
import { Row, Col } from 'react-bootstrap'
import Cropper from 'react-cropper'
import 'cropperjs/dist/cropper.css'
import CustomGallery from 'components/gallery/gallery.js'

class EditGallery extends Component {
    constructor(props) {
        super(props)
        store.dispatch(setClientInfo({temp_avatar: props.user.data.avatar.original}))
    }

    getUrl = () => {
       return this.props.user.data.avatar.original //+ '?' + Date.now()
    }

    crop = () => {
        if (this.refs.cropper) {
            let crop = this.refs.cropper.getData()
            let data = {
                width: crop.width.toFixed(),
                height: crop.height.toFixed(),
                x: crop.x.toFixed(),
                y: crop.y.toFixed(),
                avatar: this.props.user.data.temp_avatar
            }
            
            store.dispatch(setClientInfo({cropped_data: data}))
        }
    }

    setAvatar = (e, k) => {
        store.dispatch(setClientInfo({temp_avatar: k.target.src}))
        this.crop()
    }

    render() {
        const images = this.props.user.data.images.public
        return (
            <div>
                <Row>
                    <Col sm={4}>
                        <Cropper
                            ref='cropper'
                            src={this.props.user.data.temp_avatar}
                            style={{ height: '200px', width: '100%', margin: '0 auto' }}
                            aspectRatio={1 / 1}
                            guides={false}
                            background={false}
                            cropend={this.crop}
                            ready={this.crop}
                        />
                    </Col>
                    <Col sm={8}>
                       <CustomGallery
                            images={images}
                            isSelected={false}
                            onClick={this.setAvatar}
                        />
                    </Col>
                </Row>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        user: {
            data: {
                avatar: state.user.data.avatar,
                images: state.user.data.images,
                temp_avatar: state.user.data.temp_avatar
            }
        }
    }
}

export default connect(
    mapStateToProps
)(EditGallery);