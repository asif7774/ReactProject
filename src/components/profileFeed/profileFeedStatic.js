import React, { Component } from 'react';
import * as actions from '../../actions/';
import { connect } from 'react-redux';
import {  Grid, Container, Dropdown, Icon, Label, Tab, Header, Image, Button, Divider, Comment, Responsive, Transition, Modal, Popup, TransitionablePortal, Form, TextArea, Radio } from 'semantic-ui-react'
import { Editor } from 'react-draft-wysiwyg';
import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

import './profileFeed.css';
import Navbar from '../common/Navbar'
import LeftSidebar from '../common/LeftSidebar'
import RightSection from '../common/RightSection'
import articlePic from '../networkFeed/article-image-1.jpg'
import articlePic2 from '../networkFeed/article-image-2.jpg'
// import Follow from '../activityFeed/Follow';
// import AddStatus from '../activityFeed/AddStatus'

// import Create from '../activityFeed/Create'
// import AddRaw from '../activityFeed/AddRaw'
// import AddApplication from '../activityFeed/AddApplication'


const options = [
    {
      key: 'Private',
      text: 'Private',
      value: 'Private',
      content: 'Private',
      icon:'eye',
      description:'Only you and tagged people can see and edit this post',
      //image: { avatar: true, src: 'https://media.licdn.com/dms/image/C4E04AQEQq64wR22osA/profile-originalphoto-shrink_900_1200/0?e=1555545600&v=beta&t=Ws7oEupND8eR70OlidSPeGzoR72yRpY329PR4_2NY0A' },
    },
    {
      key: 'Public',
      text: 'Public',
      value: 'Public',
      content: 'Public',
      icon:'users',
      description:'Anyone in your network can see this post',
      //image: { avatar: true, src: 'https://media.licdn.com/dms/image/C4E04AQEQq64wR22osA/profile-originalphoto-shrink_900_1200/0?e=1555545600&v=beta&t=Ws7oEupND8eR70OlidSPeGzoR72yRpY329PR4_2NY0A' },
    },
  ]
  
  const options1 = [
    { key: 1, text: 'One', value: 1, image: { avatar: true, src: 'https://media.licdn.com/dms/image/C4E04AQEQq64wR22osA/profile-originalphoto-shrink_900_1200/0?e=1555545600&v=beta&t=Ws7oEupND8eR70OlidSPeGzoR72yRpY329PR4_2NY0A' } },
    { key: 2, text: 'Two', value: 2, image: { avatar: true, src: 'https://media.licdn.com/dms/image/C4E04AQEQq64wR22osA/profile-originalphoto-shrink_900_1200/0?e=1555545600&v=beta&t=Ws7oEupND8eR70OlidSPeGzoR72yRpY329PR4_2NY0A' } },
    { key: 3, text: 'Three', value: 3, image: { avatar: true, src: 'https://media.licdn.com/dms/image/C4E04AQEQq64wR22osA/profile-originalphoto-shrink_900_1200/0?e=1555545600&v=beta&t=Ws7oEupND8eR70OlidSPeGzoR72yRpY329PR4_2NY0A' } },
  ]
  
  const renderLabel = label => ({
    content: `${label.text}`,
    image:`${label.image.src}` 
  })
class ProfileFeedStatic extends Component {
    constructor(props) {
        super(props);   
        this.showHideComments = this.showHideComments.bind(this);
        this.setWrapperRef = this.setWrapperRef.bind(this);
        this.onClick = this.onClick.bind(this);
        this.handleOutsideClick = this.handleOutsideClick.bind(this);
        this.state = {
            hidden:false,
            commentHide:false,
            open: false,
            animation: 'fade down',
            duration: 500,
            tagginPopup:false,
            openDeletePostConfirm:false,
            openReportPopup:false
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
        if (this.props.auth) {
            return (
                <div className="profile-name">{this.props.auth.displayName}</div>
            )
        } else {
            return (
                <span className="hide-menu">Loading...</span>
            );
        }
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
        //this.onClick();
    }

    setWrapperRef(node) {
        this.wrapperRef = node;
    }

    handleVisibility = () => this.setState({ visible: !this.state.visible })
    toggleTagginPopup = () => this.setState({ tagginPopup: !this.state.tagginPopup })
    tagginPopupFalse = () => this.setState({ tagginPopup: false })


    //Delete post popup functions
    showDeletePopup = () => this.setState({ openDeletePostConfirm: true })
    closeDeletePopup = () => this.setState({ openDeletePostConfirm: false })

    //Report post poup function

    showReportPopup = () => this.setState({ openReportPopup: true })
    closeReportPopup = () => this.setState({ openReportPopup: false })
    
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
    // componentDidMount() {
    //     let that = this;
    //     window.addEventListener('scroll', 
    //         function(){
    //             that.state = {
    //                 tagginPopup:false
    //             }
    //         })
        
    // }
    // componentWillUnmount() {
    //     let that = this;
    //     window.removeEventListener('scroll', 
    //     function(){
    //         console.log(window)
    //         that.state = {
    //             tagginPopup:false
    //         }
    //     })
    // }
    render() {
        console.log(this.props.user)
        const {commentHide, animation, duration, open, visible, hidden, tagginPopup, openDeletePostConfirm, openReportPopup} = this.state;
        const panesModal = [
            { menuItem: 'Article', render: () => 
                <Tab.Pane attached={false}>
                    <div className="viewport-overflow">
                        <Form>
                            <Form.Field>
                                <label>Title</label>
                                <input placeholder='Title' />
                            </Form.Field>
                        </Form>
                        <label>Content</label>
                        <Editor />
                        <div className="mT-20"></div>
                        <label>Attachment</label>
                        <div className="input-type-file large">
                            <input type='file' className='file-input'/>
                            <i className="icon-cloud-uplod"></i>
                            <p>Drag and drop a file here or click</p>
                        </div>
                    </div>
                    <div className="mT-20"></div>
                    <Divider />
                    <div className="mT-20">
                        <Button primary className="with-icon"><i className="icon-envelope-medium"></i> Submit</Button>
                        <Button className="with-icon"><i className="icon-close-medium"></i> Discard</Button>
                    </div>
                </Tab.Pane> 
            },
            { menuItem: 'Document', render: () => 
            <Tab.Pane attached={false}>
                <Form>
                    <Form.Field>
                        <label>Title</label>
                        <input placeholder='Title' />
                    </Form.Field>
                </Form>
                <label>Thumbnail</label>
                <div className="input-type-file large">
                    <input type='file' className='file-input' />
                    <i className="icon-cloud-uplod"></i>
                    <p>Drag and drop a file here or click</p>
                </div>
                <div className="mT-20"></div>
                <label>Attachment</label>
                <div className="input-type-file large">
                    <input type='file' className='file-input' />
                    <i className="icon-cloud-uplod"></i>
                    <p>Drag and drop a file here or click</p>
                </div>
                <div className="mT-20"></div>
                <Divider />
                <div className="mT-20">
                    <Button primary className="with-icon"><i className="icon-envelope-medium"></i> Submit</Button>
                    <Button className="with-icon"><i className="icon-close-medium"></i> Discard</Button>
                </div>
            </Tab.Pane> },
          ]
        const panes = [
          { menuItem: 'Top stories', render: () => <Tab.Pane attached={false}>
            <Grid>
                <Grid.Column width={16}>
                    <div className="articles">
                        <article className="article">
                            <div className="article-header">
                                <div className="art-header-img">
                                    S
                                </div>
                                <div className="art-header-meta">
                                    <a>Sterlite Technologies Ltd.</a>
                                    <span className="small">
                                        <span>2578 Followers </span>|<span> 1 Day</span>
                                    </span>
                                </div>
                                <div className="art-header-drop-down">
                                    <Dropdown trigger={<Icon size='mini' className="text-blue" name={'ellipsis horizontal'} />}>
                                        <Dropdown.Menu direction='right' style={{ borderRadius: "10px" }}>
                                            <Dropdown.Item className="dropDownThreeDots" text='Share this post' />
                                            <Dropdown.Item className="dropDownThreeDots" text='Block feed from this user' />
                                            <Divider />
                                            <Dropdown.Item style={{ marginTop: "5px", marginBottom: "5px" }} className="dropDownThreeDots" text='Report Abuse' />
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>
                            </div>
                            <div className="article-body">
                                <div className="art-body-media">
                                    <Image src={articlePic2} fluid />
                                    <div className="art-body-text">
                                        <h3 className="art-body-title"><a className="a white">Golden Peacock Award</a></h3>
                                        Sterlite Tech has been honoured with the Golden Peacock Award for Excellence in Corporate Governance - 2017.  Sterlite Tech was selected by the Awards Jury under the Chairmanship of Justice (Dr.) Arijit Pasayat, former Judge, Supreme Court of India. The award will be presented during Golden Peaco ... <a className="a readmore">Read more</a>
                                    </div>
                                </div>
                            </div>
                            <div className="article-footer">
                                <div className="art-footer-top pD-r-10 pD-l-10">
                                    <a className="color-inherit">5 Likes</a>
                                    <span className="inline-block mR-5 mL-5">•</span>
                                    <a className={`color-inherit ${commentHide ? "active" : ""}`} onClick={this.showHideComments}>23 Comments</a>
                                </div>
                                <div className="art-footer-bottom pD-r-10 pD-l-10">
                                    <a className={`color-inherit mR-10 ${commentHide ? "active" : ""}`} onClick={this.showHideComments}>
                                        <Icon name='comment outline' /> Comment
                                    </a>
                                    <Popup position='top center' className="custom-popover-social" trigger={
                                        <a className="color-inherit">
                                            <Icon name='share square' /> Share
                                        </a>
                                    } flowing hoverable hideOnScroll inverted>
                                    <Button circular color='facebook' icon='facebook' />
                                    <Button circular color='twitter' icon='twitter' />
                                    <Button circular color='linkedin' icon='linkedin' />
                                    <Button circular color='google plus' icon='google plus' />
                                    <Button circular color='instagram' icon='instagram' />
                                    </Popup>
                                    
                                    <a className="color-inherit pull-right" ><Icon name='thumbs up outline' /></a>
                                </div>
                            </div>
                            <Transition visible={this.state.commentHide} animation={"fade down"} duration={"500"}>
                            
                                <div className="comments-box-wrap">
                                    <Comment.Group className="comments-box">
                                        <a className="text-blue" dividing='true'>
                                        View 5 more comments
                                        </a>
                                        <Comment>
                                            <Comment.Avatar src='https://react.semantic-ui.com/images/avatar/small/matt.jpg' />
                                            <Comment.Content>
                                                <Comment.Author>Matt
                                                    <Comment.Text as='span'>Sterlite Tech has been honoured with the Golden Peacock Award for Excellence in Corporate Governance - 2017. Sterlite Tech was selected by the Awards Jury under the Chairmanship of Justice (Dr.) Arijit Pasayat, former Judge, Supreme Court of India. The award will be presented during Golden Peac</Comment.Text>
                                                </Comment.Author>
                                                <Comment.Actions>
                                                    <Comment.Action>Like</Comment.Action>
                                                    <Comment.Action>Reply</Comment.Action>
                                                    <Comment.Metadata>
                                                        <div>Today at 5:42PM</div>
                                                    </Comment.Metadata> 
                                                </Comment.Actions>
                                            </Comment.Content>
                                            <Comment.Group>
                                                <Comment>
                                                    <Comment.Avatar src='https://react.semantic-ui.com/images/avatar/small/jenny.jpg' />
                                                    <Comment.Content>
                                                        <Comment.Author>Elliot Fu
                                                            <Comment.Text as='span'>This has been very useful for my research. Thanks as well!</Comment.Text>
                                                        </Comment.Author>
                                                        <Comment.Actions>
                                                            <Comment.Action>Like</Comment.Action>
                                                            <Comment.Action>Reply</Comment.Action>
                                                            <Comment.Metadata>
                                                                <div>Today at 5:42PM</div>
                                                            </Comment.Metadata> 
                                                        </Comment.Actions>
                                                    </Comment.Content>
                                                </Comment>
                                            </Comment.Group>
                                        </Comment>
                                        <Comment>
                                            <Comment.Avatar src='https://react.semantic-ui.com/images/avatar/small/joe.jpg' />
                                            <Comment.Content>
                                                <Comment.Author>Joe Henderson
                                                    <Comment.Text as='span'>Dude, this is awesome. Thanks so much</Comment.Text>
                                                </Comment.Author>
                                                <Comment.Actions>
                                                    <Comment.Action>Like</Comment.Action>
                                                    <Comment.Action>Reply</Comment.Action>
                                                    <Comment.Metadata>
                                                        <div>5 days ago</div>
                                                    </Comment.Metadata> 
                                                </Comment.Actions>
                                            </Comment.Content>
                                        </Comment>
                                        <Comment>
                                            <Comment.Avatar src='https://react.semantic-ui.com/images/avatar/small/joe.jpg' />
                                            <Comment.Content>
                                                <Form reply>
                                                    <Form.Group>
                                                        <Form.Input placeholder='Write something' className="w100" name='Comment Box' />
                                                        <Form.Button content='Post' primary/>
                                                    </Form.Group>
                                                </Form>
                                            </Comment.Content>
                                        </Comment>
                                    </Comment.Group>
                                </div>
                            </Transition>
                        </article> 
                        <article className="article">
                            <div className="article-header">
                                <div className="art-header-img">
                                    S
                                </div>
                                <div className="art-header-meta">
                                    <a>Sterlite Technologies Ltd.</a>
                                    <span className="small">
                                        <span>2578 Followers </span>|<span> 1 Day</span>
                                    </span>
                                </div>
                                <div className="art-header-drop-down">
                                    <Dropdown trigger={<Icon size='mini' className="text-blue" name={'ellipsis horizontal'} />}>
                                        <Dropdown.Menu direction='right' style={{ borderRadius: "10px" }}>
                                            <Dropdown.Item className="dropDownThreeDots" text='Share this post' />
                                            <Dropdown.Item className="dropDownThreeDots" text='Block feed from this user' />
                                            <Dropdown.Item className="dropDownThreeDots" text='Remove this post' onClick={this.showDeletePopup} />
                                            <Divider />
                                            <Dropdown.Item style={{ marginTop: "5px", marginBottom: "5px" }} onClick={this.showReportPopup} className="dropDownThreeDots" text='Report Abuse' />
                                        </Dropdown.Menu>
                                    </Dropdown>
                                    {/* Delete post popup */}
                                    <Modal size={'mini'} open={openDeletePostConfirm} onClose={this.closeDeletePopup} closeIcon>
                                        <Modal.Header>Remove this post</Modal.Header>
                                        <Modal.Content>
                                            <p>Are you sure you want to remove this post</p>
                                        </Modal.Content>
                                        <Modal.Actions>
                                            <Button size='mini' negative icon='close' labelPosition='left' content='No' />
                                            <Button size='mini' positive icon='checkmark' labelPosition='left' content='Yes' />
                                        </Modal.Actions>
                                    </Modal>

                                    {/* Report post popup */}
                                    <Modal size={'mini'} open={openReportPopup} onClose={this.closeReportPopup} closeIcon>
                                        <Modal.Header>Why are you reporting this?</Modal.Header>
                                        <Modal.Content className="custom-input-form ui form" style={{padding: '1.25rem 1.5rem'}} >
                                            <Grid>
                                                <Grid.Row>
                                                    <Grid.Column width={16}>
                                                        <Form.Field>
                                                            <Radio label='Option 1' name='radioGroup' value='option1'/>
                                                        </Form.Field>
                                                        <Form.Field>
                                                            <Radio label='Option 2' name='radioGroup' value='option2' />
                                                        </Form.Field>
                                                        <Form.Field>
                                                            <Radio label='Option 2' name='radioGroup' value='option2' />
                                                        </Form.Field>
                                                    </Grid.Column>
                                                </Grid.Row>
                                            </Grid>
                                        </Modal.Content>
                                        <Modal.Actions>
                                            <Button size='mini' primary icon='hand outline right' labelPosition='right' content='Submit' />
                                        </Modal.Actions>
                                    </Modal>
                                </div>
                            </div>
                            <div className="article-body">
                                <div className="art-body-text">Sterlite Tech has been honoured with the Golden Peacock Award for Excellence in Corporate Governance - 2017. Sterlite Tech was selected by the Awards Jury under the Chairmanship of Justice (Dr.) Arijit Pasayat, former Judge, Supreme Court of India. The award will be presented during Golden Peaco ... <a className="a color">Read more</a>
                                </div>
                                <div className="art-body-media">
                                    <Image src={articlePic} fluid />
                                </div>
                            </div>
                            <div className="article-footer">
                                <div className="art-footer-top pD-r-10 pD-l-10">
                                    <a className="color-inherit">5 Likes</a>
                                    <span className="inline-block mR-5 mL-5">•</span>
                                    <a className={`color-inherit ${commentHide ? "active" : ""}`} onClick={this.showHideComments}>23 Comments</a>
                                </div>
                                <div className="art-footer-bottom pD-r-10 pD-l-10">
                                    <a className={`color-inherit mR-10 ${commentHide ? "active" : ""}`} onClick={this.showHideComments}>
                                        <Icon name='comment outline' /> Comment
                                    </a>
                                    <Popup position='top center' className="custom-popover-social" trigger={
                                        <a className="color-inherit">
                                            <Icon name='share square' /> Share
                                        </a>
                                    } flowing hoverable hideOnScroll inverted>
                                    <Button circular color='facebook' icon='facebook' />
                                    <Button circular color='twitter' icon='twitter' />
                                    <Button circular color='linkedin' icon='linkedin' />
                                    <Button circular color='google plus' icon='google plus' />
                                    <Button circular color='instagram' icon='instagram' />
                                    </Popup>
                                    
                                    <a className="color-inherit pull-right" ><Icon name='thumbs up outline' /></a>
                                </div>
                            </div>
                            <Transition visible={this.state.commentHide} animation={"fade down"} duration={"500"}>
                            
                                <div className="comments-box-wrap">
                                    <Comment.Group className="comments-box">
                                        <a className="text-blue" dividing='true'>
                                        View 5 more comments
                                        </a>
                                        <Comment>
                                            <Comment.Avatar src='https://react.semantic-ui.com/images/avatar/small/matt.jpg' />
                                            <Comment.Content>
                                                <Comment.Author>Matt
                                                    <Comment.Text as='span'>Sterlite Tech has been honoured with the Golden Peacock Award for Excellence in Corporate Governance - 2017. Sterlite Tech was selected by the Awards Jury under the Chairmanship of Justice (Dr.) Arijit Pasayat, former Judge, Supreme Court of India. The award will be presented during Golden Peac</Comment.Text>
                                                </Comment.Author>
                                                <Comment.Actions>
                                                    <Comment.Action>Like</Comment.Action>
                                                    <Comment.Action>Reply</Comment.Action>
                                                    <Comment.Metadata>
                                                        <div>Today at 5:42PM</div>
                                                    </Comment.Metadata> 
                                                </Comment.Actions>
                                            </Comment.Content>
                                            <Comment.Group>
                                                <Comment>
                                                    <Comment.Avatar src='https://react.semantic-ui.com/images/avatar/small/jenny.jpg' />
                                                    <Comment.Content>
                                                        <Comment.Author>Elliot Fu
                                                            <Comment.Text as='span'>This has been very useful for my research. Thanks as well!</Comment.Text>
                                                        </Comment.Author>
                                                        <Comment.Actions>
                                                            <Comment.Action>Like</Comment.Action>
                                                            <Comment.Action>Reply</Comment.Action>
                                                            <Comment.Metadata>
                                                                <div>Today at 5:42PM</div>
                                                            </Comment.Metadata> 
                                                        </Comment.Actions>
                                                    </Comment.Content>
                                                </Comment>
                                            </Comment.Group>
                                        </Comment>
                                        <Comment>
                                            <Comment.Avatar src='https://react.semantic-ui.com/images/avatar/small/joe.jpg' />
                                            <Comment.Content>
                                                <Comment.Author>Joe Henderson
                                                    <Comment.Text as='span'>Dude, this is awesome. Thanks so much</Comment.Text>
                                                </Comment.Author>
                                                <Comment.Actions>
                                                    <Comment.Action>Like</Comment.Action>
                                                    <Comment.Action>Reply</Comment.Action>
                                                    <Comment.Metadata>
                                                        <div>5 days ago</div>
                                                    </Comment.Metadata> 
                                                </Comment.Actions>
                                            </Comment.Content>
                                        </Comment>
                                        <Comment>
                                            <Comment.Avatar src='https://react.semantic-ui.com/images/avatar/small/joe.jpg' />
                                            <Comment.Content>
                                                <Form reply>
                                                    <Form.Group>
                                                        <Form.Input placeholder='Write something' className="w100" name='Comment Box' />
                                                        <Form.Button content='Post' primary/>
                                                    </Form.Group>
                                                </Form>
                                            </Comment.Content>
                                        </Comment>
                                    </Comment.Group>
                                </div>
                            </Transition>
                        </article> 
                    </div> 
                </Grid.Column>
            </Grid>
          </Tab.Pane> },

          { menuItem: 'Articles', render: () => <Tab.Pane attached={false}>Tab 2 Content</Tab.Pane> },
          { menuItem: 'Videos', render: () => <Tab.Pane attached={false}>Tab 3 Content</Tab.Pane> },
          { menuItem: 'Image', render: () => <Tab.Pane attached={false}>Tab 3 Content</Tab.Pane> }
        ]
        return (
            <Navbar>
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
                                                                {this.renderProfileImage()}
                                                            </div>
                                                            <div className="profile-info-text">
                                                                <div className="profile-name">
                                                                    <div className="profile-name-text">
                                                                        {this.renderName()}
                                                                    </div>
                                                                    <Button className="mappes-small-button" size='mini' color='green'>Send Message</Button>
                                                                    <div className="profile-drop-down">
                                                                        <Dropdown trigger={<Icon size='large' name={'ellipsis horizontal'} />}>
                                                                            <Dropdown.Menu direction='right' style={{ borderRadius: "10px" }}>
                                                                                <Dropdown.Item className="dropDownThreeDots" text='Share Profile' />
                                                                                <Dropdown.Item className="dropDownThreeDots" text='Copy Profile Link' />
                                                                                <Divider />
                                                                                <Dropdown.Item style={{ marginTop: "5px", marginBottom: "5px" }} className="dropDownThreeDots" text='Report Abuse' />
                                                                            </Dropdown.Menu>
                                                                        </Dropdown>
                                                                    </div>
                                                                </div>
                                                                <div className="profile-designation">
                                                                    Director at Lopamudra Creative
                                                                </div>
                                                                <div className="profile-company mB-10 ">
                                                                    Lopamudra Creative Univercity of central lancashire, Preston Gurgaon, Haryana, India.
                                                                </div>
                                                                <div className="profile-network">
                                                                    <a className="t600 text-blue">(24 People in the network)</a>
                                                                </div>
                                                            </div>
                                                        </div>                                                        
                                                    </Grid.Column>
                                                </Grid>
                                            </Grid.Row>
                                        </Grid>
                                        <Grid padded>
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

                                                        {hidden && 
                                                            <div className="privacy-toolbar">
                                                                <div className="privacy-option">
                                                                    <Dropdown inline options={options} defaultValue={options[0].value} />
                                                                </div>
                                                                <div className="taggin-option">
                                                                    <div className="tag-people">
                                                                        <div className="tag-btn">
                                                                            <Popup
                                                                                basic
                                                                                trigger={<Button onClick={this.toggleTagginPopup} primary size='mini' className="btn-sm">Tag People</Button>}
                                                                                flowing
                                                                                hoverable   
                                                                                className="tagging-popup-wrapper"
                                                                                open={tagginPopup}
                                                                                hideOnScroll={false}
                                                                                position='right center'
                                                                                >
                                                                                <div className="tagging-popup">
                                                                                    <div className="head-point">
                                                                                        <span>Invite to this post</span>
                                                                                        <a onClick={this.toggleTagginPopup}><i className="icon-close"></i></a>
                                                                                    </div>
                                                                                    <Dropdown
                                                                                    multiple
                                                                                    selection
                                                                                    fluid
                                                                                    options={options1}
                                                                                    placeholder='Choose an option'
                                                                                    renderLabel={renderLabel}
                                                                                    />
                                                                                    <TextArea rows={5} placeholder='Type here...' />
                                                                                    <Button onClick={this.onClick} primary >Send Invitation</Button>
                                                                                </div>
                                                                            </Popup>
                                                                        </div>
                                                                        <div className="tagged-value">
                                                                            {/* <Dropdown
                                                                                multiple
                                                                                selection
                                                                                fluid
                                                                                options={options1}
                                                                                placeholder='Choose an option'
                                                                                renderLabel={renderLabel}
                                                                                readonly/> */}
                                                                            <Label image>
                                                                                <img src='https://react.semantic-ui.com/images/avatar/small/ade.jpg' alt="demo" />
                                                                                <span>Adrienne</span>
                                                                                <Icon name='delete' />
                                                                            </Label>
                                                                            <Label image>
                                                                                <img src='https://react.semantic-ui.com/images/avatar/small/zoe.jpg' alt="demo" />
                                                                                <span>Zoe</span>
                                                                                <Icon name='delete' />
                                                                            </Label>
                                                                            
                                                                            <Label image>
                                                                                <img src='https://react.semantic-ui.com/images/avatar/small/nan.jpg' alt="demo" />
                                                                                <span>Anna</span>
                                                                                <Icon name='delete' />
                                                                            </Label>
                                                                            <Label image>
                                                                                <img src='https://react.semantic-ui.com/images/avatar/small/ade.jpg' alt="demo" />
                                                                                <span>Adrienne</span>
                                                                                <Icon name='delete' />
                                                                            </Label>
                                                                            <Label image>
                                                                                <img src='https://react.semantic-ui.com/images/avatar/small/ade.jpg' alt="demo" />
                                                                                <span>Adrienne</span>
                                                                                <Icon name='delete' />
                                                                            </Label>
                                                                            <Label image>
                                                                                <img src='https://react.semantic-ui.com/images/avatar/small/zoe.jpg' alt="demo" />
                                                                                <span>Zoe</span>
                                                                                <Icon name='delete' />
                                                                            </Label>
                                                                            
                                                                            <Label image>
                                                                                <img src='https://react.semantic-ui.com/images/avatar/small/nan.jpg' alt="demo" />
                                                                                <span>Anna</span>
                                                                                <Icon name='delete' />
                                                                            </Label>
                                                                            <Label image>
                                                                                <img src='https://react.semantic-ui.com/images/avatar/small/ade.jpg' alt="demo" />
                                                                                <span>Adrienne</span>
                                                                                <Icon name='delete' />
                                                                            </Label>
                                                                            <Label image>
                                                                                <img src='https://react.semantic-ui.com/images/avatar/small/ade.jpg' alt="demo" />
                                                                                <span>Adrienne</span>
                                                                                <Icon name='delete' />
                                                                            </Label>
                                                                            <Label image>
                                                                                <img src='https://react.semantic-ui.com/images/avatar/small/zoe.jpg' alt="demo" />
                                                                                <span>Zoe</span>
                                                                                <Icon name='delete' />
                                                                            </Label>
                                                                            
                                                                            <Label image>
                                                                                <img src='https://react.semantic-ui.com/images/avatar/small/nan.jpg' alt="demo" />
                                                                                <span>Anna</span>
                                                                                <Icon name='delete' />
                                                                            </Label>
                                                                            <Label image>
                                                                                <img src='https://react.semantic-ui.com/images/avatar/small/ade.jpg' alt="demo" />
                                                                                <span>Adrienne</span>
                                                                                <Icon name='delete' />
                                                                            </Label>
                                                                        </div>
                                                                    </div>
                                                                    <div className="border-b"></div>
                                                                    <div className="tag-product">
                                                                        <div className="tag-btn">
                                                                            <Button primary size='mini' className="btn-sm">Tag Product</Button>
                                                                        </div>
                                                                        <div className="tagged-value">
                                                                            <Label image>
                                                                                <img src='https://react.semantic-ui.com/images/avatar/small/nan.jpg' alt="demo" />
                                                                                <span>Anna</span>
                                                                                <Icon name='delete' />
                                                                            </Label>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        }  
                                                           
                                                    </div>
                                                    <div className="border-b"></div>
                                                </Grid.Column>
                                                <Grid.Column width={16} className="mT-10">
                                                    <Button size='mini' basic className="mR-10 btn-sm" onClick={this.handleOpen} >
                                                        <Icon className="text-blue icon-pdf" name='codepen' />
                                                        Pdf or Ppt  
                                                    </Button>
                                                    <TransitionablePortal open={open} transition={{ animation, duration }}>
                                                        <Modal
                                                            centered={false}
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
                                                            <Modal.Content scrolling>
                                                                <Tab menu={{ secondary: true }} panes={panesModal} />
                                                            </Modal.Content>
                                                            
                                                        </Modal>
                                                    </TransitionablePortal>
                                                    <Button size='mini' basic className="btn-sm" onClick={this.handleVisibility}> 
                                                        <Icon className="text-blue" name='camera' />
                                                        Image or Video
                                                    </Button>
                                                    {hidden && 
                                                        <Button onClick={this.onClick} primary size='mini' floated='right' className="btn-sm">Cancel</Button>
                                                    }
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
                                        </Grid>
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

export default connect(mapStateToProps, actions)(ProfileFeedStatic);
