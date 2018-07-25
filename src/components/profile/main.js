import React, { Component } from 'react'
import { connect } from 'react-redux'
import { FormGroup, Col, Row } from 'react-bootstrap'
import { getNewMembers, getMostViewedMembers, getMembers, getPopularMembers, getSearchProfileId, getMoreMembers, setActiveTab } from 'actions'
import MemberBlock from 'components/members/member_block.js'
import store from 'store'
import Tabs from 'components/tabs'
import SearchBlock from 'components/members/search_block.js'
import { TextField } from 'components/form/inputs'
import BtnMain from 'components/form/buttons/main_button.js'
import Validator from 'validate'

class MainProfile extends Component {
    constructor(props) {
        super(props)
        store.dispatch(getMostViewedMembers(props.user.token))
        store.dispatch(getNewMembers(props.user.token))
        store.dispatch(getPopularMembers(props.user.token))
        store.dispatch(getMembers(props.user.token))
    }

    getSearch = () => {
        let error = 1
        error *= Validator.check(this.profile_id.value, ['required'], 'Profile ID')
        if (error) {
            store.dispatch(setActiveTab("girls", "main"))
            store.dispatch(getSearchProfileId(this.profile_id.value, this.props.user.token))
        }
    }

    seeMore = () => {
        store.dispatch(getMoreMembers(this.props.members.next_link, this.props.user.token))
    }

	render() {
        const { new_list, popular_list, search_list, viewed_list } = this.props.members
        const more = this.props.members.current_page < this.props.members.last_page
		return (
            <div className="pt-15">
                <Row>
                    <Col sm={8}>
                        <FormGroup className="pt-17">
                            <TextField
                                type="text"
                                placeholder="Profile ID"
                                inputRef={ref => { this.profile_id = ref }}
                                value={''}
                                name="Profile ID" />
                        </FormGroup>
                    </Col>
                    <Col sm={4}>
                        <FormGroup className="text-right">
                            <BtnMain
                                type="button"
                                bsStyle="success"
                                text="Search by Profile ID"
                                onClick={this.getSearch} />
                        </FormGroup>
                    </Col>
                </Row>
                <Tabs 
                    tabs={[
                        {
                            eventKey: 'all', 
                            title: 'All', 
                            content: <MemberBlock like={true} list={viewed_list} />
                        }, {
                            eventKey: 'popular', 
                            title: 'Popular', 
                            content: <MemberBlock like={true} list={popular_list} />
                        }, {
                            eventKey: 'new', 
                            title: 'New', 
                            content: <MemberBlock like={true} list={new_list} />
                        }, {
                            eventKey: 'girls', 
                            title: 'Advanced Search', 
                            content:    <div>
                                            <SearchBlock />
                                            <MemberBlock like={true} list={search_list} more={more} onClick={this.seeMore} />
                                        </div>
                        }
                    ]}
                    activeKey="girls"
                    tabKey="main" />
            </div>
		);
	}
}

const mapStateToProps = (state) => {
    return {
        members: {
            new_list: state.members.new_list,
            popular_list: state.members.popular_list,
            viewed_list: state.members.viewed_list,
            search_list: state.members.search_list,
            current_page: state.members.current_page,
            last_page: state.members.last_page,
            next_link: state.members.next_link,
        },
        user: {
            token: state.user.token
        }
    }
}

export default connect(
    mapStateToProps
)(MainProfile)