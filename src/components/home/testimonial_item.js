import React, { Component } from 'react'
import { Grid } from 'react-bootstrap'
import style from './style.css'

class TestimonialItem extends Component {
    render() {
        return (
                <div className={style.testimonialBlock + ' text-center'} onClick={this.props.onClick}>
                    <img src="http://mint.themes.tvda.pw/wp-content/uploads/2016/11/profile04-110x110.jpg" className={style.testimonialImg} alt="" />
                    <div className={style.testimonialStar}>
                        { Array.apply(null, Array(this.props.rating)).map((item, i) => <i key={i} className="fas fa-star"></i>) }
                    </div>
                    <div className={style.testimonialText}>{this.props.text}</div>
                    <div className={style.testimonialName}>{this.props.name}</div>
                    <div className={style.testimonialCity}>{this.props.city}</div>
                </div>
        );
    }
}

export default TestimonialItem