import React from 'react';
import { Form, Comment, Loader } from 'semantic-ui-react'
import IndividualComment from './IndividualComment';

class CommentLayout extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            comment: '',
            commentsPagination: {
                currentPage: 1,
                pageSize: 5,
                totalPages: 0
            }
        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.comments) {
            const totalPages = nextProps.comments && nextProps.comments.length / 5;
            let commentsPagination = { ...this.state.commentsPagination };
            commentsPagination.totalPages = totalPages;
            this.setState({ commentsPagination });
        }

        if (nextProps.addPostCommentStatus === "created") {
            this.setState({ comment: '' })
        }
    }
    handleCommentChange = (e, { name, value }) => {
        this.setState({ [name]: value })
    }
    postComment = () => {
        if (!this.state.comment) return;
        this.props.addPostComment(this.props.postId, this.state.comment);
    }
    getUserInfo = (userId) => {
        return this.props.userInfoCollection.find(item => item.id === userId);
    }
    showMoreComments = () => {
        let commentsPagination = { ...this.state.commentsPagination };
        commentsPagination.currentPage = commentsPagination.currentPage + 1;
        this.setState({ commentsPagination });
    }

    render() {
        const loggedInUserId = this.props.auth.id;
        const loggedInUserInfo = this.getUserInfo(loggedInUserId);
        const loggedInUserImage = loggedInUserInfo ? loggedInUserInfo.image : '';
        const { currentPage, totalPages, pageSize } = this.state.commentsPagination;
        const commentsToBeShown = this.props.comments && this.props.comments.slice(0, currentPage * pageSize);

        return (
            <Comment.Group className="comments-box">
                {!this.props.comments && <Loader active />}
                {
                    commentsToBeShown && commentsToBeShown.map(comment =>
                        <IndividualComment comment={comment} getUserInfo={this.getUserInfo} key={comment.id} />
                    )
                }
                <Comment>
                    {
                        loggedInUserImage ?
                            <Comment.Avatar src={loggedInUserImage} />
                            :
                            <div className="comment-initials-img">{loggedInUserInfo ? loggedInUserInfo.displayName.substring(0, 1) : ''} </div>
                    }
                    <Comment.Content>
                        <Form reply>
                            <Form.Group>
                                <Form.Input placeholder='Write something' autoComplete="off" className="w100" name='comment' onChange={this.handleCommentChange} value={this.state.comment} />
                                <Form.Button content='Post' primary onClick={this.postComment} disabled={this.props.addPostCommentStatus === "creating"}/>
                                <Loader className="add_comment_loader" active={this.props.addPostCommentStatus === "creating"} inline />
                            </Form.Group>
                        </Form>
                    </Comment.Content>
                </Comment>
                {
                    totalPages > 1 && currentPage < totalPages &&
                    <a className="text-blue" dividing='true' onClick={this.showMoreComments}>
                        View 5 more comments
                    </a>
                }

            </Comment.Group>

        )
    }
}

export default CommentLayout;