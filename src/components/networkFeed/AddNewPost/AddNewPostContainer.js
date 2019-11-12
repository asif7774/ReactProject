import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Grid, Button, Progress } from 'semantic-ui-react';

import NewPostEditor from "./NewPostEditor";
import NewArticle from './NewArticle';
import { networkFeedActions } from '../../../actions';
import Previewer from './Previewer';

class AddNewPostContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            postMediaType: '',
            postMediaUrl: '',
            post: {
                "userId": props.auth.id,
                "visibility": "public",
                "taggedProduct": []
            }
        }

        this.submitPost = this.submitPost.bind(this);
        this.assemblePost = this.assemblePost.bind(this);
        this.defaultPostState = JSON.parse(JSON.stringify(this.state.post));
        this.previewPostMedia = this.previewPostMedia.bind(this);
    }

    submitPost() {
        if (this.props.feedType === "product") {
            const post = this.state.post;
            const taggedProducts = this.state.post.taggedProduct.slice();

            taggedProducts.push(this.props.entityId)
            post.taggedProduct = taggedProducts;

            this.setState({ post })
        }
        this.props.createNewPost(this.state.post, this.props.feedType, this.props.entityId);
        this.setState({
            post: {
                "userId": this.props.auth.id,
                "visibility": "public",
                "taggedProduct": []
            }
        })
    }

    assemblePost(name, value) {
        this.setState({ post: this.defaultPostState })

        const post = this.state.post;
        post[name] = value;
        this.setState({ post })
    }

    previewPostMedia(postMediaType, postMediaUrl) {
        this.setState({
            postMediaType,
            postMediaUrl
        })
    }

    render() {
        const { auth, postStatus, feedType, uploadProgress } = this.props;
        const { postMediaType, postMediaUrl } = this.state;
        const showProgressBar = uploadProgress > 0 && postStatus === 'creating';

        return (
            <Grid.Row className="background-white extra-padding-sides">

                <Grid.Column width={16} className="mT-10 min-43">
                    <NewPostEditor auth={auth} assemblePost={this.assemblePost} previewPostMedia={this.previewPostMedia} postStatus={postStatus} feedType={feedType} />
                </Grid.Column>

                <Grid.Column width={16} className="mT-10">

                    <NewArticle assemblePost={this.assemblePost} previewPostMedia={this.previewPostMedia} postStatus={postStatus} />
                    <Previewer type={postMediaType} url={postMediaUrl} postStatus={postStatus} />
                    <Button primary size='mini' floated='right' className="btn-sm" onClick={this.submitPost} loading={postStatus === 'creating'}>Post</Button>
                    <div className="border-b mT-10" />
                    {
                        showProgressBar &&
                        <Progress className="upload-control" percent={uploadProgress} size='tiny' autoSuccess color='blue' />
                    }

                </Grid.Column>

            </Grid.Row>
        )
    }
}

function mapStateToProps({ networkFeed }) {
    return { postStatus: networkFeed.postStatus, uploadProgress: networkFeed.uploadProgress };
}

const mapDispatchToProps = dispatch => {
    return {
        ...bindActionCreators(networkFeedActions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddNewPostContainer);
