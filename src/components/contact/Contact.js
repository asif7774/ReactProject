import React, { Component } from 'react';
import * as actions from '../../actions/'
import { connect } from 'react-redux'
import {  Grid, Container, Image, Responsive, Header} from 'semantic-ui-react'

import './Contact.css'
import Navbar from '../common/Navbar'
import LeftSidebar from '../common/LeftSidebar'
import RightSection from '../common/RightSection'


class Contact extends Component {
    renderName() {
        if (this.props.auth) {
            return (
                <span>{this.props.auth.displayName.split(" ")[0]} {this.props.auth.displayName.split(" ")[1]}</span>
            )
        } else {
            return (
                <span>Loading...</span>
            );
        }
    }
    renderProfileImage() {
        if (this.props.auth && this.props.auth._json && this.props.auth._json.pictureUrls) {
            return (
                <Image className="avatar-40" avatar src={this.props.auth._json.pictureUrls.values[0]} />
            )
        }

    }

    render() {
        console.log(this.props.user)
        return (
            <Navbar>
                <div className="primary-background">    
                    <Container className="body-background palm-nudge-sides">
                        <Grid padded stackable>
                            <Responsive as={Grid.Column} className="left-content" minWidth={768}>
                                <LeftSidebar />
                            </Responsive>
                            <Grid.Column className='main-content-area'>
                                <div className="main-content">
                                    <div className="main-content_inner">
                                        <Grid padded>
                                            <Grid.Row className="background-white extra-padding-sides pD-t-25">
                                                <Grid.Column textAlign='center' className='contact-us-section' width={16}>
                                                    <Header as='h1' dividing>
                                                        CONTACT US
                                                    </Header>
                                                    <br />
                                                    <p className="mT-5">Thank you for using Mappes Please drop us an e-mail.</p>
                                                    <Header as='h3' >
                                                        <a className="color-light-blue" href="mailto:ankit.singhal@mappes.io">ankit.singhal@mappes.io</a>
                                                    </Header>
                                                </Grid.Column>                                             
                                            </Grid.Row>
                                        </Grid>
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

function mapStateToProps({ auth, user }) {
    return { auth, user };
}

export default connect(mapStateToProps, actions)(Contact);
