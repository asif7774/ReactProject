import React from 'react';
import ArticleHeader from './ArticleHeader';
import ArticleBody from './ArticleBody';
import ArticleFooter from './ArticleFooter';

const Article =(props)=> {
        return (
            <article className="article" >
                <div className="article-header">
                    <ArticleHeader {...props}/>
                </div>
                <div className="article-body">
                    <ArticleBody {...props}/>
                </div>
                <div className="article-footer">
                    <ArticleFooter {...props}/>
                </div>
            </article>
        )
}

export default Article;