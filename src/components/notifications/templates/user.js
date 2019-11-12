import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import * as actions from "../../../actions"
import { connect } from "react-redux"

class User extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: ''
        }
        this.getUser = this.getUser.bind(this)
    }
    componentWillMount() {
        this.getUser(this.props);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.id != nextProps.id) {
            this.getUser(nextProps)
        }
        else if (this.state.name === '') {
            let userInfos = nextProps.user.userInfoCollection.filter(userInfo => userInfo && userInfo.id == nextProps.id);
            if (userInfos.length > 0) {
                this.setState({
                    name: userInfos[0].displayName
                })
            }
        }
    }
    getUser(props) {
        this.setState({ name: '' })
        let userInfos = props.user.userInfoCollection.filter(userInfo => userInfo && userInfo.id == props.id);
        if (userInfos.length > 0) {
            this.setState({
                name: userInfos[0].displayName
            })
        }
        else {
            props.getUserInfo(props.id)
        }
    }
    render() {
        return <Link to={`/networkFeed/user/${this.props.id}`}>{this.state.name}</Link>
    }
}

function mapStateToProps({ user }) {
    return { user };
}

export default connect(mapStateToProps, actions)(User);

