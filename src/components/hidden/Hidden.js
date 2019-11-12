import React, { Component } from 'react';
import * as actions from '../../actions'
import { connect } from 'react-redux'
import {  Grid, Container, Responsive, Header} from 'semantic-ui-react'

import './Contact.css'
import Navbar from '../common/Navbar'
import LeftSidebar from '../common/LeftSidebar'
import RightSection from '../common/RightSection'


class Hidden extends Component {

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
                                                        I am Hidden by choice
                                                    </Header>
                                                    <br />
                                                    <p className="mT-5">Well if you think about it, you can see me right now; so am I hidden? What does the title mean anyway ? They guy who made this page was sleep deprived, hungry and most probably working in a startup...if you want to shoot him, reach him using contact below. <br /><strong> P.S. Make sure to leave some gummy bears around when you leave :) </strong></p>
                                                    <Header as='h3' >
                                                        <a className="color-light-blue" href="mailto:rishabh.jain@mappes.io">rishabh.jain@mappes.io</a>
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

export default connect(mapStateToProps, actions)(Hidden);
