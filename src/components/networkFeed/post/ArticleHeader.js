import React from 'react';
import { Link } from 'react-router-dom';
import { Dropdown, Icon, Divider } from 'semantic-ui-react'
import ProfileImage from '../ProfileImage';

class ArticleHeader extends React.Component {
    constructor(props) {
        super(props);
        this.state = { displayName: '', image: '' }
    }

    render() {
        const { feedType, removePost, userInfoCollection, article, auth, entityId } = this.props;
        const userInfo = userInfoCollection.find(item => item.id === article.user_id);

        const displayName = userInfo ? userInfo.displayName : '';
        const image = userInfo ? userInfo.image : '';
        const postDate = new Date(article.added).toLocaleString(undefined, { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

        return (
            <React.Fragment>
                <div className="art-header-img">
                    {
                        image ?
                            <ProfileImage image={image} />
                            :
                            displayName.substring(0, 1)
                    }
                </div>

                <div className="art-header-meta">
                    <Link to={`/networkFeed/user/${article.user_id}`}>{displayName}</Link>
                    <span className="small">
                        {/* <span>{followers} Followers </span>|<span> {days} Day</span> */}
                        <span>{postDate}</span>
                    </span>
                </div>
                {
                    article.user_id === auth.id &&
                    <div className="art-header-drop-down">
                        <Dropdown trigger={<Icon size='mini' className="text-blue" name={'ellipsis horizontal'} />}>
                            <Dropdown.Menu direction='right' style={{ borderRadius: "10px" }}>
                                {/* <Dropdown.Item className="dropDownThreeDots" text='Share this post' /> */}
                                <Dropdown.Item className="dropDownThreeDots" text='Remove this post' onClick={() => removePost(article.id, feedType, auth.id, entityId)} />
                                {/* <Dropdown.Item className="dropDownThreeDots" text='Block feed from this user' /> */}
                                {/* <Divider />
                            <Dropdown.Item style={{ marginTop: "5px", marginBottom: "5px" }} className="dropDownThreeDots" text='Report Abuse' /> */}
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                }
            </React.Fragment>
        )
    }
}

export default ArticleHeader;