import React, { Component } from 'react';
import * as actions from '../../actions/';
import { connect } from 'react-redux';
import { Grid, Container, Image, Responsive } from 'semantic-ui-react'
// import { Editor } from 'react-draft-wysiwyg';
import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { Link } from 'react-router-dom';
import './profileFeed.css';
import Navbar from '../common/Navbar'
import LeftSidebar from '../common/LeftSidebar'
import RightSection from '../common/RightSection'
// import articlePic from './article-image-1.jpg'
// import articlePic2 from './article-image-2.jpg'
// import Follow from '../activityFeed/Follow';
// import AddStatus from '../activityFeed/AddStatus'
import axios from 'axios'
import { BASE_URL } from '../../config/config'
import AvatarProfile from '../common/AvatarProfile';
// import Create from '../activityFeed/Create'
// import AddRaw from '../activityFeed/AddRaw'
// import AddApplication from '../activityFeed/AddApplication'



class ProfileFeed extends Component {
    constructor(props) {
        super(props);
        this.showHideComments = this.showHideComments.bind(this);
        this.setWrapperRef = this.setWrapperRef.bind(this);
        this.onClick = this.onClick.bind(this);
        this.handleOutsideClick = this.handleOutsideClick.bind(this);
        this.state = {
            hidden: false,
            commentHide: false,
            open: false,
            user: '',
            animation: 'fade down',
            duration: 500
        }
    }
    handleOpen = () => setTimeout(() => {
        this.setState({ open: !this.state.open });
    }, 0)
    showHideComments() {
        this.setState(prevState => ({
            commentHide: !prevState.commentHide
        }))
    }

    renderName() {
        // if (this.props.auth) {
        //     return (
        //         <div className="profile-name-inner">{this.props.auth.displayName}</div>
        //     )
        // } else {
        //     return (
        //         <span className="hide-menu">Loading...</span>
        //     );
        // }
        return (
            <div className="profile-name-inner">{this.state.user.firstName + " " + this.state.user.lastName}</div>
        )
    }
    renderProfileImage() {
        if (this.props.auth && this.props.auth._json && this.props.auth._json.pictureUrls) {
            return (
                <Image className="user-avtar-image" src={this.props.auth._json.pictureUrls.values[0]} />
            )
        }
    }

    onClick() {
        if (!this.state.hidden) {
            document.addEventListener('click', this.handleOutsideClick, false);
        } else {
            document.removeEventListener('click', this.handleOutsideClick, false);
        }
        this.setState(prevState => ({
            hidden: !prevState.hidden
        }))
    }

    handleOutsideClick(e) {
        if (this.wrapperRef.contains(e.target)) {
            return;
        }
        console.log(this.wrapperRef);
        this.onClick();
    }

    setWrapperRef(node) {
        this.wrapperRef = node;
    }
    componentWillMount() {
        this.getUserProfile();
    }
    getUserProfile() {
        axios.get(`${BASE_URL}/api/v1/user/profile/byId/${this.props.match.params.id}`, { withCredentials: true })
            .then(user => {
                console.log(user);
                if (user && user.data && user.data.Item) {
                    this.setState({
                        user: user.data.Item
                    })
                }
            }).catch(err => {
                console.log(err);
            })
    }
    handleVisibility = () => this.setState({ visible: !this.state.visible })

    // componentWillMount() {
    //     this.props.getUserProfileFeed();
    // }

    // renderFeed() {
    //     return this.props.user.profile_feed.Items.map((item, index) => {
    //         console.log(item);
    //         if (item.type === 'FOLLOW') {
    //             return <Follow item={item} key={index} />
    //         } if (item.type === 'ADD_RAW') {
    //             return <AddRaw item={item} key={index} />
    //         } if (item.type === 'ADD_APPLICATION') {
    //             return <AddApplication item={item} key={index} />
    //         } if (item.type === 'ADD_STATUS') {
    //             return <AddStatus item={item} key={index} />
    //         } else {
    //             return <Create item={item} key={index} />
    //         }
    //     })
    // }
    renderLinkedDesignation() {
        return (
            <span>{this.state.user.designation} at <Link to={`/company/${this.state.user.company_id}`}>{this.state.user.company}</Link></span>
        )
    }
    renderUnlinkedDesignation() {
        return (
            <span>{this.state.user.designation} at {this.state.user.company}</span>
        )
    }
    render() {
        console.log(this.props.user)
        // const {commentHide, animation, duration, open, visible, hidden} = this.state;
        // const panesModal = [
        //     { menuItem: 'Article', render: () => 
        //         <Tab.Pane attached={false}>
        //             <Form>
        //                 <Form.Field>
        //                     <label>Title</label>
        //                     <input placeholder='Title' />
        //                 </Form.Field>
        //             </Form>
        //             <label>Content</label>
        //             <Editor />
        //             <div className="mT-20"></div>
        //             <label>Attachment</label>
        //             <div className="input-type-file large">
        //                 <input type='file' className='file-input'/>
        //                 <i className="icon-cloud-uplod"></i>
        //                 <p>Drag and drop a file here or click</p>
        //             </div>
        //             <div className="mT-20"></div>
        //             <Divider />
        //             <div className="mT-20">
        //                 <Button primary className="with-icon"><i className="icon-envelope-medium"></i> Submit</Button>
        //                 <Button className="with-icon" onClick={this.handleOpen}><i className="icon-close-medium"></i> Discard</Button>
        //             </div>
        //         </Tab.Pane> 
        //     },
        //     { menuItem: 'Document', render: () => 
        //     <Tab.Pane attached={false}>
        //         <Form>
        //             <Form.Field>
        //                 <label>Title</label>
        //                 <input placeholder='Title' />
        //             </Form.Field>
        //         </Form>
        //         <label>Thumbnail</label>
        //         <div className="input-type-file large">
        //             <input type='file' className='file-input' />
        //             <i className="icon-cloud-uplod"></i>
        //             <p>Drag and drop a file here or click</p>
        //         </div>
        //         <div className="mT-20"></div>
        //         <label>Attachment</label>
        //         <div className="input-type-file large">
        //             <input type='file' className='file-input' />
        //             <i className="icon-cloud-uplod"></i>
        //             <p>Drag and drop a file here or click</p>
        //         </div>
        //         <div className="mT-20"></div>
        //         <Divider />
        //         <div className="mT-20">
        //             <Button primary className="with-icon"><i className="icon-envelope-medium"></i> Submit</Button>
        //             <Button onClick={this.handleOpen} className="with-icon"><i className="icon-close-medium"></i> Discard</Button>
        //         </div>
        //     </Tab.Pane> },
        //   ]
        // const panes = [
        //   { menuItem: 'Top stories', render: () => <Tab.Pane attached={false}>
        //     <Grid>
        //         <Grid.Column width={16}>
        //             <div className="articles">
        //                 <article className="article">
        //                     <div className="article-header">
        //                         <div className="art-header-img">
        //                             S
        //                         </div>
        //                         <div className="art-header-meta">
        //                             <a>Sterlite Technologies Ltd.</a>
        //                             <span className="small">
        //                                 <span>2578 Followers </span>|<span> 1 Day</span>
        //                             </span>
        //                         </div>
        //                         <div className="art-header-drop-down">
        //                             <Dropdown trigger={<Icon size='mini' className="text-blue" name={'ellipsis horizontal'} />}>
        //                                 <Dropdown.Menu direction='right' style={{ borderRadius: "10px" }}>
        //                                     <Dropdown.Item className="dropDownThreeDots" text='Share this post' />
        //                                     <Dropdown.Item className="dropDownThreeDots" text='Block feed from this user' />
        //                                     <Divider />
        //                                     <Dropdown.Item style={{ marginTop: "5px", marginBottom: "5px" }} className="dropDownThreeDots" text='Report Abuse' />
        //                                 </Dropdown.Menu>
        //                             </Dropdown>
        //                         </div>
        //                     </div>
        //                     <div className="article-body">
        //                         <div className="art-body-media">
        //                             <Image src={articlePic2} fluid />
        //                             <div class="art-body-text">
        //                                 <h3 class="art-body-title"><a class="a white">Golden Peacock Award</a></h3>
        //                                 Sterlite Tech has been honoured with the Golden Peacock Award for Excellence in Corporate Governance - 2017.  Sterlite Tech was selected by the Awards Jury under the Chairmanship of Justice (Dr.) Arijit Pasayat, former Judge, Supreme Court of India. The award will be presented during Golden Peaco ... <a class="a readmore">Read more</a>
        //                             </div>
        //                         </div>
        //                     </div>
        //                     <div className="article-footer">
        //                         <div className="art-footer-top pD-r-10 pD-l-10">
        //                             <a className="color-inherit">5 Likes</a>
        //                             <span className="inline-block mR-5 mL-5">•</span>
        //                             <a className={`color-inherit ${commentHide ? "active" : ""}`} onClick={this.showHideComments}>23 Comments</a>
        //                         </div>
        //                         <div className="art-footer-bottom pD-r-10 pD-l-10">
        //                             <a className={`color-inherit mR-10 ${commentHide ? "active" : ""}`} onClick={this.showHideComments}>
        //                                 <Icon name='comment outline' /> Comment
        //                             </a>
        //                             <Popup position='top center' trigger={
        //                                 <a className="color-inherit">
        //                                     <Icon name='share square' /> Share
        //                                 </a>
        //                             } flowing hoverable hideOnScroll inverted>
        //                             <Button circular color='facebook' icon='facebook' />
        //                             <Button circular color='twitter' icon='twitter' />
        //                             <Button circular color='linkedin' icon='linkedin' />
        //                             <Button circular color='google plus' icon='google plus' />
        //                             <Button circular color='instagram' icon='instagram' />
        //                             </Popup>

        //                             <a className="color-inherit pull-right" ><Icon name='thumbs up outline' /></a>
        //                         </div>
        //                     </div>
        //                     <Transition visible={this.state.commentHide} animation={"fade down"} duration={"500"}>

        //                         <div className="comments-box-wrap">
        //                             <Comment.Group className="comments-box">
        //                                 <a className="text-blue" dividing='true'>
        //                                 View 5 more comments
        //                                 </a>
        //                                 <Comment>
        //                                     <Comment.Avatar src='https://react.semantic-ui.com/images/avatar/small/matt.jpg' />
        //                                     <Comment.Content>
        //                                         <Comment.Author>Matt
        //                                             <Comment.Text as='span'>Sterlite Tech has been honoured with the Golden Peacock Award for Excellence in Corporate Governance - 2017. Sterlite Tech was selected by the Awards Jury under the Chairmanship of Justice (Dr.) Arijit Pasayat, former Judge, Supreme Court of India. The award will be presented during Golden Peac</Comment.Text>
        //                                         </Comment.Author>
        //                                         <Comment.Actions>
        //                                             <Comment.Action>Like</Comment.Action>
        //                                             <Comment.Action>Reply</Comment.Action>
        //                                             <Comment.Metadata>
        //                                                 <div>Today at 5:42PM</div>
        //                                             </Comment.Metadata> 
        //                                         </Comment.Actions>
        //                                     </Comment.Content>
        //                                     <Comment.Group>
        //                                         <Comment>
        //                                             <Comment.Avatar src='https://react.semantic-ui.com/images/avatar/small/jenny.jpg' />
        //                                             <Comment.Content>
        //                                                 <Comment.Author>Elliot Fu
        //                                                     <Comment.Text as='span'>This has been very useful for my research. Thanks as well!</Comment.Text>
        //                                                 </Comment.Author>
        //                                                 <Comment.Actions>
        //                                                     <Comment.Action>Like</Comment.Action>
        //                                                     <Comment.Action>Reply</Comment.Action>
        //                                                     <Comment.Metadata>
        //                                                         <div>Today at 5:42PM</div>
        //                                                     </Comment.Metadata> 
        //                                                 </Comment.Actions>
        //                                             </Comment.Content>
        //                                         </Comment>
        //                                     </Comment.Group>
        //                                 </Comment>
        //                                 <Comment>
        //                                     <Comment.Avatar src='https://react.semantic-ui.com/images/avatar/small/joe.jpg' />
        //                                     <Comment.Content>
        //                                         <Comment.Author>Joe Henderson
        //                                             <Comment.Text as='span'>Dude, this is awesome. Thanks so much</Comment.Text>
        //                                         </Comment.Author>
        //                                         <Comment.Actions>
        //                                             <Comment.Action>Like</Comment.Action>
        //                                             <Comment.Action>Reply</Comment.Action>
        //                                             <Comment.Metadata>
        //                                                 <div>5 days ago</div>
        //                                             </Comment.Metadata> 
        //                                         </Comment.Actions>
        //                                     </Comment.Content>
        //                                 </Comment>
        //                                 <Comment>
        //                                     <Comment.Avatar src='https://react.semantic-ui.com/images/avatar/small/joe.jpg' />
        //                                     <Comment.Content>
        //                                         <Form reply>
        //                                             <Form.Group>
        //                                                 <Form.Input placeholder='Write something' className="w100" name='Comment Box' />
        //                                                 <Form.Button content='Post' primary/>
        //                                             </Form.Group>
        //                                         </Form>
        //                                     </Comment.Content>
        //                                 </Comment>
        //                             </Comment.Group>
        //                         </div>
        //                     </Transition>
        //                 </article> 
        //                 <article className="article">
        //                     <div className="article-header">
        //                         <div className="art-header-img">
        //                             S
        //                         </div>
        //                         <div className="art-header-meta">
        //                             <a>Sterlite Technologies Ltd.</a>
        //                             <span className="small">
        //                                 <span>2578 Followers </span>|<span> 1 Day</span>
        //                             </span>
        //                         </div>
        //                         <div className="art-header-drop-down">
        //                             <Dropdown trigger={<Icon size='mini' className="text-blue" name={'ellipsis horizontal'} />}>
        //                                 <Dropdown.Menu direction='right' style={{ borderRadius: "10px" }}>
        //                                     <Dropdown.Item className="dropDownThreeDots" text='Share this post' />
        //                                     <Dropdown.Item className="dropDownThreeDots" text='Block feed from this user' />
        //                                     <Divider />
        //                                     <Dropdown.Item style={{ marginTop: "5px", marginBottom: "5px" }} className="dropDownThreeDots" text='Report Abuse' />
        //                                 </Dropdown.Menu>
        //                             </Dropdown>
        //                         </div>
        //                     </div>
        //                     <div className="article-body">
        //                         <div className="art-body-text">Sterlite Tech has been honoured with the Golden Peacock Award for Excellence in Corporate Governance - 2017. Sterlite Tech was selected by the Awards Jury under the Chairmanship of Justice (Dr.) Arijit Pasayat, former Judge, Supreme Court of India. The award will be presented during Golden Peaco ... <a className="a color">Read more</a>
        //                         </div>
        //                         <div className="art-body-media">
        //                             <Image src={articlePic} fluid />
        //                         </div>
        //                     </div>
        //                     <div className="article-footer">
        //                         <div className="art-footer-top pD-r-10 pD-l-10">
        //                             <a className="color-inherit">5 Likes</a>
        //                             <span className="inline-block mR-5 mL-5">•</span>
        //                             <a className={`color-inherit ${commentHide ? "active" : ""}`} onClick={this.showHideComments}>23 Comments</a>
        //                         </div>
        //                         <div className="art-footer-bottom pD-r-10 pD-l-10">
        //                             <a className={`color-inherit mR-10 ${commentHide ? "active" : ""}`} onClick={this.showHideComments}>
        //                                 <Icon name='comment outline' /> Comment
        //                             </a>assName="profile-drop-down">
        //                                                                 <Dropdown trigger={<Icon size='large' name={'ellipsis horizontal'} />}>
        //                                                                     <Dropdown.Menu direction='right' style={{ borderRadius: "10px" }}>
        //                                                                         <Dropdown.Item className="dropDownThreeDots" text='Share Profile' />
        //                                                                         <Dropdown.Item className="dropDownThreeDots" text='Copy Profile Link' />
        //                                                                         <Divider />
        //                                                                         <Dropdown.Item style={{ marginTop: "5px", marginBottom: "5px" }} className="dropDownThreeDots" text='Report Abuse' />
        //                                                                     </Dropdown.Menu>
        //                                                                 </Dropdown>
        //                                                             </div>
        //                             <Popup position='top center' trigger={
        //                                 <a className="color-inherit">
        //                                     <Icon name='share square' /> Share
        //                                 </a>
        //                             } flowing hoverable hideOnScroll inverted>
        //                             <Button circular color='facebook' icon='facebook' />
        //                             <Button circular color='twitter' icon='twitter' />
        //                             <Button circular color='linkedin' icon='linkedin' />
        //                             <Button circular color='google plus' icon='google plus' />
        //                             <Button circular color='instagram' icon='instagram' />
        //                             </Popup>

        //                             <a className="color-inherit pull-right" ><Icon name='thumbs up outline' /></a>
        //                         </div>
        //                     </div>
        //                     <Transition visible={this.state.commentHide} animation={"fade down"} duration={"500"}>

        //                         <div className="comments-box-wrap">
        //                             <Comment.Group className="comments-box">
        //                                 <a className="text-blue" dividing='true'>
        //                                 View 5 more comments
        //                                 </a>
        //                                 <Comment>
        //                                     <Comment.Avatar src='https://react.semantic-ui.com/images/avatar/small/matt.jpg' />
        //                                     <Comment.Content>
        //                                         <Comment.Author>Matt
        //                                             <Comment.Text as='span'>Sterlite Tech has been honoured with the Golden Peacock Award for Excellence in Corporate Governance - 2017. Sterlite Tech was selected by the Awards Jury under the Chairmanship of Justice (Dr.) Arijit Pasayat, former Judge, Supreme Court of India. The award will be presented during Golden Peac</Comment.Text>
        //                                         </Comment.Author>
        //                                         <Comment.Actions>
        //                                             <Comment.Action>Like</Comment.Action>
        //                                             <Comment.Action>Reply</Comment.Action>
        //                                             <Comment.Metadata>
        //                                                 <div>Today at 5:42PM</div>
        //                                             </Comment.Metadata> 
        //                                         </Comment.Actions>
        //                                     </Comment.Content>
        //                                     <Comment.Group>
        //                                         <Comment>
        //                                             <Comment.Avatar src='https://react.semantic-ui.com/images/avatar/small/jenny.jpg' />
        //                                             <Comment.Content>
        //                                                 <Comment.Author>Elliot Fu
        //                                                     <Comment.Text as='span'>This has been very useful for my research. Thanks as well!</Comment.Text>
        //                                                 </Comment.Author>
        //                                                 <Comment.Actions>
        //                                                     <Comment.Action>Like</Comment.Action>
        //                                                     <Comment.Action>Reply</Comment.Action>
        //                                                     <Comment.Metadata>
        //                                                         <div>Today at 5:42PM</div>
        //                                                     </Comment.Metadata> 
        //                                                 </Comment.Actions>
        //                                             </Comment.Content>
        //                                         </Comment>
        //                                     </Comment.Group>
        //                                 </Comment>
        //                                 <Comment>
        //                                     <Comment.Avatar src='https://react.semantic-ui.com/images/avatar/small/joe.jpg' />
        //                                     <Comment.Content>
        //                                         <Comment.Author>Joe Henderson
        //                                             <Comment.Text as='span'>Dude, this is awesome. Thanks so much</Comment.Text>
        //                                         </Comment.Author>
        //                                         <Comment.Actions>
        //                                             <Comment.Action>Like</Comment.Action>
        //                                             <Comment.Action>Reply</Comment.Action>
        //                                             <Comment.Metadata>
        //                                                 <div>5 days ago</div>
        //                                             </Comment.Metadata> 
        //                                         </Comment.Actions>
        //                                     </Comment.Content>
        //                                 </Comment>
        //                                 <Comment>
        //                                     <Comment.Avatar src='https://react.semantic-ui.com/images/avatar/small/joe.jpg' />
        //                                     <Comment.Content>
        //                                         <Form reply>
        //                                             <Form.Group>
        //                                                 <Form.Input placeholder='Write something' className="w100" name='Comment Box' />
        //                                                 <Form.Button content='Post' primary/>
        //                                             </Form.Group>
        //                                         </Form>
        //                                     </Comment.Content>
        //                                 </Comment>
        //                             </Comment.Group>
        //                         </div>
        //                     </Transition>
        //                 </article> 
        //             </div> 
        //         </Grid.Column>
        //     </Grid>
        //   </Tab.Pane> },

        //   { menuItem: 'Articles', render: () => <Tab.Pane attached={false}>Tab 2 Content</Tab.Pane> },
        //   { menuItem: 'Videos', render: () => <Tab.Pane attached={false}>Tab 3 Content</Tab.Pane> },
        //   { menuItem: 'Image', render: () => <Tab.Pane attached={false}>Tab 3 Content</Tab.Pane> }
        // ]
        return (
            <Navbar {...this.props}>
                <div className="primary-background">
                    <Container className="body-background palm-nudge-sides">
                        <Grid padded stackable>
                            <Responsive as={Grid.Column} className="left-content" minWidth={768}>
                                <LeftSidebar />
                            </Responsive>
                            <Grid.Column className='main-content-area'>
                                <div className="main-content">
                                    <div className="main-content_inner">
                                        {/* <Feed style={{ width: '100%', paddingTop: '30px' }} size={'large'}>

                                        {this.props.user && this.props.user.profile_feed && this.renderFeed()}

                                    </Feed> */}


                                        <Grid padded>
                                            <Grid.Row className="extra-padding-sides">
                                                <Grid padded className="full-width">
                                                    <Grid.Column width={16}>
                                                        <div className="profile-info-bar">
                                                            <div className="profile-image">
                                                                {/* {this.renderProfileImage()} */}
                                                                {this.state.user && <AvatarProfile id={this.state.user.user_id} />}
                                                            </div>
                                                            <div className="profile-info-text">
                                                                <div className="profile-name">
                                                                    <div className="profile-name-text">
                                                                        {this.renderName()}
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
                                                                <div className="profile-designation">
                                                                    {this.state.user.company_updated === 1 ? this.renderLinkedDesignation() : this.renderUnlinkedDesignation()}

                                                                </div>
                                                                <div className="profile-company mB-10 ">
                                                                    {this.state.user.desc}
                                                                </div>
                                                                <div className="profile-network">
                                                                    {/* <a className="t600 text-blue">(24 People in the network)</a> */}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Grid.Column>
                                                </Grid>
                                            </Grid.Row>
                                        </Grid>
                                        {/* <Grid padded>
                                            <Grid.Row className="background-white extra-padding-sides">
                                                <Grid.Column width={16} className="mT-10 min-43" >
                                                    <div className="article-toggle-edit" ref={this.setWrapperRef}>
                                                        <Transition visible={!hidden} animation='slide down' unmountOnHide duration={300}>
                                                            <Header as={'h4'} onClick={this.onClick} className="toggleKey table-heading cursor-pointer" >Share an article, Photo or Video of a product</Header>
                                                        </Transition>
                                                        <Transition visible={hidden} animation='slide down' unmountOnHide duration={300}>
                                                            <div className="toggleKey">
                                                                <div className="d-flex">
                                                                    <div className="user-avtar-image">
                                                                        {this.renderProfileImage()}
                                                                    </div>
                                                                    {this.renderName()}
                                                                </div>
                                                                <Form>
                                                                    <TextArea rows={5} placeholder='Write your amazing post here!!!' />
                                                                </Form>
                                                            </div>
                                                        </Transition>      
                                                    </div>
                                                    <div className="border-b"></div>
                                                </Grid.Column>
                                                <Grid.Column width={16} className="mT-10">
                                                    <Button size='mini' basic className="mR-10 btn-sm" onClick={this.handleOpen} >
                                                        <Icon className="text-blue" name='align left' />
                                                        Write an article
                                                    </Button>
                                                    <TransitionablePortal open={open} transition={{ animation, duration }}>
                                                        <Modal
                                                            dimmer
                                                            open={true}
                                                            onClose={this.handleOpen}
                                                            size='large'
                                                            className='edit-article-box'
                                                        >
                                                            <Header>
                                                                <h3 className="t600 m-0">Write somthing smart!!!
                                                                <i name='close' className="icon-close close" onClick={this.handleOpen} ></i>
                                                                </h3>
                                                            </Header>
                                                            <Modal.Content>
                                                                <Tab menu={{ secondary: true }} panes={panesModal} />
                                                            </Modal.Content>
                                                            
                                                        </Modal>
                                                    </TransitionablePortal>
                                                    <Button size='mini' basic className="btn-sm" onClick={this.handleVisibility}> 
                                                        <Icon className="text-blue" name='camera' />
                                                        Image or Video
                                                    </Button>
                                                    <Button primary size='mini' floated='right' className="btn-sm">Post</Button>
                                                    <Transition.Group animation={'slide down'} duration={300}>
                                                        {visible && <div className="mT-5">
                                                            <label>Upload your photo or video</label>
                                                            <div className="input-type-file large">
                                                                <input type='file' className='file-input'/>
                                                                <i className="icon-cloud-uplod"></i>
                                                                <p>Drag and drop a file here or click</p>
                                                            </div>
                                                        </div>}
                                                    </Transition.Group>
                                                    <div className="border-b mT-10"></div>
                                                </Grid.Column>
                                                <Grid.Column width={16} className="mT-10">
                                                    <Tab className="custom-tab mobile-menu-icon-tab" menu={{ secondary: true, pointing: true }} panes={panes} />
                                                </Grid.Column>
                                            </Grid.Row>
                                        </Grid> */}
                                    </div>
                                </div>
                            </Grid.Column>
                            <RightSection />
                        </Grid>
                    </Container>
                </div>
            </Navbar>
        );
    }
}

function mapStateToProps({ auth, user }) {
    return { auth, user };
}

export default connect(mapStateToProps, actions)(ProfileFeed);
