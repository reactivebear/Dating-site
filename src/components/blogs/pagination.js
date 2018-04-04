import React, { Component } from 'react'
import { Row, Col } from 'react-bootstrap'
import style from './style.css'


class Pagination extends Component {
	printPagination = (item, i) => {
		const activeClass = i + 1 == this.props.current_page ? ' active' : ''
		return <span key={i} id={i + 1} onClick={this.props.onClick} className={style.pagination + activeClass}>{i + 1}</span>
	}

    render() {
    	const items = Array.apply(null, Array(this.props.last_page))
        return (
        	<div className={style.wrapPagination}>
        		{ items.map((item, i) => this.printPagination(item, i)) }
            </div>
        );
    }
}

export default Pagination