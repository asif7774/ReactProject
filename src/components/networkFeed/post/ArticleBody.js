import React from 'react';
import { Image, Embed, Icon, Button, TransitionablePortal, Modal } from 'semantic-ui-react';
import Microlink from '@microlink/react'
import { helperMethods, constants } from '../../../common'

class ArticleBody extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showPdf: false
        }
    }

    showPdf = () => {
        const { showPdf } = this.state;
        this.setState({ showPdf: !showPdf })
    }

    handleOpen = () => {
        this.setState({ showPdf: !this.state.showPdf })
    }
    render() {
        const { title, imageContent, media, text } = this.props.article;
        const articleMediaType = media && Object.keys(media)[0];

        let imageUrl, videoUrl, pdfUrl, youtubeVideoId, articleUrl;

        switch (articleMediaType) {
            case "image":
                imageUrl = media.image.data;
                break;
            case "video":
                videoUrl = media.video.data;
                break;
            case "pdf":
                pdfUrl = media.pdf.data;
                break;

            default:
                break;
        }

        let articleText = text;
        if (articleText) {
            youtubeVideoId = helperMethods.getYouTubeVideoId(articleText);
            if (youtubeVideoId) {
                articleText = articleText.replace(constants.youtubeUrlRegex, '');
            }

            if (!youtubeVideoId) {
                articleUrl = helperMethods.getUrlFromText(articleText);
            }
        }

        return (
            <React.Fragment>
                <div className="art-body-text">{articleText}</div>
                <div className="art-body-media">
                    {
                        youtubeVideoId && <Embed source='youtube' id={youtubeVideoId} active={true} />
                    }
                    {
                        videoUrl &&
                        <video width="100%" height="400" controls>
                            <source src={`${videoUrl}#t=1`} type="video/mp4" />
                            {/* <source src="movie.ogg" type="video/ogg" /> */}
                        </video>
                    }
                    {
                        imageUrl && <Image src={imageUrl} width="100%" height="400" />
                    }
                    {
                        pdfUrl &&
                        <React.Fragment>
                            <Button
                                content='Full View'
                                icon='expand'
                                labelPosition='right'
                                floated="right"
                                style={{ marginBottom: '16px' }}
                                onClick={this.showPdf}
                            />
                            <embed src={`https://docs.google.com/gview?embedded=true&url=${pdfUrl}&amp;`} width="100%" height="400px" type="application/pdf"/>
                            <TransitionablePortal open={this.state.showPdf}>
                                <Modal
                                    dimmer
                                    open={true}
                                    onClose={this.handleOpen}
                                    size='fullscreen'
                                    className='conversation-box'
                                >
                                    <div>
                                        <Button icon="delete" circular size="tiny" floated='right' onClick={this.showPdf} />
                                        <embed src={`https://docs.google.com/gview?embedded=true&url=${pdfUrl}&amp;`} width="100%" height="450px" type="application/pdf"/>
                                    </div>
                                </Modal>
                            </TransitionablePortal>

                        </React.Fragment>
                    }
                    {
                        articleUrl &&
                        <Microlink
                            url={articleUrl}
                            size="large"
                            style={{ width: '100%' }}
                        />
                    }
                    {
                        (title || imageContent) &&
                        <div className="art-body-text">
                            {
                                title &&
                                <h3 className="art-body-title"><a className="a white">{title}</a></h3>
                            }
                            {imageContent}
                            <a className="a readmore">Read more</a>
                        </div>
                    }
                </div>
            </React.Fragment>
        )
    }
}

export default ArticleBody;
