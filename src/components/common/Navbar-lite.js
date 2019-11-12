import React, { Component } from "react";
import { Link } from "react-router-dom";
// import { Field, reduxForm } from 'redux-form';
import { connect } from "react-redux";
import * as actions from "../../actions";
import {
  Container,
  Sidebar,
  Label,
  Button,
  Image,
  Menu,
  Segment,
  Responsive
} from "semantic-ui-react";
import "./style.css";
import mappesLogo from "./mappesLogo-white.svg";
// import productIcon from './icon-box.png';
// import thumbIcon from './icon-thumbs-up.png';
// import globetIcon from './icon-globe.png';
import { BASE_URL } from "../../config/config";

import axios from "axios";
import notificationTemplate from "../notifications/templates";

class NavbarLite extends Component {
  constructor(props) {
    super(props);
    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.setUserWrapperRef = this.setUserWrapperRef.bind(this);
    this.onClick = this.onClick.bind(this);
    this.onClickUser = this.onClickUser.bind(this);
    this.handleOutsideClick = this.handleOutsideClick.bind(this);
    this.handleOutsideClickUser = this.handleOutsideClickUser.bind(this);
    this.state = {
      visible: false,
      activeIndex: "",
      profileOption: false,
      hidden: false,
      hiddenUser:false,
      notification: [],
      profilePic : ''
    };
  }

  registerUserForChat() {
    axios
      .post(`${BASE_URL}/chat/users`, {}, { withCredentials: true })
      .then(() => {
        // console.log(res);
      })
      .catch(err => {
        console.log(err);
      });
  }

  componentWillMount() {
    this.resetComponent();
    this.getNotifications();
    if (this.props.auth) {
      this.registerUserForChat();
      this.getUserPicture(this.props.auth);      
    }
  }
  componentWillReceiveProps(nextProps) {
    if (!this.props.auth && nextProps && nextProps.auth) {
      this.registerUserForChat();
      this.getUserPicture(nextProps.auth);
    }
  }
  getUserPicture(user) {
    if (user) {
        let id = user.id
        axios.get(`${BASE_URL}/api/v1/user/${id}`, { withCredentials: true })
            .then(response => {
                // console.log(response.data.Item.image);
                this.setState({
                    profilePic: response.data.Item.image
                })
            }).catch(err => {
                console.log(err);
            })
    }
}
  getNotifications() {
    axios
      .get(`${BASE_URL}/api/v1/user/notification/all`, {
        withCredentials: true
      })
      .then(response => {
        // console.log(response);
        if (response && response.data && response.data.Items) {
          this.setState({
            notification: response.data.Items
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
  }
  renderNotifications() {
    return this.state.notification.map((n, i) => notificationTemplate(n, i));
  }
  resetComponent = () =>
    this.setState({ isLoading: false, results: [], value: "" });

  handleResultSelect = (e, { result }) => {
    if (result._index === "products") {
      this.props.history.push(`/product/${result._source.id}`);
    } else {
      this.props.history.push(`/company/${result._source.id}`);
    }
  };

  handleSearchChange = (e, { value }) => {
    this.setState({ value });
    if (value.length > 2) {
      this.setState({ isLoading: true });
      axios
        .get(`${BASE_URL}/api/v1/productandcompany/search/${value}`, {
          withCredentials: true
        })
        .then(response => {
          console.log(response.data);
          this.setState({
            isLoading: false,
            results: response.data
          });
        });
    }
  };

  toggleVisibility() {
    this.setState({
      visible: !this.state.visible
    });
  }
  // renderProfileImage() {
  //   if (
  //     this.props.auth &&
  //     this.props.auth._json &&
  //     this.props.auth._json.pictureUrls
  //   ) {
  //     return (
  //       <Image
  //         className="avatar-36"
  //         avatar
  //         src={this.props.auth._json.pictureUrls.values[0]}
  //       />
  //     );
  //   }
  // }
  renderProfileImage() {
    if (this.props.auth) {
      return (
        <Link to={`/networkFeed/user/${this.props.auth.id}`}>
          {this.state.profilePic ?
            <Image className="avatar-36" avatar src={this.state.profilePic} />
            :
            <Label circular color="blue" className="notification-initials">
              {this.props.auth.displayName.substring(0, 1)}
            </Label>

          }
        </Link>
      )
    }
  }

  renderProfileImageSmall() {
    if (
      this.props.auth &&
      this.props.auth._json &&
      this.props.auth._json.pictureUrls
    ) {
      return (
        <Image
          avatar
          className="avatar-34"
          src={this.props.auth._json.pictureUrls.values[0]}
        />
      );
    }
  }
  handleClick = (e, titleProps) => {
    const { index } = titleProps;
    const { activeIndex } = this.state;
    const newIndex = activeIndex === index ? -1 : index;

    this.setState({
      activeIndex: newIndex,
      profileOption: !this.state.profileOption
    });
  };
  onClick() {
    if (!this.state.hidden) {
      document.addEventListener("click", this.handleOutsideClick, false);
    } else {
      document.removeEventListener("click", this.handleOutsideClick, false);
    }
    this.setState(prevState => ({
      hidden: !prevState.hidden
    }));
  }
  handleOutsideClick(e) {
    if (this.wrapperRef && this.wrapperRef.contains(e.target)) {
      return;
    }
    this.onClick();
  }
  onClickUser() {
    if (!this.state.hiddenUser) {
      document.addEventListener("click", this.handleOutsideClickUser, false);
    } else {
      document.removeEventListener("click", this.handleOutsideClickUser, false);
    }
    this.setState(prevState => ({
      hiddenUser: !prevState.hiddenUser
    }));
  }
  handleOutsideClickUser(e) {
    if (this.wrapperRefUser && this.wrapperRefUser.contains(e.target)) {
      return;
    }
    this.onClickUser();
  }
  setWrapperRef(node) {
    // this.wrapperRef = React.createRef()
    this.wrapperRef = node;
  }
  setUserWrapperRef(node) {
    this.setUserWrapperRef = React.createRef()
  }
  render() {
    return (
      <Sidebar.Pushable as={Segment}>
        <Sidebar.Pusher>
          <Menu
            className="blue-color topNav"
            fixed="top"
            size="massive"
            borderless={true}
          >
            <Container>
              <Responsive
                as={Menu.Menu}
                minWidth={768}
                className="item navbar-logo"
              >
                  <Image
                    src={mappesLogo}
                    className="inline-image"
                    width="120"
                  />
              </Responsive>
              <Responsive
                as={Menu.Menu}
                maxWidth={767}
                className="item navbar-logo"
              >
                  <i className="icon-mappers-logo-sm navbar-logo__i" />
              </Responsive>
            </Container>
          </Menu>

          {this.props.children}
          
        </Sidebar.Pusher>
      </Sidebar.Pushable>
    );
  }
}

function mapStateToProps({ auth }) {
  return { auth };
}

export default connect(
  mapStateToProps,
  actions
)(NavbarLite);
