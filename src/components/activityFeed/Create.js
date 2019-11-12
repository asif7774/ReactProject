import React, { Component } from 'react';
import { Feed , Divider} from 'semantic-ui-react'

import axios from 'axios'
import { BASE_URL } from '../../config/config'
import TimeAgo from 'react-timeago'
export default class Create extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user: null
        }
    }

    getUserImage() {

        axios.get(`${BASE_URL}/api/v1/user/${this.props.item.user_id}`, { withCredentials: true })
            .then(res => {
                console.log(res.data);
                this.setState({
                    image: res.data.Item.image
                })
            })
            .catch(err => {
                console.log(err);
            })
    }
    componentWillMount() {
        this.getUserImage()
    }
    render() {

        return (
            <Feed.Event>
                <Feed.Label image={this.state.image} />
                <Feed.Content>
                    <Feed.Date><TimeAgo date={this.props.item.timestamp} /></Feed.Date>
                    <Feed.Summary>
                        {this.props.item.user_name} Created {this.props.item.product_name} as a product
                    </Feed.Summary>
                    <Divider />
                </Feed.Content>
            </Feed.Event>
        )
    }
}