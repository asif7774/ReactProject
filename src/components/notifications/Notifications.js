import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Grid, Container, Responsive, List } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import axios from "axios";

import Navbar from '../common/Navbar';
import LeftSidebar from '../common/LeftSidebar';
import RightSection from '../common/RightSection';
import AvatarSmall from "../common/AvatarSmall";

import { BASE_URL } from "../../config/config";
import notificationTemplate from "./templates"

class Notifications extends Component {
    constructor(props) {
        super(props);

        this.state = {
            notification: [],
            loading: true
        };
    }

    getNotifications = () => {
        axios
            .get(`${BASE_URL}/api/v1/user/notification/all`, {
                withCredentials: true
            })
            .then(response => {
                console.log(response);
                if (response && response.data && response.data.Items) {
                    this.setState({
                        notification: response.data.Items
                    });
                }
                this.setState({loading: false})
            })
            .catch(err => {
                console.log(err);
                this.setState({loading: false})
            });
    }

    renderNotifications = () => {
        if(this.state.loading){
            return <List.Item>
                <List.Content>
                    <List.Description>
                        Loading Notifications ...
                    </List.Description>
                </List.Content>
            </List.Item>;
        }
        if(!this.state.notification || this.state.notification.length === 0){
            return <List.Item>
                <List.Content>
                    <List.Description>
                    There are no notifications at this time.
                    </List.Description>
                </List.Content>
            </List.Item>;
        }
        return this.state.notification.map((n, i) => notificationTemplate(n, i));
    }

    componentWillMount() {
        this.getNotifications();
    }

    render() {
        return (
            this.props.auth &&
            <Navbar {...this.props}>
                <div className="primary-background">
                    <Container className="body-background palm-nudge-sides">
                        <Grid padded stackable>
                            <Responsive as={Grid.Column} className="left-content" minWidth={768}>
                                <LeftSidebar />
                            </Responsive>

                            <Grid.Column className='main-content-area'>
                                <div className="main-content">
                                    <div className="main-content_inner">
                                        <List relaxed verticalAlign="middle">
                                            {this.renderNotifications()}
                                        </List>
                                    </div>
                                </div>
                            </Grid.Column>

                            <RightSection />
                        </Grid>
                    </Container>
                </div>
            </Navbar>
        );
    }
}

function mapStateToProps({ auth }) {
    return { auth };
}

export default connect(mapStateToProps)(Notifications);
