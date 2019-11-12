import React from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';

import { Grid, Dropdown, Icon, Divider } from 'semantic-ui-react'
import ProfileImage from './ProfileImage';
import { Link } from 'react-router-dom';

import { getUserInfo, getUserProfileInfo } from '../../actions';

const Name = ({ name }) => {
    return (
        name ?
            <div className="profile-name">{name}</div>
            :
            <span className="hide-menu">Loading...</span>
    )
}

const Designation = ({ userProfileInfo }) => {
    return (
        <span>{userProfileInfo.designation} at{" "}
            {userProfileInfo.company_updated === 1 &&
                <Link to={`/company/${userProfileInfo.company_id}`}>{userProfileInfo.company}</Link>}
        </span>
    )
}

class ProfileInfo extends React.Component {

    componentDidMount() {
        this.props.getUserInfo(this.props.userId);
        this.props.getUserProfileInfo(this.props.userId);
    }

    componentWillReceiveProps(newProps) {
        const { userId } = newProps;
        if (this.props.userId !== userId) {
            this.props.getUserInfo(userId);
            this.props.getUserProfileInfo(userId);
        }
    }

    render() {
        if (!this.props.user.userProfileInfo) { return null; }
        const { firstName, lastName, desc } = this.props.user.userProfileInfo;
        let image;
        if (this.props.user.userInfoCollection) {
            let userInfo = this.props.user.userInfoCollection.find(userInfo => userInfo.id == this.props.userId);
            if (userInfo) {
                image = userInfo.image;
            }
        }

        return (
            <Grid.Row className="extra-padding-sides">
                <Grid padded className="full-width">
                    <Grid.Column width={16}>
                        <div className="profile-info-bar">
                            <div className="profile-image">
                                {image ?
                                    <ProfileImage image={image} />
                                    :
                                    firstName.substring(0, 1)
                                }
                            </div>
                            <div className="profile-info-text">
                                <div className="profile-name">
                                    <div className="profile-name-text">
                                        <Name name={`${firstName} ${lastName}`} />
                                    </div>
                                    <div className="profile-designation">
                                        <Designation userProfileInfo={this.props.user.userProfileInfo} />
                                    </div>
                                    <div className="profile-company mB-10 ">
                                        {desc}
                                    </div>
                                    <div className="profile-network">
                                        {/* <a className="t600 text-blue">(24 People in the network)</a> */}
                                    </div>

                                    {/* <Button className="mappes-small-button" size='mini' color='green'>Send Message</Button> */}
                                    {/* <div className="profile-drop-down">
                                    <Dropdown trigger={<Icon size='large' name={'ellipsis horizontal'} />}>
                                        <Dropdown.Menu direction='right' style={{ borderRadius: "10px" }}>
                                            <Dropdown.Item className="dropDownThreeDots" text='Share Profile' />
                                            <Dropdown.Item className="dropDownThreeDots" text='Copy Profile Link' />
                                            <Divider />
                                            <Dropdown.Item style={{ marginTop: "5px", marginBottom: "5px" }} className="dropDownThreeDots" text='Report Abuse' />
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div> */}
                                </div>
                            </div>
                        </div>
                    </Grid.Column>
                </Grid>
            </Grid.Row>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return { ...bindActionCreators({ getUserProfileInfo, getUserInfo }, dispatch) }

}
function mapStateToProps({ user }) {
    return { user };
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileInfo);