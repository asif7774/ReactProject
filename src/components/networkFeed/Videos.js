import React from 'react';
import { Grid } from 'semantic-ui-react'
import Article from './post/Article';
import { helperMethods } from '../../common'

class Videos extends React.Component {
    render() {
        const { feed } = this.props;
        let videos;
        if (feed) {
            videos = feed.filter(item =>
                item.media.video || helperMethods.getYouTubeVideoId(item.text)
            );
        }
        if (!feed || videos.length === 0) {
            return <span>No videos at this moment, stay tuned....</span>
        }

        return (
            <Grid>
                <Grid.Column width={16}>
                    <div className="articles">
                        {
                         videos.map(article =>
                                <Article article={article} key={article.id} {...this.props} />
                            )
                        }
                    </div>
                </Grid.Column >
            </Grid >
        );
    }
}

export default Videos;