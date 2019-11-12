import React from 'react';
import { Grid, Header, Image, Form, TextArea } from 'semantic-ui-react'
import PrivacyToolbar from './PrivacyToolbar';
import ProfileImage from '../ProfileImage';

const Name = (props) => {
    return (
        props.auth ?
            <div className="profile-name">{props.auth.displayName}</div>
            :
            <span className="hide-menu">Loading...</span>
    )
}

class NewPostEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            text: ""
        }
        this.setWrapperRef = this.setWrapperRef.bind(this);
        this.setPostText = this.setPostText.bind(this);
    }

    componentWillReceiveProps(newProps) {
        if (newProps.postStatus !== this.props.postStatus && newProps.postStatus === "created" || newProps.feedType!== this.props.feedType) {
            this.setState({ text: '' })
        }
    }

    setWrapperRef = (node) => {
        this.wrapperRef = node;
    }

    setPostText(event) {
        let postText = event.target.value;
        this.setState({ text: postText });
        let isYouTubeVideo = postText.indexOf('https://www.youtube.com') > -1;
        if (isYouTubeVideo) {
            this.props.previewPostMedia('youtube', postText);
        }
        else {
            //hide Previewer
            this.props.previewPostMedia('', '');
        }
        this.props.assemblePost("text", postText);
    }

    render() {
        const { image, displayName } = this.props.auth
        return (
            <Grid.Column width={16} className="mT-10 min-43" >
                <div className="article-toggle-edit" ref={this.setWrapperRef}>
                    <Header as={'h4'} onClick={this.onClick} className="toggleKey table-heading" >Share an article, Photo or Video of a product</Header>
                    <div className="toggleKey mT-5">
                        <div className="d-flex">
                            <div className="user-avtar-image">
                                {
                                    image ?
                                        <ProfileImage image={image} />
                                        :
                                        <span className="user-initials">
                                            {displayName.substring(0, 1)}
                                        </span>
                                }
                            </div>
                            <Name auth={this.props.auth} />
                        </div>
                        <Form>
                            <TextArea name="text" rows={5} placeholder='Write your amazing post here!!!' onChange={this.setPostText} value={this.state.text} />
                        </Form>
                    </div>
                    <PrivacyToolbar assemblePost={this.props.assemblePost} postStatus={this.props.postStatus} />
                </div>
                <div className="border-b"></div>
            </Grid.Column>
        )
    }
}

export default NewPostEditor;