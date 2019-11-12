import React from 'react';
import { connect } from 'react-redux';

import { Grid, Tab } from 'semantic-ui-react'
import TopStories from './TopStories';
import Articles from './Articles';
import Images from './Images';
import Videos from './Videos';
import { networkFeedActions } from '../../actions';
import { bindActionCreators } from 'redux';

class PostsContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            feedType: props.feedType,
            activeTab: 0
        }
    }

    componentDidMount() {
        this.getNetworkFeed();
    }

    componentWillReceiveProps(newProps) {
        if (newProps.feedType !== this.props.feedType || newProps.entityId !== this.props.entityId) {
            this.setState({ feedType: newProps.feedType, activeTab: 0 }, () => this.getNetworkFeed())
        }
    }

    getNetworkFeed = () => {
        const { feedType } = this.state;
        const { auth, entityId, getUserNetworkFeed, getProductNetworkFeed, getUserGlobalFeed, getLikedPosts } = this.props;

        this.props.getLikedPosts(auth.id);

        if (feedType === "user") {
            getUserNetworkFeed(auth.id, entityId);
        }
        else if (feedType === "product") {
            getProductNetworkFeed(auth.id, entityId);
        }
        else if (feedType === "global") {
            getUserGlobalFeed(auth.id);
        }
    }

    handleTabChange = (e, { activeIndex }) => {
        this.setState({ activeTab: activeIndex })
    }

    render() {
        const { auth, userInfoCollection, removePost, entityId, userFeed, productFeed, globalFeed, likedPosts } = this.props;
        const { feedType, activeTab } = this.state;
        const feed = { "user": userFeed, "product": productFeed, "global": globalFeed }[feedType];

        const panes = [
            { menuItem: 'Top Stories', render: () => <Tab.Pane attached={false}><TopStories feed={feed} auth={auth} userInfoCollection={userInfoCollection} removePost={removePost} feedType={feedType} entityId={entityId} likedPosts={likedPosts} /></Tab.Pane> },
            { menuItem: 'Articles', render: () => <Tab.Pane attached={false}><Articles feed={feed} auth={auth} userInfoCollection={userInfoCollection} removePost={removePost} feedType={feedType} entityId={entityId} likedPosts={likedPosts} /></Tab.Pane> },
            { menuItem: 'Videos', render: () => <Tab.Pane attached={false}><Videos feed={feed} auth={auth} userInfoCollection={userInfoCollection} removePost={removePost} feedType={feedType} entityId={entityId} likedPosts={likedPosts} /></Tab.Pane> },
            { menuItem: 'Images', render: () => <Tab.Pane attached={false}><Images feed={feed} auth={auth} userInfoCollection={userInfoCollection} removePost={removePost} feedType={feedType} entityId={entityId} likedPosts={likedPosts} /></Tab.Pane> }
        ]

        return (
            <Grid.Column width={16} className="mT-10">
                <Tab className="custom-tab mobile-menu-icon-tab" menu={{ secondary: true, pointing: true }} panes={panes} activeIndex={activeTab} onTabChange={this.handleTabChange} />
            </Grid.Column>

        )
    }
}

const mapStateToProps = (state) => {
    return { ...state.networkFeed, ...state.user, ...state.likedPosts }
}
const mapDispatchToProps = dispatch => {
    return {
        ...bindActionCreators(networkFeedActions, dispatch)
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(PostsContainer);