import React, { Component } from 'react'
import SmallItem from './small_item.js'
import { connect } from 'react-redux'
import store from 'store'
import { toggleLightBox, gotoPrevImg, gotoNextImg, removePhotos, toggleActive, togglePrivate, setAlert, toggleModal, buyPhoto } from 'actions'
import Lightbox from 'react-images'
import style from './small_item.css'
import { confirmAlert } from 'react-confirm-alert'

class CustomGallery extends Component {
    constructor(props) {
        super(props)
        this.images = []
    }

    printPreview = (image, i) => {
        return (<SmallItem 
                    onClick={() => {this.props.onClick ? this.props.onClick(image) : this.openLightBox(image, i)}} 
                    removePhoto={(e) => {this.removePhoto(image, e)}} 
                    toggleActive={(e) => {this.toggleActive(image, e)}}
                    togglePrivate={(e) => {this.togglePrivate(image, e)}}
                    client={this.props.user.data.role === 'client'} 
                    key={i} 
                    image={image}
                    profile={this.props.profile}
                    edit={this.props.edit}
                    forClient={this.props.forClient && this.props.user.data.role === 'client'}
                    info={this.props.info} />)
    }
    
    openLightBox = (image, i) => {
        if (this.props.forClient) {
            if (image.private) {
                if (this.props.user.data.membership.view_photo === 'Limited') {
                    if (! image.purchased) {
                        confirmAlert({
                            title: '',
                            message: 'You can\'t see this photo',
                            buttons: [
                                {
                                    label: 'Cancel'
                                }, {
                                    label: 'Use Credits',
                                    onClick: () => {
                                        if (this.props.user.data.credits < 3) {
                                            store.dispatch(toggleModal(true, 'credits'))
                                        } else {
                                            store.dispatch(buyPhoto(image.id, this.props.user.token, this.props.memberId))
                                        }
                                    }
                                }, {
                                    label: 'Upgrade Membership',
                                    onClick: () => {
                                        store.dispatch(toggleModal(true, 'plans'))
                                    }
                                }
                            ]
                        })
                        return
                    }  
                }
            }
        }
        store.dispatch(toggleLightBox('main', i))
    }

    closeLightbox = () => {
        store.dispatch(toggleLightBox(''))
    }

    gotoPrevious = () => {
        store.dispatch(gotoPrevImg())
    }

    gotoNext = () => {
        store.dispatch(gotoNextImg())
    }

    toggleActive = (image, e) => {
        e.stopPropagation()
        let url = image.active ? 'hide' : 'show'

        if ((url === 'show' && this.checkActive()) || url === 'hide') {
            store.dispatch(toggleActive({'images': [image.id]}, url, this.props.user.token))
        } else {
            store.dispatch(setAlert('You can\'t make more active photos', 'error'))
        }
    }

    checkActive = () => {
        let count = 0
        for (let image of this.props.images) {
            count += image.active
        }
        return count < this.props.user.data.membership.my_photo
    }

    togglePrivate = (image, e) => {
        e.stopPropagation()
        let url = image.private ? 'public' : 'private'
        store.dispatch(togglePrivate({'images': [image.id]}, url, this.props.user.token))
    }

    removePhoto = (image, e) => {
        e.stopPropagation()
        confirmAlert({
            title: '',
            message: 'Are you sure to remove this photos?',
            buttons: [
                {
                    label: 'Cancel'
                }, {
                    label: 'Confirm',
                    onClick: () => store.dispatch(removePhotos({'images': [image.id]}, this.props.user.token))
                }
            ]
        })
    }

    render() {
        return (
            <div className={style.galleryWrap}>
                {this.props.images.map((image, i) => this.printPreview(image, i))}
                <Lightbox
                    images={this.props.images}
                    isOpen={this.props.services.gallery.show_light_box === 'main'}
                    backdropClosesModal={true}
                    showImageCount={true}
                    currentImage={this.props.services.gallery.img_light_box}
                    onClickPrev={this.gotoPrevious}
                    onClickNext={this.gotoNext}
                    showThumbnails={true}
                    onClickThumbnail={(e) => {this.openLightBox('', e)}}
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
                img_light_box: state.services.gallery.img_light_box
            }
        },
        members: {
            data: state.members.data
        },
        user: {
            token: state.user.token,
            data: {
                role: state.user.data.role,
                membership: state.user.data.membership,
                credits: state.user.data.credits
            }
        }
    }
}

export default connect(
    mapStateToProps
)(CustomGallery)