import React, { Component } from 'react';
import { Feed, Divider } from 'semantic-ui-react'
import axios from 'axios'
import { BASE_URL } from '../../config/config'
import TimeAgo from 'react-timeago'
import YouTube from 'react-youtube'
export default class AddYoutube extends Component {
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
    _onReady(event) {
        // access to player in all event handlers via event.target
        event.target.pauseVideo();
    }
    render() {
        const opts = {
            height: '300',
            width: '500',
            playerVars: { // https://developers.google.com/youtube/player_parameters
                autoplay: 1
            }
        };
        return (

            <Feed.Event>
                <Feed.Label image={this.state.image} />
                <Feed.Content>
                    <Feed.Date><TimeAgo date={this.props.item.timestamp} /></Feed.Date>
                    <Feed.Summary>
                        {this.props.item.user_name} added a youtube video to  {this.props.item.product_name}
                    </Feed.Summary>
                    <Feed.Extra text>
                        <YouTube
                            videoId={this.props.item.link}
                            opts={opts}
                            onReady={this._onReady}
                        />
                    </Feed.Extra>
                    <Divider />
                </Feed.Content>
            </Feed.Event>
        )
    }
}