import React, { Component } from 'react';
import { Grid, Embed } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

// import Follow from '../../activityFeed/Follow'
// import Create from '../../activityFeed/Create'
// import AddSupplier from '../../activityFeed/AddSupplier'
// import AddStatus from '../../activityFeed/AddStatus'
// import AddRaw from '../../activityFeed/AddRaw'
// import AddApplication from '../../activityFeed/AddApplication'
// import AddYoutube from '../../activityFeed/AddYoutube'
import ico1 from '../icon-5.png';
import ico2 from '../icon-6.png';
import ico3 from '../icon-7.png';
import ico4 from '../icon-8.png';
import MediaPreviewer from '../../common/MediaPreviewer';
import { helperMethods } from '../../../common'
import Microlink from '@microlink/react'

let postIcons = {
    'video': ico1,
    'pdf': ico2,
    undefined: ico3,
    'image': ico4
}

export default class Activity extends Component {

    render() {
        const { productName, activity, productId } = this.props;
        let previewerMediaType, previewerMediaUrl, postWithMedia, alternatePostWithMedia, articleText, youtubeVideoId, articleUrl, mediaPostText;

        let topPosts = activity.slice(0, 5);
        if (topPosts.length > 0) {
            postWithMedia = topPosts.find(post => Object.keys(post.media).length > 0)
            if (postWithMedia) {
                previewerMediaType = Object.keys(postWithMedia.media)[0];
                previewerMediaUrl = postWithMedia.media[previewerMediaType].data;

                if (topPosts.length > 1) {
                    topPosts.splice(topPosts.findIndex(post => post.id === postWithMedia.id), 1);
                }
            }
            else {
                alternatePostWithMedia = activity.find(post => {
                    articleText = post.text;
                    if (articleText) {
                        youtubeVideoId = helperMethods.getYouTubeVideoId(articleText);
                        if (youtubeVideoId) {
                            return true;
                        }

                        if (!youtubeVideoId) {
                            articleUrl = helperMethods.getUrlFromText(articleText);
                            if (articleUrl) {
                                return true;
                            }
                        }
                    }

                })
            }
        }

        if (postWithMedia && postWithMedia.text) {
            mediaPostText = postWithMedia.text.length > 100 ? postWithMedia.text.substring(0, 100) + '...' : postWithMedia.text;
        }
        else if (alternatePostWithMedia && alternatePostWithMedia.text) {
            mediaPostText = alternatePostWithMedia.text.length > 100 ? alternatePostWithMedia.text.substring(0, 100) + '...' : alternatePostWithMedia.text;
        }

        return (
            <Grid padded>
                <Grid.Row className="extra-padding-sides pD-t-3">
                    <Grid.Column width={16}>
                        <h4 className="activity-head">{productName}'s activity</h4>
                    </Grid.Column>
                    <Grid.Column width={16}>
                        <Grid stackable>
                            <Grid.Column width={8}>
                                {
                                    topPosts.length > 0 && (postWithMedia || alternatePostWithMedia) &&
                                    <div className="activity-card">
                                        <a href="#">
                                            {
                                                postWithMedia &&
                                                <MediaPreviewer type={previewerMediaType} url={previewerMediaUrl} />
                                            }
                                            {
                                                alternatePostWithMedia &&
                                                    youtubeVideoId ?
                                                    <Embed source='youtube' id={youtubeVideoId} active={true} />
                                                    :
                                                    articleUrl &&
                                                    <Microlink
                                                        url={articleUrl}
                                                        size="large"
                                                        style={{ width: '100%' }}
                                                    />
                                            }
                                        </a>
                                        <div className="activity-card-block">
                                            <p>{mediaPostText}</p>
                                        </div>
                                    </div>
                                }
                            </Grid.Column>
                            <Grid.Column width={8}>
                                {
                                    topPosts.length > 0 ?
                                        <React.Fragment>
                                            <ul className="activity-list">
                                                {
                                                    topPosts.map(post => !post ? <div></div> :
                                                        <li className="cursor-pointer" onClick={() => this.props.history.push(`/networkFeed/product/${productId}`)}>
                                                            <div className="activity-list-icon">
                                                                <img src={postIcons[Object.keys(post.media)[0]]} alt="activityImg" />
                                                            </div>
                                                            <div className="activity-list-text">
                                                                {post.text && post.text.substring(0, 90)}{post.text && post.text.length > 100 && '...'}
                                                            </div>
                                                        </li>)
                                                }

                                            </ul>
                                            <Link to={`/networkFeed/product/${productId}`} className="t600 text-blue mT-10">See all activity</Link>
                                        </React.Fragment>
                                        :
                                        <Link to={`/networkFeed/product/${productId}`}>Go to {productName}'s Feed</Link>
                                }
                            </Grid.Column>
                        </Grid>
                    </Grid.Column>
                </Grid.Row>
            </Grid >
        )
    }

}
