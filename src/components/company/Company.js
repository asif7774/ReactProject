import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import * as ReactDOM from 'react-dom';
import * as actions from '../../actions/'
import Chatkit from '@pusher/chatkit-client'
import { connect } from 'react-redux'
import { Container, Form, Table, Dropdown, Label, Image, Modal, List, Search, Button, Icon, Grid, Header, Divider, Responsive, TextArea, TransitionablePortal, Input } from 'semantic-ui-react'
import logo from './logo.jpg';

import Navbar from '../common/Navbar'
import LeftSidebar from '../common/LeftSidebar'
import RightSection from '../common/RightSection'
import LoginBar from '../common/LoginBar'
import Avatar from '../common/Avatar'
import moment from 'moment'
import axios from 'axios'
import { toast } from 'react-toastify';
import { BASE_URL } from '../../config/config'
import '../product/product.css';
import { Message } from 'semantic-ui-react'

let companyId = null;

const resultRenderer = (result) => <Label key={result._source.id} content={result._source.name} />

class Company extends Component {


    constructor(props) {
        super(props);
        this.state = {
            modalOpen: false,
            messages: [],
            modalProductOpen: false,
            modalAddProductOpen: false,
            modalEmailOpen: false,
            raws: [],
            newProducts: [],
            description: "",
            company_updated: "",
            otherUser: "",
            currentRoom: "",
            chatMessage: "",
            addRawButtonLoading: false,
            open: false,
            animation: 'fly down',
            duration: 700,
            loading: true
        }
        this.scrollToTable = this.scrollToTable.bind(this);
    }
    notify = () => {
        toast.success("Successfully added product !", {
            autoClose: 3000,
        });
    }
    // handleOpen = () => this.setState({ modalOpen: true })

    handleClose = () => this.setState({ modalOpen: false })
    handleProductOpen = () => this.setState({ modalProductOpen: true })

    handleProductClose = () => this.setState({ modalProductOpen: false })
    handleResultSelect = (e, { result }) => {
        let newRaw = this.state.raws
        newRaw.push({
            id: result._source.id,
            name: result._source.name
        })
        this.setState({
            raws: newRaw,
            value: "",
            description: ""
        })
    }

    handleSearchChange = (e, { value }) => {
        this.setState({ value })
        if (value.length > 4) {
            this.setState({ isLoading: true })
            axios.get(`${BASE_URL}/api/v1/product/search/${value}`, { withCredentials: true })
                .then(response => {
                    console.log(response.data);
                    this.setState({
                        isLoading: false,
                        results: response.data
                    })
                })
        }

    }

    addRawMaterials() {
        this.setState({
            addRawButtonLoading: true
        })
        Promise
            .all(this.state.newProducts.map(newProduct => axios.post(`${BASE_URL}/api/v1/product/id`,
                { name: newProduct.name, desc: newProduct.description },
                { withCredentials: true })))
            .then(responses => {
                console.log("product created", responses)
                let raws = this.state.raws.concat(responses.map(response => response.data))
                return Promise.all(raws.map(raw => {
                    let data = {
                        company_id: companyId,
                        company_name: this.props.company.info.Item.name,
                        product_id: raw.id,
                        product_name: raw.name
                    }
                    return axios.post(`${BASE_URL}/api/v1/product/supplier`, data, { withCredentials: true })
                }))
            })
            .then(() => {
                this.setState({
                    addRawButtonLoading: false,
                    raws: [],
                    newProducts: [],
                    modalAddProductOpen: false
                })
                console.log("fetch product data again")
                this.getSuppliedProducts()
            })
            .catch(err => {
                console.log("failed to add raw materials:", err);
                this.setState({ err: err, modalAddProductOpen: false });
                this.getSuppliedProducts()
            });
    }
    removeItem(id, name) {
        if (id) {
            this.setState({
                raws: this.state.raws.filter(e => e.id !== id)
            })
        }
        else {
            this.setState({
                newProducts: this.state.newProducts.filter(e => e.name !== name)
            })
        }
    }
    renderRawMaterials() {
        let endMaterials = this.state.raws.concat(this.state.newProducts);
        return endMaterials.map((raw, index) => {
            return (
                <List.Item key={index}>
                    <List.Content floated='right'>
                        <Button icon onClick={this.removeItem.bind(this, raw.id, raw.name)} color={'red'}>
                            <Icon name='delete' />
                        </Button>
                    </List.Content>
                    <List.Content style={{ fontSize: '19px', color: '#979499' }}>
                        {raw.name}
                    </List.Content>
                </List.Item>
            )
        })
    }

    handleAddProduct = e => {
        let products = this.state.newProducts;
        products.push({ name: this.state.value, description: this.state.description });
        this.setState({
            newProducts: products,
            value: "",
            description: ""
        });
    }


    addCompany() {
        this.setState({
            addRawButtonLoading: true
        })
        // console.log(this.refs.name.value);
        // console.log(this.refs.url.value);
        // console.log(this.refs.desc.value);
        // console.log(this.refs.address.value);
        // console.log(this.refs.country.value);
        let data = {
            name: this.refs.name.value,
            desc: this.refs.desc.value,
        }
        axios.post(`${BASE_URL}/api/v1/product`, data, { withCredentials: true })
        let that = this;
        setTimeout(function () {
            that.setState({
                addRawButtonLoading: false,
                modalProductOpen: false
            })
            that.notify();
        }, 3000);

    }
    getSuppliedProducts() {
        axios.get(`${BASE_URL}/api/v1/company/${companyId}/products`, { withCredentials: true })
            .then((response) => {
                // console.log(response);
                this.setState({
                    suppliedProducts: response.data
                })
            })
    }
    getEmployees() {
        axios.get(`${BASE_URL}/api/v1/company/${companyId}/employees`, { withCredentials: true })
            .then((response) => {
                // console.log(response);
                this.setState({
                    employees: response.data
                })
            })
    }
    componentWillMount() {

        let loginInfo = sessionStorage.getItem("login");
        if (!loginInfo) {
            sessionStorage.setItem("login", 0);
        } else {
            loginInfo++;
            sessionStorage.setItem("login", loginInfo);
            if (loginInfo > 3) {
                this.props.showLoginModal();
            }
        }

        companyId = this.props.match.params.id;
        this.props.getCompanyInfo(companyId);
        this.getSuppliedProducts();
        this.getEmployees();
        if (this.props.auth) {
            this.getProfileData(this.props.auth);
        }



    }

    reload = () => {
        companyId = this.props.match.params.id;
        this.props.getCompanyInfo(companyId);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.company.info) {
            this.setState({ loading: false });
        }

        if (this.props.match.params.id !== nextProps.match.params.id) {

            let loginInfo = sessionStorage.getItem("login");
            if (!loginInfo) {
                sessionStorage.setItem("login", 0);
            } else {
                loginInfo++;
                sessionStorage.setItem("login", loginInfo);
                if (loginInfo > 3) {
                    this.props.showLoginModal();
                }
            }
            companyId = nextProps.match.params.id;
            this.props.getCompanyInfo(companyId);
            this.getSuppliedProducts();
            this.getEmployees();
            window.scroll({
                top: 0,
                left: 0,
                behavior: 'smooth'
            });
        }
        if (!this.props.auth && nextProps && nextProps.auth) {
            // alert("Tr");
            this.getProfileData(nextProps.auth);
        }
    }

    scrollToBottom = () => {
        const { messageList } = this.refs;
        const scrollHeight = messageList.scrollHeight;
        const height = messageList.clientHeight;
        const maxScrollTop = scrollHeight - height;
        ReactDOM.findDOMNode(messageList).scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
    }

    subscribeToChatRoom() {
        this.setState({ messages: [] })
        return this.props.chatUser.subscribeToRoom({
            roomId: this.state.currentRoom.id,
            messageLimit: 100,
            hooks: {
                onMessage: message => {
                    console.log(message);
                    this.setState({
                        messages: [...this.state.messages, message],
                    })
                    this.scrollToBottom();
                },
            },

        }).catch(error => console.error('error', error))
    }

    renderSuppliedProducts() {
        return this.state.suppliedProducts.Items.map((supp, index) => {
            return (
                <Table.Row key={index}>
                    <Table.Cell><Link to={`/product/${supp.product_id}`}>{supp.product_name}</Link></Table.Cell>
                    {/* <Table.Cell></Table.Cell> */}
                    {/* <Table.Cell textAlign='center'>
                        <Icon onClick={this.handleOpen} className="color-green cursor-pointer font-18" name='mail' />

                    </Table.Cell> */}
                </Table.Row>
            )
        });
    }
    onChangeChatMessage(e) {
        this.setState({ chatMessage: e.target.value })
    }

    sendMessageToChatRoom() {
        if (!this.checkIfChatRoomExist(this.state.otherUser.user_id)) {
            this.props.chatUser.createRoom({
                name: "Private Chat",
                customData: { name: this.props.auth.id + this.state.otherUser.user_id },
                addUserIds: [this.state.otherUser.user_id],
                private: true,
            }).then(room => {
                console.log(room);
                this.setState({ currentRoom: room });
                return this.subscribeToChatRoom();
            }).then(() => {
                this.props.chatUser.sendMessage({
                    text: this.state.chatMessage,
                    roomId: this.state.currentRoom.id
                }).then(() => {
                    this.setState({ chatMessage: "" })
                })
            })
        }
        else {
            this.props.chatUser.sendMessage({
                text: this.state.chatMessage,
                roomId: this.state.currentRoom.id
            }).then(() => {
                this.setState({ chatMessage: "" })
            })
        }
    }
    renderEmployees() {
        return this.state.employees.Items.map((e, index) => {
            console.log(e);
            return (
                <Table.Row key={index}>
                    <Table.Cell><Link to={'/networkFeed/user/' + e.user_id}>{e.user_name}</Link></Table.Cell>
                    <Table.Cell>{e.designation}</Table.Cell>
                    <Table.Cell textAlign='center'>
                        {this.props.auth && e.user_id !== this.props.auth.id &&
                            <Icon onClick={() => this.handleOpen(e)} className="color-green cursor-pointer font-18" name='mail' />
                        }
                    </Table.Cell>
                </Table.Row>
            )
        });
    }
    handleEmailOpen = () => this.setState({ modalEmailOpen: true })

    handleEmailClose = () => this.setState({ modalEmailOpen: false })
    handleAddProductOpen = () => this.setState({ modalAddProductOpen: true })

    handleAddProductClose = () => this.setState({ modalAddProductOpen: false })

    rendermes() {
        return this.state.messages.map((m, i) => {
            // console.log(m);
            if (m.senderId === this.state.otherUser.user_id) {
                return (
                    <li key={m.id} className="thread-in">
                        <div className="thread-pic">
                            <Avatar id={this.state.otherUser.user_id} />
                        </div>
                        <div className="thread-body">
                            <div className="thread-text">
                                <div className="thread-name">{this.state.otherUser.user_name}</div>
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

    checkIfChatRoomExist(otherUserId) {
        const exists = this.props.chatUser.rooms.find(
            x =>
                x.name === otherUserId + this.props.auth.id ||
                x.name === this.props.auth.id + otherUserId ||
                (x.customData &&
                    (x.customData.name === otherUserId + this.props.auth.id ||
                        x.customData.name === this.props.auth.id + otherUserId))
        )
        return exists;
    }

    handleOpen = (otherUser) => {
        var self = this;
        setTimeout(() => {
            if (otherUser && otherUser.user_id) {
                // check is room exist
                self.setState({ otherUser })
                if (self.checkIfChatRoomExist(otherUser.user_id)) {
                    let room = self.checkIfChatRoomExist(otherUser.user_id);
                    self.setState({ currentRoom: room });
                    self.subscribeToChatRoom();
                }
                else {
                    self.setState({ messages: [] });
                }
                // yes subscribe
                // no create and subscribe
            }
            // yes subscribe
            // no create and subscribe
        }, 0)
        this.setState({ open: !this.state.open });
    }

    // renderName() {
    //     if (this.props.auth) {

    //         return (
    //             <span>{this.props.auth.displayName.split(" ")[0]} {this.props.auth.displayName.split(" ")[1]}</span>
    //         )
    //     } else {
    //         return (
    //             <span>Loading...</span>
    //         );
    //     }
    // }
    renderProfileImage() {
        if (this.props.auth && this.props.auth._json && this.props.auth._json.pictureUrls) {
            return (
                <Image className="avatar-40" avatar src={this.props.auth._json.pictureUrls.values[0]} />
            )
        }

    }
    getProfileData(auth) {
        axios.get(`${BASE_URL}/api/v1/user/profile/byId/${auth.id}`, { withCredentials: true })
            .then(user => {
                console.log(user.data.Item.company_updated);
                this.setState({
                    company_updated: user.data.Item.company_updated
                })
            }).catch(err => {
                console.log(err);
            })
    }
    scrollToTable(tableName) {
        this[tableName].scrollIntoView({ "block": "center", "behavior": "smooth" });
    }

    OpenUpdateCompany = () => {
        this.setState({
            modalCompanyOpen: true,
            updatedCompanyName: this.props.company.info.Item.name,
            updatedCompanyAddress: this.props.company.info.Item.address,
            updatedCompanyUrl: this.props.company.info.Item.url,
            updatedCompanyDescription: this.props.company.info.Item.description,
            updatedCompanyCountry: this.props.company.info.Item.country
        });
    }

    updateCompany() {
        this.setState({
            addRawButtonLoading: true
        })
        let data = {
            name: this.state.updatedCompanyName,
            address: this.state.updatedCompanyAddress,
            url: this.state.updatedCompanyUrl,
            description: this.state.updatedCompanyDescription,
            country: this.state.updatedCompanyCountry
        }
        axios.put(`${BASE_URL}/api/v1/company/${this.props.company.info.Item.id}`, data, { withCredentials: true }).then(response => {
            if (response.status == 200) {
                toast.success("Company updated!", {
                    autoClose: 3000,
                });
                this.setState({ addRawButtonLoading: false, modalCompanyOpen: false });
                this.reload();
            } else {
                toast.error("Failed to update company", {
                    autoClose: 3000,
                });
            }
        }).catch(err => {
            toast.error("Failed to update company", {
                autoClose: 3000,
            });
        });
    }

    render() {
        // console.log(this.props.auth);
        const { isLoading, value, results, animation, duration, open, description } = this.state
        let companyUrl = this.props.company.info && this.props.company.info.Item && this.props.company.info.Item.url || ""
        if (companyUrl && !(companyUrl.startsWith('http://') || companyUrl.startsWith('https://'))) {
            companyUrl = '//' + companyUrl;
        }
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
                                    {!this.props.company.info || !this.props.company.info.Item ?
                                        this.state.loading || <div className="main-content_inner">
                                            <Message negative>
                                                <Message.Header>Sorry, the company you requested doesn't exist in our system</Message.Header>
                                                <p>Please search your company or go back to <a href="/">home page</a></p>
                                            </Message>
                                        </div>
                                        :
                                        <div className="main-content_inner">
                                            <Grid verticalAlign='top' padded className="full-width">
                                                <Grid.Row className="extra-padding-sides pD-t-30">
                                                    <Grid.Column width={13}>
                                                        <Image src={logo} className="company_detail--logo" circular verticalAlign='top' />
                                                        <div className="company_detail-info">
                                                            <div className="h4 mB-5">
                                                                {this.props.company.info && this.props.company.info.Item.name}
                                                            </div>
                                                            <div>
                                                                <a target="_blank" className="color-light-blue fw-600" href={companyUrl}>{this.props.company.info && this.props.company.info.Item.url}</a>
                                                            </div>
                                                        </div>
                                                    </Grid.Column>
                                                    <Grid.Column floated='right' textAlign='right' width={3}>
                                                        <Dropdown trigger={<Icon size='large' name={'ellipsis horizontal'} />}>
                                                            <Dropdown.Menu direction='right' style={{ borderRadius: "10px" }}>
                                                                <Modal open={this.state.modalCompanyOpen} onClose={this.handleClose} size={'large'} trigger={<Dropdown.Item onClick={this.OpenUpdateCompany} className="dropDownThreeDots" text='Update Company' />}>
                                                                    <Modal.Header>Update Company</Modal.Header>
                                                                    <Modal.Content>
                                                                        <Modal.Description>
                                                                            <Form>
                                                                                <Form.Field>
                                                                                    <label>Name</label>
                                                                                    <input value={this.state.updatedCompanyName} onChange={e => this.setState({updatedCompanyName: e.target.value})} />
                                                                                </Form.Field>
                                                                                <Form.Field>
                                                                                    <label>Address</label>
                                                                                    <input value={this.state.updatedCompanyAddress} onChange={e => this.setState({updatedCompanyAddress: e.target.value})} />
                                                                                </Form.Field>
                                                                                <Form.Field>
                                                                                    <label>Url</label>
                                                                                    <input value={this.state.updatedCompanyUrl} onChange={e => this.setState({updatedCompanyUrl: e.target.value})} />
                                                                                </Form.Field>
                                                                                <Form.Field>
                                                                                    <label>Country</label>
                                                                                    <input value={this.state.updatedCompanyCountry} onChange={e => this.setState({updatedCompanyCountry: e.target.value})} />
                                                                                </Form.Field>
                                                                                <Form.Field>
                                                                                    <label>Description</label>
                                                                                    <input value={this.state.updatedCompanyDescription} onChange={e => this.setState({updatedCompanyDescription: e.target.value})}/>
                                                                                </Form.Field>
                                                                            </Form>

                                                                            <div style={{ textAlign: 'center', paddingTop: '20px' }}>
                                                                                <Button loading={this.state.addRawButtonLoading} primary animated className="background-light-blue" onClick={this.updateCompany.bind(this)}  >
                                                                                    <Button.Content visible>Submit</Button.Content>
                                                                                    <Button.Content hidden>
                                                                                        <Icon name='right arrow' />
                                                                                    </Button.Content>
                                                                                </Button>
                                                                                <Button animated color='red' onClick={() => this.setState({modalCompanyOpen: false})} >
                                                                                    <Button.Content visible>Cancel</Button.Content>
                                                                                    <Button.Content hidden>
                                                                                        <Icon name='delete' />
                                                                                    </Button.Content>
                                                                                </Button>
                                                                            </div>

                                                                        </Modal.Description>
                                                                    </Modal.Content>
                                                                </Modal>
                                                                <Modal open={this.state.modalProductOpen} onClose={this.handleProductClose} size={'large'} trigger={<Dropdown.Item onClick={this.handleProductOpen} className="dropDownThreeDots" text='Create Product' />}>
                                                                    <Modal.Header>Create Product</Modal.Header>
                                                                    <Modal.Content>
                                                                        <Modal.Description>
                                                                            <Form>
                                                                                <Form.Field>
                                                                                    <label>Name</label>
                                                                                    <input placeholder='Name' ref="name" />
                                                                                </Form.Field>
                                                                                <Form.Field>
                                                                                    <label>Description</label>
                                                                                    <input placeholder='description' ref="desc" />
                                                                                </Form.Field>
                                                                            </Form>

                                                                            <div style={{ textAlign: 'center', paddingTop: '20px' }}>
                                                                                <Button loading={this.state.addRawButtonLoading} primary animated className="background-light-blue" onClick={this.addCompany.bind(this)}  >
                                                                                    <Button.Content visible>Submit</Button.Content>
                                                                                    <Button.Content hidden>
                                                                                        <Icon name='right arrow' />
                                                                                    </Button.Content>
                                                                                </Button>
                                                                                <Button animated color='red' onClick={this.handleClose} >
                                                                                    <Button.Content visible>Cancel</Button.Content>
                                                                                    <Button.Content hidden>
                                                                                        <Icon name='delete' />
                                                                                    </Button.Content>
                                                                                </Button>
                                                                            </div>

                                                                        </Modal.Description>
                                                                    </Modal.Content>
                                                                </Modal>
                                                                {/* <Dropdown.Item className="dropDownThreeDots" text='Edit Company' /> */}
                                                            </Dropdown.Menu>
                                                        </Dropdown>
                                                    </Grid.Column>
                                                </Grid.Row>
                                            </Grid>
                                            <Grid padded>
                                                <Grid.Row className="extra-padding-sides">
                                                    <Grid.Column width={16}>
                                                        {this.props.company.info && this.props.company.info.Item.description}
                                                    </Grid.Column>
                                                </Grid.Row>
                                            </Grid>
                                            <Grid padded divided >
                                                <Grid.Row className="extra-padding-sides">
                                                    <Grid.Column mobile={16} tablet={8} computer={8}>
                                                        <div className="state-head">
                                                            Company Address
                                                    </div>
                                                        <div className="state-address">
                                                            {this.props.company.info && this.props.company.info.Item.address}
                                                        </div>
                                                    </Grid.Column>
                                                    <Grid.Column className="cursor-pointer" mobile={16} tablet={4} computer={4} onClick={() => this.scrollToTable("contacts")}>
                                                        <div className="state-head">
                                                            Listed Contacts
                                                    </div>
                                                        <div className="state-mid">
                                                            {(this.state.employees && this.state.employees.Items) ? this.state.employees.Items.length : 0}
                                                        </div>
                                                    </Grid.Column>
                                                    <Grid.Column className="cursor-pointer" mobile={16} tablet={4} computer={4} onClick={() => this.scrollToTable("suppliedProducts")}>
                                                        <div className="state-head">
                                                            Listed Products
                                                    </div>
                                                        <div className="state-mid">
                                                            {(this.state.suppliedProducts && this.state.suppliedProducts.Items) ? this.state.suppliedProducts.Items.length : 0}
                                                        </div>
                                                    </Grid.Column>
                                                </Grid.Row>
                                            </Grid>
                                            <Grid padded>
                                                <Grid.Row className="background-white extra-padding-sides pD-b-3">
                                                    <Grid.Column width={16}>
                                                        <Grid>
                                                            <Grid.Column floated='left' width={13}>
                                                                <div ref={element => { this.contacts = element }}>
                                                                    <Header as={'h4'} className="table-heading pD-b-10" >Contacts</Header>
                                                                </div>
                                                            </Grid.Column>
                                                        </Grid>
                                                    </Grid.Column>
                                                    <Grid.Column width={16}>
                                                        <Divider className="tableDivider" />
                                                    </Grid.Column>
                                                    <Grid.Column width={16}>
                                                        <Table padded basic='very' striped unstackable>
                                                            <Table.Header>
                                                                <Table.Row>
                                                                    <Table.HeaderCell className="color-light-blue" >Name</Table.HeaderCell>
                                                                    <Table.HeaderCell className="color-light-blue" >Designation</Table.HeaderCell>
                                                                    {/* <Table.HeaderCell className="color-light-blue">Number of Companies</Table.HeaderCell> */}
                                                                    <Table.HeaderCell textAlign='center' className="color-light-blue">Send Message</Table.HeaderCell>
                                                                </Table.Row>
                                                            </Table.Header>

                                                            <Table.Body>
                                                                {this.state.employees && this.renderEmployees()}
                                                            </Table.Body>
                                                        </Table>
                                                    </Grid.Column>
                                                </Grid.Row>
                                                <Grid.Row className="background-white extra-padding-sides pD-b-3">
                                                    <Grid.Column width={16}>
                                                        <Grid>
                                                            <Grid.Column floated='left' width={13}>
                                                                <div ref={element => { this.suppliedProducts = element }}>
                                                                    <Header as={'h4'} className="table-heading pD-b-10" >Supplied Products</Header>
                                                                </div>
                                                            </Grid.Column>
                                                            <Grid.Column textAlign='right' floated='right' width={3}>
                                                                <Dropdown direction='right' trigger={<Icon className="color-light-blue pD-t-15" size='large' name={'ellipsis horizontal'} />}>
                                                                    <Dropdown.Menu direction='right' style={{ borderRadius: "10px" }}>

                                                                        <Modal open={this.state.modalAddProductOpen} onClose={this.handleAddProductClose} size={'large'} trigger={<Dropdown.Item onClick={this.handleAddProductOpen} className="dropDownThreeDots" text='Add Product' />}>
                                                                            <Modal.Header>Add supplied products</Modal.Header>
                                                                            <Modal.Content>
                                                                                <Modal.Description>
                                                                                    <Grid>
                                                                                        <Grid.Column width={2}>
                                                                                        </Grid.Column>
                                                                                        <Grid.Column width={12}>
                                                                                            <Grid>
                                                                                                <Grid.Column width={7}>
                                                                                                    <Search
                                                                                                        fluid
                                                                                                        loading={isLoading}
                                                                                                        onResultSelect={this.handleResultSelect}
                                                                                                        onSearchChange={this.handleSearchChange}
                                                                                                        results={results}
                                                                                                        value={value}
                                                                                                        resultRenderer={resultRenderer}
                                                                                                    /></Grid.Column>
                                                                                                <Grid.Column width={7}>
                                                                                                    <Input placeholder='Desription' fluid value={description} onChange={e => this.setState({ description: e.target.value })} />
                                                                                                </Grid.Column>
                                                                                                <Grid.Column width={2}>
                                                                                                    <Button icon primary onClick={this.handleAddProduct}>
                                                                                                        <Icon name="add" />
                                                                                                    </Button>
                                                                                                </Grid.Column>
                                                                                            </Grid>
                                                                                            <List style={{ paddingTop: '20px' }} animated divided verticalAlign='middle'>
                                                                                                {this.renderRawMaterials()}
                                                                                            </List>
                                                                                        </Grid.Column>
                                                                                        <Grid.Column width={2}>
                                                                                        </Grid.Column>
                                                                                    </Grid>

                                                                                    <div style={{ textAlign: 'center', paddingTop: '20px' }}>
                                                                                        <Button loading={this.state.addRawButtonLoading} primary animated className="background-light-blue" onClick={this.addRawMaterials.bind(this)}  >
                                                                                            <Button.Content visible>Submit</Button.Content>
                                                                                            <Button.Content hidden>
                                                                                                <Icon name='right arrow' />
                                                                                            </Button.Content>
                                                                                        </Button>
                                                                                        <Button animated color='red' onClick={this.handleAddProductClose} >
                                                                                            <Button.Content visible>Cancel</Button.Content>
                                                                                            <Button.Content hidden>
                                                                                                <Icon name='delete' />
                                                                                            </Button.Content>
                                                                                        </Button>
                                                                                    </div>

                                                                                    {/* <button onClick={this.addRawMaterials.bind(this)}>Done</button> */}
                                                                                </Modal.Description>
                                                                            </Modal.Content>
                                                                        </Modal>
                                                                    </Dropdown.Menu>
                                                                </Dropdown>
                                                            </Grid.Column>
                                                        </Grid>
                                                    </Grid.Column>
                                                    <Grid.Column width={16}>
                                                        <Divider className="tableDivider" />
                                                    </Grid.Column>
                                                    <Grid.Column width={16}>
                                                        <Table padded basic='very' striped unstackable>
                                                            <Table.Header>
                                                                <Table.Row>
                                                                    <Table.HeaderCell className="color-light-blue" >Product Name</Table.HeaderCell>
                                                                    {/* <Table.HeaderCell className="color-light-blue">Number of Companies</Table.HeaderCell> */}
                                                                    {/* <Table.HeaderCell textAlign='center' className="color-light-blue">Send Enquiry</Table.HeaderCell> */}
                                                                </Table.Row>
                                                            </Table.Header>

                                                            <Table.Body>
                                                                {this.state.suppliedProducts && this.renderSuppliedProducts()}
                                                            </Table.Body>
                                                        </Table>
                                                        <TransitionablePortal open={open} transition={{ animation, duration }}>
                                                            <Modal
                                                                dimmer
                                                                open={true}
                                                                onClose={this.handleOpen}
                                                                size='tiny'
                                                                className='conversation-box'
                                                            >
                                                                <Header>
                                                                    <h3 className="t600 m-0">Send Message
                                                                    <Icon name='close' onClick={this.handleOpen} />
                                                                    </h3>
                                                                </Header>
                                                                <Modal.Content>
                                                                    <div className="conversation">
                                                                        <ul ref="messageList">
                                                                            {this.rendermes()}

                                                                        </ul>
                                                                    </div>
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
                                                    </Grid.Column>
                                                </Grid.Row>
                                            </Grid>
                                            {/* <Grid>
                                            <Grid.Column floated='left' width={14}>
                                                <Header className="table-heading" >Supplied products</Header>
                                            </Grid.Column>
                                            <Grid.Column floated='right' width={2}>
                                                <Icon className="color-light-blue" size='big' name={'ellipsis horizontal'} />
                                            </Grid.Column>
                                        </Grid>
                                        <Divider />
                                        <Table color='grey' padded={true} basic='very'>
                                            <Table.Header>
                                                <Table.Row>
                                                    <Table.HeaderCell className="color-light-blue" >Name</Table.HeaderCell>
                                                    <Table.HeaderCell className="color-light-blue">Country</Table.HeaderCell>
                                                </Table.Row>
                                            </Table.Header>

                                            <Table.Body>
                                                <Table.Row>
                                                    <Table.Cell>Optical Fibre</Table.Cell>
                                                    <Table.Cell></Table.Cell>
                                                </Table.Row>
                                                <Table.Row>
                                                    <Table.Cell>Optical Fibre</Table.Cell>
                                                    <Table.Cell></Table.Cell>
                                                </Table.Row>
                                                <Table.Row>
                                                    <Table.Cell>Optical Fibre</Table.Cell>
                                                    <Table.Cell></Table.Cell>
                                                </Table.Row>
                                                <Table.Row>
                                                    <Table.Cell>Optical Fibre</Table.Cell>
                                                    <Table.Cell></Table.Cell>
                                                </Table.Row>
                                                <Table.Row>
                                                    <Table.Cell>Optical Fibre</Table.Cell>
                                                    <Table.Cell></Table.Cell>
                                                </Table.Row>
                                            </Table.Body>
                                        </Table> */}
                                        </div>}
                                </div>
                            </Grid.Column>
                            <RightSection />
                        </Grid>
                    </Container>
                </div>
                <div className="other-page-login-bar">
                    <LoginBar className="other-page-login-bar" location={this.props.location} loginModelOpenCallback={() => { this.setState({ modalOpen: false }) }} />
                </div>
            </Navbar>
        );
    }
}

function mapStateToProps({ singleCompany, auth, chatUser }) {
    return { company: singleCompany, auth, chatUser };
}

export default connect(mapStateToProps, actions)(Company);
