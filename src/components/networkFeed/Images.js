import React from 'react';
import { Grid } from 'semantic-ui-react'
import Article from './post/Article';

class Images extends React.Component {
    render() {
        const { feed } = this.props;
        let images;
        if (feed) {
            images = feed.filter(item => item.media.image)
        }
        if (!feed || images.length === 0) {
            return <span>No Images at this moment, stay tuned....</span>
        }

        return (
            <Grid>
                <Grid.Column width={16}>
                    <div className="articles">
                        {
                            images.map(article =>
                                <Article article={article} key={article.id} {...this.props} />
                            )
                        }
                    </div>
                </Grid.Column >
            </Grid >
        );
    }
}

export default Images;