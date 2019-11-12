import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getUserInfo, networkFeedActions } from '../../../actions';
import { Icon, Button, Popup, Transition } from 'semantic-ui-react'
import CommentLayout from './Comment/CommentLayout';

class ArticleFooter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showCommentsSection: false,
            likePostClicked: false,
            unlikePostClicked: false
        }
        this.showHideComments = this.showHideComments.bind(this);
    }

    showHideComments() {
        const { article, getPostComments } = this.props;
        const isCommentsSectionOpen = this.state.showCommentsSection;
        if (!isCommentsSectionOpen) {
            getPostComments(article.id);
        }
        this.setState({ showCommentsSection: !isCommentsSectionOpen })
    }

    handleLikeClick = (isPostLiked) => {
        const { likePost, unlikePost, article, auth } = this.props;
        const userId = auth.id;
        if (isPostLiked) {
            unlikePost(article.id, userId);
            this.setState({
                unlikePostClicked: true,
                likePostClicked: false
            })
        }
        else {
            likePost(article.id, userId);
            this.setState({
                likePostClicked: true, unlikePostClicked: false
            })
        }

    }

    render() {
        const { addPostComment, likedPosts, postCommentsCollection, getUserInfo, userInfoCollection, auth, postLikeCount, addPostCommentStatus } = this.props;
        let { like_count, comment_count, id } = this.props.article;
        if (postCommentsCollection[id] && postCommentsCollection[id].length > comment_count) {
            comment_count = postCommentsCollection[id].length;
        }
        if (postLikeCount && postLikeCount.postId === id && postLikeCount.count > like_count) {
            like_count = postLikeCount.count;
        }
        let isPostLiked = false;
        const comments = postCommentsCollection[id];
        if (this.state.likePostClicked) {
            isPostLiked = true;
        }
        else if (this.state.unlikePostClicked) {
            isPostLiked = false;
        }
        else if (likedPosts && likedPosts.some(post => post.parent_id == id)) {
            isPostLiked = true;
        }

        return (
            <React.Fragment>
                <div className="art-footer-top pD-r-10 pD-l-10">
                    <a className="color-inherit">{like_count} Likes</a>
                    <span className="inline-block mR-5 mL-5">•</span>
                    <a className={`color-inherit ${this.state.showCommentsSection ? "active" : ""}`} onClick={this.showHideComments}>
                        {comment_count} Comments
                    </a>
                </div>
                <div className="art-footer-bottom pD-r-10 pD-l-10">
                    <a className={`color-inherit mR-10 ${this.state.showCommentsSection ? "active" : ""}`} onClick={this.showHideComments}>
                        <Icon name='comment outline' /> Comment
                    </a>
                    {/* <Popup position='top center' trigger={
                        <a className="color-inherit mR-10">
                            <Icon name='share square' /> Share
                    </a>
                    } flowing hoverable hideOnScroll inverted>
                        <Button circular color='facebook' icon='facebook' />
                        <Button circular color='twitter' icon='twitter' />
                        <Button circular color='linkedin' icon='linkedin' />
                        <Button circular color='google plus' icon='google plus' />
                        <Button circular color='instagram' icon='instagram' />
                    </Popup> */}

                    <a className="color-inherit" onClick={() => this.handleLikeClick(isPostLiked)} >
                        <Icon name={`thumbs up${isPostLiked ? '' : ' outline'}`} color={isPostLiked ? 'blue' : ''} />
                    </a>
                </div>
                <Transition visible={this.state.showCommentsSection} animation={"fade down"} duration={"500"}>
                    <div className="comments-box-wrap">
                        <CommentLayout comments={comments} postId={id} addPostComment={addPostComment} getUserInfo={getUserInfo} userInfoCollection={userInfoCollection} auth={auth} addPostCommentStatus={addPostCommentStatus} />
                    </div>
                </Transition>
            </React.Fragment>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return {
        ...bindActionCreators({ getUserInfo, ...networkFeedActions }, dispatch)
    }
}
const mapStateToProps = (state) => {
    return { ...state.networkFeed }
}

export default connect(mapStateToProps, mapDispatchToProps)(ArticleFooter);
