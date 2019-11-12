import React, { Component } from "react";
import { Link } from "react-router-dom";
// import { Field, reduxForm } from 'redux-form';
import { connect } from "react-redux";
import * as actions from "../../actions/";
import {
  Container,
  Sidebar,
  Search,
  Label,
  Icon,
  Grid,
  Header,
  Button,
  Image,
  Menu,
  Segment,
  Responsive,
  Transition,
  Statistic,
  List
} from "semantic-ui-react";
import "./style.css";
import mappesLogo from "./mappesLogo-white.svg";
// import productIcon from './icon-box.png';
// import thumbIcon from './icon-thumbs-up.png';
// import globetIcon from './icon-globe.png';
import linkedin from "./linked-in.png";
import { BASE_URL } from "../../config/config";

import axios from "axios";
import AvatarSmall from "./AvatarSmall";
import notificationTemplate from "../notifications/templates"

const resultRenderer = result => {
  // console.log(result);
  // if (result && result._source && result._source.id)
  //     return <Label key={result._source.id} content={result._source.name} />

  if (result && result._source && result._source.id)
    return (
      <div key={result._source.id}>
        {/* <Label content={result._source.name} /> */}
        {result._index === "products" && (
          <Label content={result._source.name} />
        )}
        {result._index !== "products" && (
          <Label
            content={result._source.name + " (" + result._source.country + ")"}
          />
        )}
        {result._index === "products" && (
          <Label style={{ float: "right" }} content={"Product"} />
        )}
        {result._index !== "products" && (
          <Label style={{ float: "right" }} content={"Company"} />
        )}
      </div>
    );
};

class Navbar extends Component {
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
      notificationsLoading: true,
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

  checkUnreadMessages(chatUser) {
    if(!(chatUser && chatUser.rooms && chatUser.rooms.length > 0)){
      return;
    }
    for(var i in chatUser.rooms){
      if(chatUser.rooms[i].unreadCount > 0){
        if(!this.state.unreadMessages) {
          this.setState({unreadMessages: true})
        }
        return
      }
    }
    if(this.state.unreadMessages){
      this.setState({unreadMessages: false})
    }
  }

  componentWillMount() {
    this.resetComponent();
    this.checkUnreadMessages(this.props.chatUser);
    if (this.props.auth) {
      this.registerUserForChat();
      this.getUserPicture(this.props.auth);
      this.getNotifications();
    }
  }
  componentWillReceiveProps(nextProps) {
    if (!this.props.auth && nextProps && nextProps.auth) {
      this.registerUserForChat();
      this.getUserPicture(nextProps.auth);
      this.getNotifications();
    }
    if(nextProps){
      this.checkUnreadMessages(nextProps.chatUser);
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
        if (response && response.data && response.data.Items && response.data.Items.length > 0) {
          this.setState({
            notification: response.data.Items,
            unreadNotifications: response.data.Items[0].added > (this.props.auth.last_read_notification || 0)
          });
        }
        this.setState({notificationsLoading: false})
      })
      .catch(err => {
        console.log(err);
        this.setState({notificationsLoading: false})
      });
  }
  renderNotifications() {
    if(this.state.notificationsLoading){
      return <List.Item key={0}>
          <List.Content>
              <List.Description>
                  Loading Notifications ...
              </List.Description>
          </List.Content>
      </List.Item>;
  }
  if(!this.state.notification || this.state.notification.length === 0){
      return <List.Item key={0}>
          <List.Content>
              <List.Description>
              There are no notifications at this time.
              </List.Description>
          </List.Content>
      </List.Item>;
  }
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
  updateLastReadNotification(){
    if(this.state.notification && this.state.notification.length > 0){
    axios
      .post(`${BASE_URL}/api/v1/user/notification/lastread`,{ timestamp: this.state.notification[0].added }, {
        withCredentials: true
      }).then(() => {
        this.setState({unreadNotifications: false})
      })
      .catch(err => {
        console.log(err);
      });
    }
  }
  onClick() {
    if (!this.state.hidden) {
      document.addEventListener("click", this.handleOutsideClick, false);
      this.updateLastReadNotification();
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
    const { isLoading, value, results, hidden, hiddenUser } = this.state;
    return (
      <Sidebar.Pushable as={Segment}>
        <Sidebar
          as={Menu}
          className="blue-color sidebar-menu"
          animation="overlay"
          width="wide"
          direction="right"
          visible={this.state.visible}
          icon="labeled"
          vertical
        >
          {!this.props.auth && (
            <Container>
              <Grid padded>
                <Grid.Row>
                  <Grid.Column width={12}>
                    <Image
                      src={mappesLogo}
                      className="inline-image"
                      width="120"
                    />
                  </Grid.Column>
                  <Grid.Column textAlign="right" width={4}>
                    <Icon
                      className="sidebar-menu__toggle"
                      name="cancel"
                      onClick={this.toggleVisibility.bind(this)}
                    />
                  </Grid.Column>
                </Grid.Row>
              </Grid>
              <Grid padded>
                <Grid.Row>
                  <Grid.Column width={16}>
                    <h2 className="white-color intro-text-sidebar">
                      Signup to the fastest growing product centric platform of
                      the world
                    </h2>
                    <Header
                      style={{ fontSize: 20, fontWeight: 500 }}
                      className="white-color"
                      size="medium"
                    >
                      Sign in with{" "}
                    </Header>
                    <a href={`${BASE_URL}/auth/linkedin`}>
                      <Image src={linkedin} size="small" />
                    </a>

                    {/* <Segment className="blue-color" padded> */}
                    {/* {!this.props.auth && <Button primary fluid><a style={{ color: 'white' }} href={`${BASE_URL}/auth/linkedin`}>Login</a></Button>} */}
                    {/* {this.props.auth && <Button primary fluid><a style={{ color: 'white' }} href={`${BASE_URL}/auth/logout`}>Logout</a></Button>} */}

                    {/* <Divider horizontal>Or</Divider> */}
                    {/* <Button secondary fluid><a className="a linkedin" href={`${BASE_URL}/auth/linkedin`}>Sign Up Now</a></Button> */}
                    {/* </Segment> */}
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Container>
          )}
          {this.props.auth && (
            <Container>
              <Grid padded>
                <Grid.Row>
                  <Grid.Column width={16}>
                    <Image
                      src={mappesLogo}
                      className="inline-image"
                      width="120"
                    />
                    <Icon
                      className="sidebar-menu__toggle"
                      name="cancel"
                      onClick={this.toggleVisibility.bind(this)}
                    />
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column width={16}>
                    <h2 className="white-color intro-text-sidebar">
                      Welcome{" "}
                      <div>
                        {this.props.auth && this.props.auth.displayName}
                      </div>
                    </h2>
                    <Button
                      as={"a"}
                      href={`${BASE_URL}/auth/logout`}
                      onClick={() => sessionStorage.setItem("login", 0)}
                      basic
                      className="white-outline-btn"
                    >
                      Logout
                    </Button>
                    {/* <Image style={{ paddingTop: 80 }}  src={atlasside} size='huge' /> */}
                  </Grid.Column>
                  <Grid.Column width={16}>
                    <Statistic.Group className="sidebar-state" inverted>
                      {/* <Statistic>
                                            <Statistic.Value>
                                                <Image src={productIcon} />
                                                64
                                          </Statistic.Value>
                                            <Statistic.Label>Listed Products</Statistic.Label>
                                        </Statistic>
                                        <Statistic>
                                            <Statistic.Value>
                                                <Image src={thumbIcon} />
                                                24
                                          </Statistic.Value>
                                            <Statistic.Label>Connections in Network</Statistic.Label>
                                        </Statistic>
                                        <Statistic>
                                            <Statistic.Value>
                                                <Image src={globetIcon} />
                                                18
                                          </Statistic.Value>
                                            <Statistic.Label>Connected products</Statistic.Label>
                                        </Statistic> */}
                    </Statistic.Group>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Container>
          )}
        </Sidebar>
        <Sidebar.Pusher>
          <Menu
            className="blue-color topNav"
            fixed="top"
            size="massive"
            borderless={true}
          >
            <Container>
              {/* <Responsive as={Menu.Menu} position='left' maxWidth={767}>
                                <Menu.Item className="profile-mobile-toggle">
                                    <Accordion>
                                        <Accordion.Title
                                            active={activeIndex === 0}
                                            index={0}
                                            onClick={this.handleClick}
                                        >
                                            <Icon size="small" className="white-color cursor-pointer" name='content' />
                                        </Accordion.Title>
                                        <Accordion.Content active={activeIndex === 0} className="profile-mobile-drop-down">
                                            <Transition visible={profileOption} animation={"slide down"} duration={"300"}>
                                                <div className="padding-top-10"> */}
              {/* <div className="search-bar-mobile">
                                                        <Search size={'mini'}
                                                            className="searchWithScroll"
                                                            placeholder={'Search for product or company'}
                                                            loading={isLoading}
                                                            onResultSelect={this.handleResultSelect}
                                                            onSearchChange={this.handleSearchChange}
                                                            results={results}
                                                            value={value}
                                                            resultRenderer={resultRenderer}
                                                        />
                                                    </div> */}
              {/* <LeftSidebar />
                                                </div>
                                            </Transition>
                                        </Accordion.Content>
                                    </Accordion>
                                </Menu.Item>
                            </Responsive> */}
              <Responsive
                as={Menu.Menu}
                minWidth={768}
                className="item navbar-logo"
              >
                <a href="/">
                  <Image
                    src={mappesLogo}
                    className="inline-image"
                    width="120"
                  />
                </a>
              </Responsive>
              <Responsive
                as={Menu.Menu}
                maxWidth={767}
                className="item navbar-logo"
              >
                <a href="/">
                  <i className="icon-mappers-logo-sm navbar-logo__i" />
                </a>
              </Responsive>
              <Menu.Item className="searchHolder">
                <Search
                  size={"mini"}
                  className="searchWithScroll"
                  placeholder={"Search for product or company"}
                  loading={isLoading}
                  onResultSelect={this.handleResultSelect}
                  onSearchChange={this.handleSearchChange}
                  results={results}
                  value={value}
                  resultRenderer={resultRenderer}
                />
              </Menu.Item>
              <Menu.Menu position="right" className="right-menu">
                {this.props.auth && (
                  <Responsive as={Menu.Menu} minWidth={768} className="item">
                    <Icon
                      size="small"
                      onClick={this.onClick}
                      className="white-color cursor-pointer"
                      name="bell outline">
                      {this.state.unreadNotifications && 
                        <div className="notify"><span className="heartbit"></span><span className="point"></span></div>}
                    </Icon>

                    <div ref={this.setWrapperRef}>
                      <Transition
                        visible={hidden}
                        animation="fade down"
                        unmountOnHide
                        duration={300}
                      >
                        <div className="dropdown-warapper">
                          <div className="dropdown-box">
                            <List relaxed verticalAlign="middle">
                              {this.renderNotifications()}
                            </List>
                          </div>
                        </div>
                      </Transition>
                    </div>
                  </Responsive>
                )}
                {this.props.auth && (
                  <Responsive minWidth={768} className="item" as={Link} to={"/message"}>
                    <Icon
                      size="small"
                      className="white-color cursor-pointer"
                      name="envelope"
                    >
                      {this.state.unreadMessages && <div className="notify"><span className="heartbit"></span><span className="point"></span></div>}
                    </Icon>
                  </Responsive>
                )}
                <Responsive
                  as={Menu.Item}
                  className="navbar-profile-pic"
                  maxWidth={767}
                >
                  {this.renderProfileImage()}
                </Responsive>
                <Menu.Item>
                  {!this.props.auth && (
                    <Icon
                    size="small"
                    className="white-color cursor-pointer"
                    name="content"
                    onClick={this.toggleVisibility.bind(this)}
                  />
                  )}
                  {this.props.auth && (
                    <Icon
                    size="small"
                    className="white-color cursor-pointer"
                    name="content"
                    onClick={this.onClickUser}
                    // onClick={this.toggleVisibility.bind(this)}
                  />
                  )}
                  <div ref={this.setUserWrapperRef}>
                      <Transition
                        visible={hiddenUser}
                        animation="fade down"
                        unmountOnHide
                        duration={300}
                      >
                        <div className="dropdown-warapper">
                          <div className="dropdown-box dropdown-box-small">
                            <List relaxed verticalAlign="middle">
                              <List.Item as={'a'} className='color-light-blue' href='/profile'>
                                <i className="icon-user-alt mR-5"></i> My Profile
                              </List.Item>
                              {/* <List.Item as={'a'} className='color-light-blue' href='/profile'>
                                <i className="icon-settings mR-5"></i> Settings
                              </List.Item> */}
                              <List.Item className='color-light-blue'
                                as={'a'} href={`${BASE_URL}/auth/logout`}
                                onClick={() => sessionStorage.setItem("login", 0)}> 
                                <i className="icon-power-off mR-5"></i> Logout
                                
                              </List.Item>
                            </List>
                          </div>
                        </div>
                      </Transition>
                    </div>
                </Menu.Item>
              </Menu.Menu>
            </Container>
          </Menu>

          {this.props.children}
          <Responsive as={Menu.Menu} maxWidth={767}>
            <Menu
              fluid
              widths={4}
              borderless
              icon="labeled"
              className="nav-bottom"
            >
              {!this.props.auth && (
                <div className="d-flex valign-middle">
                  <Button size="mini" primary as="a" href="/?login=true&signup=true">
                    Sign Up
                  </Button>
                  <span className="d-flex mL-10 mR-10">Or</span>
                  <Button size="mini" primary as="a" href="/?login=true">
                    Log In
                  </Button>
                </div>
              )}
              {this.props.auth && (
                <Menu.Item name="Home" as={Link} to={"/networkFeed/global/noop"}>
                  <Icon name="bars" className="icon-mappes icon-news-feed" /> Network Feed
                </Menu.Item>
              )}
              {/* {this.props.auth && (
                <Menu.Item name="Business Card" as={Link} to={"/profile"}>
                  <Icon name="user" className="icon-mappes user-alt" /> My
                  Profile
                </Menu.Item>
              )} */}
              {this.props.auth && (
                <Menu.Item name="Notifications"  as={Link} to={"/notifications"}>
                  <Icon name="bell outline">
                  {this.state.unreadNotifications && 
                        <div className="notify"><span className="heartbit"></span><span className="point"></span></div>}
                    </Icon>
                  Notifications
                </Menu.Item>
              )}
              {this.props.auth && (
                <Menu.Item name="My Products" as={Link} to={"/myproduct"}>
                  <Icon name="sitemap" />
                  My Products
                </Menu.Item>
              )}
              {this.props.auth && (
                <Menu.Item name="Message" as={Link} to={"/message"}>
                  <Icon name="envelope">
                  {this.state.unreadMessages && 
                        <div className="notify"><span className="heartbit"></span><span className="point"></span></div>}
                    </Icon>
                  Message
                </Menu.Item>
              )}
            </Menu>
          </Responsive>
        </Sidebar.Pusher>
      </Sidebar.Pushable>
    );
  }
}

function mapStateToProps({ auth, chatUser }) {
  return { auth, chatUser };
}

export default connect(
  mapStateToProps,
  actions
)(Navbar);
