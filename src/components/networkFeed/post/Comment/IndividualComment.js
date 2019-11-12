import React from 'react';
import { Form, Comment, Loader } from 'semantic-ui-react'

const CommentActions = (props) => {
    return (
        <Comment.Actions>
            <Comment.Action></Comment.Action>
            {/* <Comment.Action>Like</Comment.Action> */}
            <Comment.Action></Comment.Action>
            {/* <Comment.Action>Reply</Comment.Action> */}
            <Comment.Metadata>
                <div>{props.commentDate}</div>
            </Comment.Metadata>
        </Comment.Actions>
    )
};

const CommentContent = (props) => {
    const { comment, userInfo } = props;
    const commentDate = new Date(comment.added).toLocaleString(undefined, { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
    return (
        <Comment.Content>
            <Comment.Author>{userInfo.displayName}
                <Comment.Text as='span'>{comment.text}</Comment.Text>
            </Comment.Author>
            <CommentActions commentDate={commentDate} />
        </Comment.Content>
    );
}
class IndividualComment extends React.Component {

    render() {
        const userInfo = this.props.getUserInfo(this.props.comment.user_id);
        const { comment } = this.props;
        const image = userInfo ? userInfo.image : '';
        const userName = userInfo.displayName ? userInfo.displayName : '';
        return (
            <Comment>
                {
                    image ?
                        <Comment.Avatar src={image} />
                        :
                        <div className="comment-initials-img">{userName.substring(0, 1)} </div>
                }
                <CommentContent comment={comment} userInfo={userInfo} />
                {/* {
                                comment.replies.length > 0 &&
                                <Comment.Group>
                                    {
                                        comment.replies.map(reply =>
                                            <React.Fragment>
                                                <Comment>
                                                    <Comment.Avatar src={reply.avatarUrl} />
                                                    <CommentContent comment={reply} />
                                                </Comment>
                                            </React.Fragment>
                                        )
                                    }
                                </Comment.Group>
                            } */}
            </Comment>
        )
    }
}

export default IndividualComment;