import React, { Component } from 'react'
import store from 'store'
import { connect } from 'react-redux'
import { getMembers } from 'actions'
import MemberBlock from 'components/members/member_block.js'

class Girls extends Component {
	constructor(props) {
		super(props)
		store.dispatch(getMembers(props.user.token))
	}

    render() {
        return (
            <div className="pt-15">
                <MemberBlock 
                	list={this.props.members.list} />
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
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
)(Girls)