import React, { Component } from 'react'
import { Image, Label } from 'semantic-ui-react'
import * as actions from "../../actions/"
import { connect } from "react-redux"

class Avatar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            profilePic: '',
            name: ' '
        }
        this.getUserPicture = this.getUserPicture.bind(this)
    }
    componentWillMount() {
        this.getUserPicture(this.props);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.id != nextProps.id) {
            this.getUserPicture(nextProps)
        }
        else if(this.state.name === ' '){
            let userInfos = nextProps.user.userInfoCollection.filter(userInfo => userInfo && userInfo.id == nextProps.id);
            if (userInfos.length > 0) {
                this.setState({
                    profilePic: userInfos[0].image,
                    name: userInfos[0].displayName
                })
            }
        }
    }
    getUserPicture(props) {
        this.setState({profilePic: '', name: ' '})
        let userInfos = props.user.userInfoCollection.filter(userInfo => userInfo && userInfo.id == props.id);
        if (userInfos.length > 0) {
            this.setState({
                profilePic: userInfos[0].image,
                name: userInfos[0].displayName
            })
        }
        else {
            props.getUserInfo(props.id)
        }
    }
    render() {
        return (this.state.profilePic ?
            <Image className="avatar-40" avatar src={this.state.profilePic} key={this.props.id} />
            :
            <Label circular color="blue" className="notification-initials-40" key={this.props.id}>
                {this.state.name.substring(0, 1)}
            </Label>
        )
    }
}

function mapStateToProps({ user }) {
    return { user };
}

export default connect(mapStateToProps, actions)(Avatar);

