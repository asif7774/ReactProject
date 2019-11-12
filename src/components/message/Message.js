import React, { Component } from 'react';
import * as ReactDOM from 'react-dom';
import * as actions from '../../actions/'
import { connect } from 'react-redux'
import { Grid, Container, Segment, Image, Responsive, Dropdown, Icon, Button, Divider, List, Modal, Header, TransitionablePortal, Form, TextArea } from 'semantic-ui-react'

import moment from 'moment'
import q from 'q'

import './Message.css'
import Navbar from '../common/Navbar'
import Avatar from '../common/Avatar'
import LeftSidebar from '../common/LeftSidebar'
import RightSection from '../common/RightSection'


class Message extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            animation: 'fade down',
            currentRoom: '',
            chatMessage: "",
            messages: [],
            duration: 700,
            refresh: false
        }
    }

    onChangeChatMessage(e) {
        this.setState({ chatMessage: e.target.value })
    }
    sendMessageToChatRoom() {
        this.props.chatUser.sendMessage({
            text: this.state.chatMessage,
            roomId: this.state.currentRoom
        }).then(() => {
            this.setState({ chatMessage: "" })
        })
    }
    scrollToBottom = () => {
        const { messageList } = this.refs;
        if (messageList) {
            const scrollHeight = messageList.scrollHeight;
            const height = messageList.clientHeight;
            const maxScrollTop = scrollHeight - height;
            ReactDOM.findDOMNode(messageList).scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
        }
    }
    subscribeToChatRoom() {
        this.setState({ messages: [] }, () => {
            this.props.chatUser.subscribeToRoom({
                roomId: this.state.currentRoom,
                messageLimit: 100,
                hooks: {
                    onMessage: message => {
                        console.log(message);
                        this.setState({
                            messages: [...this.state.messages, message],
                        })
                        this.scrollToBottom();
                        // this.messagesEnd.scrollIntoView({ behavior: "smooth" });
                    },
                },

            }).catch(error => console.error('error', error))
        })
    }
    deleteChatRoom = (room) => {
        this.props.chatUser.leaveRoom({
            roomId: room
        }).catch(err => console.error(err))
    }
    handleOpen = (room) => {
        // console.log(room);
        if (room) {
            this.setState({ currentRoom: room }, () => {
                this.subscribeToChatRoom();
            })
        }
        if (this.state.open && this.state.messages.length > 0) {
            this.props.chatUser.setReadCursor({
                roomId: this.state.currentRoom,
                position: this.state.messages[this.state.messages.length - 1].id
            })
                .then(() => setTimeout(() => this.setState({refresh: !this.state.refresh}), 1000)) // just to refresh the ui
                .catch(err => console.log("failed to set cursor", err))
        }
        this.setState({ open: !this.state.open });
    }

    renderName() {
        if (this.props.auth) {
            return (
                <span>{this.props.auth.displayName.split(" ")[0]} {this.props.auth.displayName.split(" ")[1]}</span>
            )
        } else {
            return (
                <span>Loading...</span>
            );
        }
    }

    rendermes() {
        return this.state.messages.map((m, i) => {
            console.log(m);
            if (m.senderId !== this.props.auth.id) {
                return (
                    <li key={m.id} className="thread-in">
                        <div className="thread-pic">
                            <Avatar id={m.senderId} />
                        </div>
                        <div className="thread-body">
                            <div className="thread-text">
                                <div className="thread-name">{m.sender.name}</div>
                                <p>{m.text}</p>
                                <b>{moment(m.createdAt).format('MMMM Do YYYY, h:mm:ss a')}</b>
                            </div>
                        </div>
                    </li>
                )
            } else {
                return (
                    <li key={m.id} className="thread-out">

                        <div className="thread-body">
                            <div className="thread-text">
                                <div className="thread-name">{this.props.auth.displayName}</div>
                                <p>{m.text}</p>
                                <b>{moment(m.createdAt).format('MMMM Do YYYY, h:mm:ss a')}</b>
                            </div>
                        </div>
                        <div className="thread-pic">
                            <Avatar id={this.props.auth.id} />
                        </div>
                    </li>
                )
            }
        })
    }
    renderProfileImage() {
        if (this.props.auth && this.props.auth._json && this.props.auth._json.pictureUrls) {
            return (
                <Image className="avatar-40" avatar src={this.props.auth._json.pictureUrls.values[0]} />
            )
        }

    }
    renderChatImage(room) {
        if (room.users.length === 1) {
            // return <div className="t600 l-h-20">{room.users[0].name}</div>
            return <Avatar id={room.users[0].id} />
        } else {
            if (room.users[0].id !== this.props.auth.id) {
                return <Avatar id={room.users[0].id} />
            } else {
                return <Avatar id={room.users[1].id} />
            }
        }
    }
    renderChatName(room) {
        console.log(room.users);
        if (room.users.length === 1) {
            return <div className={"t600 l-h-20".concat(room.unreadCount > 0 ? " bold" : "")}>{room.users[0].name}</div>
        } else {
            if (room.users[0].id !== this.props.auth.id) {
                return <div className={"t600 l-h-20".concat(room.unreadCount > 0 ? " bold" : "")}>{room.users[0].name}</div>
            } else {
                return <div className={"t600 l-h-20".concat(room.unreadCount > 0 ? " bold" : "")}>{room.users[1].name}</div>
            }
        }
    }

    localeCompare(str1, str2) {
        if(!str1) {
            return "0".localeCompare(str2)
        }
        return str1.localeCompare(str2)
    }
    renderMessageList() {
        const rooms = this.props.chatUser.rooms;
        if (rooms && rooms.length > 0) {
            return rooms.sort((a, b) => this.localeCompare(b.lastMessageAt, a.lastMessageAt)).map((r, i) => {
                return (
                    <List.Item key={i} onClick={this.handleOpen.bind(this, r.id)} className="cursor-pointer">
                        {this.renderChatImage(r)}
                        <List.Content>
                            {this.renderChatName(r)}
                            {/* <List.Description>
                            <small className="color-lightest-grey">2578 Followers | 1 Day <a className="color-gray mL-3"><Icon name='thumbs up outline' /></a></small>
                        </List.Description> */}
                        </List.Content>
                        <List.Content className="dropdown-content">
                            <Dropdown floated='right' direction='right' trigger={<Icon className="color-light-blue" name={'ellipsis horizontal'} />}>
                                <Dropdown.Menu direction='right' style={{ borderRadius: "10px" }}>
                                    <Dropdown.Item className="dropDownThreeDots" text='Reply' onClick={this.handleOpen.bind(this, r.id)} />
                                    <Dropdown.Item className="dropDownThreeDots" text='Delete' onClick={this.deleteChatRoom.bind(this, r.id)} />
                                    <Dropdown.Item className="dropDownThreeDots" text='Block' />
                                    <Divider />
                                    <Dropdown.Item style={{ marginTop: "5px", marginBottom: "5px" }} className="dropDownThreeDots" text='Report Abuse' />
                                </Dropdown.Menu>
                            </Dropdown>
                        </List.Content>
                    </List.Item>)
            })
        } else {
            return (
                <Segment basic textAlign='center'>
                    <h4>There are no messages at this time</h4>
                </Segment>
            );
        }
    }
    render() {
        console.log(this.props.user)
        const { animation, duration, open } = this.state
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
                                        <Grid padded>
                                            <Grid.Row className="background-white extra-padding-sides pD-t-25">
                                                <Grid.Column width={16}>
                                                    <List divided verticalAlign='middle' className="message-center-box">
                                                        {
                                                            this.props.chatUser && this.renderMessageList()
                                                        }
                                                        <TransitionablePortal
                                                            open={open}
                                                            transition={{ animation, duration }}
                                                        >
                                                            <Modal
                                                                dimmer
                                                                open={true}
                                                                onClose={() => this.handleOpen()}
                                                                size='tiny'
                                                                className='conversation-box'
                                                            >
                                                                <Header>
                                                                    <h3 className="t600 m-0">Send Message
                                                                                    <Icon name='close' onClick={() => this.handleOpen()} />
                                                                    </h3>
                                                                </Header>
                                                                <Modal.Content>
                                                                    <div className="conversation">
                                                                        <ul ref="messageList">
                                                                            {this.rendermes()}
                                                                        </ul>
                                                                    </div>
                                                                    {/* <div
                                                                        ref={(el) => { this.messagesEnd = el; }}>
                                                                    </div> */}
                                                                    <div className="chat-input-wrap">
                                                                        <Form>
                                                                            <div className="chat-input">
                                                                                <TextArea onChange={this.onChangeChatMessage.bind(this)} value={this.state.chatMessage} rows={2} placeholder='Type your message' />
                                                                            </div>
                                                                            <div className="chat-control">
                                                                                {/* <Popup
                                                                                    inverted
                                                                                    position='top center'
                                                                                    trigger={<Icon className="cursor-pointer" name='smile' />}
                                                                                    content='Insert Emojis'
                                                                                    size='small'
                                                                                />
                                                                                <Popup
                                                                                    inverted
                                                                                    position='top center'
                                                                                    trigger={<Icon className="cursor-pointer" name='attach' />}
                                                                                    content='File Attachment'
                                                                                    size='small'
                                                                                /> */}
                                                                                <Button onClick={this.sendMessageToChatRoom.bind(this)} primary size='mini'>Send</Button>
                                                                            </div>
                                                                        </Form>
                                                                    </div>
                                                                </Modal.Content>
                                                            </Modal>
                                                        </TransitionablePortal>
                                                        {/*
                                                        <List.Item>
                                                            {this.renderProfileImage()}
                                                            <List.Content>
                                                                <div className="t600 l-h-20">Wish Chandan Wadhwa a happy birthday (today)</div>
                                                                <List.Description>
                                                                    <small className="color-lightest-grey">2578 Followers | 1 Day <a className="color-gray mL-3"><Icon name='thumbs up outline' /></a></small>
                                                                </List.Description>
                                                            </List.Content>
                                                            <List.Content className="dropdown-content">
                                                                <Dropdown floated='right' direction='right' trigger={<Icon className="color-light-blue" name={'ellipsis horizontal'} />}>
                                                                    <Dropdown.Menu direction='right' style={{ borderRadius: "10px" }}>
                                                                        <Dropdown.Item className="dropDownThreeDots" text='Reply' onClick={this.handleOpen} />

                                                                        <Dropdown.Item className="dropDownThreeDots" text='Delete' />
                                                                        <Dropdown.Item className="dropDownThreeDots" text='Block' />
                                                                        <Divider />
                                                                        <Dropdown.Item style={{ marginTop: "5px", marginBottom: "5px" }} className="dropDownThreeDots" text='Report Abuse' />
                                                                    </Dropdown.Menu>
                                                                </Dropdown>
                                                            </List.Content>
                                                        </List.Item>
                                                        <List.Item>
                                                            {this.renderProfileImage()}
                                                            <List.Content>
                                                                <div className="t600 l-h-20">Wish Chandan Wadhwa a happy birthday (today)</div>
                                                                <List.Description>
                                                                    <small className="color-lightest-grey">2578 Followers | 1 Day <a className="color-gray mL-3"><Icon name='thumbs up outline' /></a></small>
                                                                </List.Description>
                                                            </List.Content>
                                                            <List.Content className="dropdown-content">
                                                                <Dropdown floated='right' direction='right' trigger={<Icon className="color-light-blue" name={'ellipsis horizontal'} />}>
                                                                    <Dropdown.Menu direction='right' style={{ borderRadius: "10px" }}>
                                                                        <Dropdown.Item className="dropDownThreeDots" text='Reply' onClick={this.handleOpen} />
                                                                        <Dropdown.Item className="dropDownThreeDots" text='Delete' />
                                                                        <Dropdown.Item className="dropDownThreeDots" text='Block' />
                                                                        <Divider />
                                                                        <Dropdown.Item style={{ marginTop: "5px", marginBottom: "5px" }} className="dropDownThreeDots" text='Report Abuse' />
                                                                    </Dropdown.Menu>
                                                                </Dropdown>
                                                            </List.Content>
                                                        </List.Item>
                                                        <List.Item>
                                                            {this.renderProfileImage()}
                                                            <List.Content>
                                                                <div className="t600 l-h-20">Wish Chandan Wadhwa a happy birthday (today)</div>
                                                                <List.Description>
                                                                    <small className="color-lightest-grey">2578 Followers | 1 Day <a className="color-gray mL-3"><Icon name='thumbs up outline' /></a></small>
                                                                </List.Description>
                                                            </List.Content>
                                                            <List.Content className="dropdown-content">
                                                                <Dropdown floated='right' direction='right' trigger={<Icon className="color-light-blue" name={'ellipsis horizontal'} />}>
                                                                    <Dropdown.Menu direction='right' style={{ borderRadius: "10px" }}>
                                                                        <Dropdown.Item className="dropDownThreeDots" text='Reply' onClick={this.handleOpen} />
                                                                        <Dropdown.Item className="dropDownThreeDots" text='Delete' />
                                                                        <Dropdown.Item className="dropDownThreeDots" text='Block' />
                                                                        <Divider />
                                                                        <Dropdown.Item style={{ marginTop: "5px", marginBottom: "5px" }} className="dropDownThreeDots" text='Report Abuse' />
                                                                    </Dropdown.Menu>
                                                                </Dropdown>
                                                            </List.Content>
                                                        </List.Item>
                                                        */}
                                                    </List>
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

function mapStateToProps({ auth, user, chatUser }) {
    return { auth, user, chatUser };
}

export default connect(mapStateToProps, actions)(Message);
