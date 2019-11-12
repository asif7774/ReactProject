import React, { Component } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { Grid, Container, Responsive, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import Navbar from '../common/Navbar';
import LeftSidebar from '../common/LeftSidebar';
import RightSection from '../common/RightSection';
import ProfileInfo from './ProfileInfo';
import AddNewPostContainer from './AddNewPost/AddNewPostContainer';
import PostsContainer from './PostsContainer';
import * as productActions from '../../actions/product/product';
import { getUserProfileInfo, networkFeedActions } from '../../actions'
import LoginBar from '../common/LoginBar'
import './feed.css';
import './profileFeed.css';

class NetworkFeedLayout extends Component {

    componentDidMount() {
        window.scrollTo({ left: 0, top: 0 });
        const { feedType, entityId } = this.props.match.params;
        if (feedType === "product" && !this.props.singleProduct.info) {
            this.props.getProductInfo(entityId);
        }
    }

    render() {
        let { feedType, entityId } = this.props.match.params;

        let productName = "";
        if (feedType === "product") { productName = this.props.singleProduct.info && this.props.singleProduct.info.Item.name }

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
                                        {feedType === "product" &&
                                            <Grid padded>
                                                <div>
                                                    <Link to={`/product/${entityId}`}>
                                                        <Icon name="chevron left" />
                                                        <span>Go back to {productName} page</span>
                                                    </Link>
                                                </div>
                                            </Grid>
                                        }

                                        {!this.props.auth ?
                                            <Grid padded>
                                                <span>Please login to view this page</span>
                                            </Grid>
                                            :
                                            <div>
                                                {feedType === "user" &&
                                                    < Grid padded>
                                                        <ProfileInfo auth={this.props.auth} userId={entityId} />
                                                    </Grid>
                                                }

                                                <Grid padded>
                                                    <Grid.Row className="background-white extra-padding-sides">
                                                        <Grid.Column width={16} className="mT-10">
                                                            <AddNewPostContainer auth={this.props.auth} feedType={feedType} entityId={entityId} />
                                                        </Grid.Column>
                                                    </Grid.Row>
                                                </Grid>

                                                <Grid padded>
                                                    <Grid.Row className="background-white extra-padding-sides">
                                                        <PostsContainer userInfoCollection={this.props.user.userInfoCollection} auth={this.props.auth} feedType={feedType} entityId={entityId} />
                                                    </Grid.Row>
                                                </Grid></div>}

                                    </div>
                                </div>
                            </Grid.Column>
                            <RightSection />
                        </Grid>
                    </Container>
                </div>
                <div className="other-page-login-bar">
                    <LoginBar className="other-page-login-bar" location={this.props.location} loginModelOpenCallback={() => { this.setState({ modalOpen: false }) }} />
                </div>

            </Navbar >
        );
    }
}
function mapDispatchToProps(dispatch) {
    return { ...bindActionCreators({ ...productActions, ...networkFeedActions, getUserProfileInfo }, dispatch) }

}
function mapStateToProps({ auth, user, singleProduct }) {
    return { auth, user, singleProduct };
}

export default connect(mapStateToProps, mapDispatchToProps)(NetworkFeedLayout);
