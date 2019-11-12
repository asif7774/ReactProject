import React from 'react';
import { Grid } from 'semantic-ui-react'
import Article from './post/Article';
import { helperMethods } from '../../common'

class Articles extends React.Component {
    render() {
        const { feed } = this.props;
        let articles;
        if (feed) {
            articles = feed.filter(item =>
                (Object.keys(item.media).length === 0 && !helperMethods.getYouTubeVideoId(item.text))
                || item.media.pdf
            )
        }
        if (!feed || articles.length === 0) {
            return <span>No Articles at this moment, stay tuned....</span>
        }

        return (
            <Grid>
                <Grid.Column width={16}>
                    <div className="articles">
                        {
                            articles.map(article =>
                                <Article article={article} key={article.id} {...this.props} />
                            )
                        }
                    </div>
                </Grid.Column >
            </Grid >
        );
    }
}

export default Articles;