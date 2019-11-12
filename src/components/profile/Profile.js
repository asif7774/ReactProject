import React, { Component } from 'react';
import * as actions from '../../actions/';
import { connect } from 'react-redux';
import { Grid, Container, Responsive, Tab } from 'semantic-ui-react';

import Navbar from '../common/Navbar';
import LeftSidebar from '../common/LeftSidebar';
import RightSection from '../common/RightSection';
import UserInfo from './UserInfo.js';
import CompanyInfo from './CompanyInfo.js';
import ProductInfo from './ProductInfo.js';

class Profile extends Component {
    state = { activeIndex: 0 }
    panes = [
        {
            menuItem: '1', render: () =>
                <Tab.Pane attached={false}>
                    <UserInfo
                        changeTab={this.switchTab.bind(this, 1)}
                        email={this.props.location.state ? this.props.location.state.email : ''}
                    />
                </Tab.Pane>
        },
        {
            menuItem: '2', render: () =>
                <Tab.Pane attached={false}>
                    <CompanyInfo
                        changeTab={this.switchTab.bind(this, 2)}
                        goBack={this.switchTab.bind(this, 0)}
                        {...this.props} 
                    />
                </Tab.Pane>
        },
        {
            menuItem: '3', render: () =>
                <Tab.Pane attached={false}>
                    <ProductInfo goBack={this.switchTab.bind(this, 1)} {...this.props} />
                </Tab.Pane>
        },
    ]

    handleTabChange(e, { activeIndex }) {
        if (this.props.auth) {
            this.setState({ activeIndex });
        }
    }

    switchTab(index) {
        this.handleTabChange(null, { activeIndex: index });
    }

    render() {

        return (
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
                                        <Tab activeIndex={this.state.activeIndex} className="tabWrapper" onTabChange={this.handleTabChange.bind(this)} menu={{ attached: 'bottom', secondary: true }} panes={this.panes} />
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

export default connect(mapStateToProps, actions)(Profile);
