import React from 'react';
import { Grid, Dimmer, Loader } from 'semantic-ui-react'
import Article from './post/Article';
import {networkFeedMessages} from './types';

class TopStories extends React.Component {
    render() {
        const { feed, feedType } = this.props;
        if (!feed) {
            return (
                <div className="d-flex">
                    <span>Please wait while we fetch relevant posts for you....</span>
                    <Dimmer active inverted className="mT-10 mB-10" style={{ background: 'transparent' }}>
                        <Loader></Loader>
                    </Dimmer>
                </div>
            )
        }
        else if (feed.length === 0) {
            return <span>{networkFeedMessages[feedType]}</span>
        }
        
        return (
            <Grid>
                <Grid.Column width={16}>
                    <div className="articles">
                        {
                            feed && feed.map(article =>
                                <Article article={article} key={article.id} {...this.props} />
                            )
                        }
                    </div>
                </Grid.Column >
            </Grid >
        );
    }
}

export default TopStories;