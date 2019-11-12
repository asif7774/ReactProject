import React, { Component } from 'react'
import { BASE_URL } from '../../config/config';
// import { connect } from 'react-redux';
// import { Link } from 'react-router-dom'
import axios from 'axios';
import { Image } from 'semantic-ui-react'

export default class AvatarProfile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            profilePic: ''
        }

    }
    componentWillMount() {
        this.getUserPicture();
    }
    getUserPicture() {
        let id = this.props.id
        axios.get(`${BASE_URL}/api/v1/user/${id}`, { withCredentials: true })
            .then(response => {
                // console.log(response.data.Item.image);
                this.setState({
                    profilePic: response.data.Item.image
                })
            }).catch(err => {
                console.log(err);
            })
    }
    render() {
        return (
            <Image className="user-avtar-image" src={this.state.profilePic} />

        )
    }

}



