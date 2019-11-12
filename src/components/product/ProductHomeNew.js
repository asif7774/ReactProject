import React, { Component } from 'react';
import { bindActionCreators } from 'redux'

import * as actions from '../../actions/'
import { networkFeedActions } from '../../actions';
import { connect } from 'react-redux'
import * as ReactDOM from 'react-dom';

import { Grid, Label, Comment, Form, Header, Button, Tab, Container, Responsive } from 'semantic-ui-react'
import Navbar from '../common/Navbar'
import Stats from './productHomeContainer/Stats'
import Supplier from './productHomeContainer/Supplier'
import LeftSidebar from '../common/LeftSidebar'
import LoginBar from '../common/LoginBar'
import RawMaterial from './productHomeContainer/RawMaterial'
import Application from './productHomeContainer/Application'
import Customer from './productHomeContainer/Customer'
import Info from './productHomeContainer/Info'

import './product.css';

// import Footer from '../common/Footer'
// import Preloader from '../common/Preloader'
import RightSidebarAuth from '../common/RightSidebarAuth'
import RightSidebar from '../common/RightSidebar'
import RightSection from '../common/RightSection'

import axios from 'axios'
import { BASE_URL } from '../../config/config'
import Activity from './productHomeContainer/Activity'

let productId = null;
// let amazonId = null;
class ProductHome extends Component {

    constructor(props) {
        super(props);
        this.state = {
            status: "",
            youtube: "",
            products: []
        }
        this.onFormSubmit = this.onFormSubmit.bind(this)
        this.onChange = this.onChange.bind(this)
        this.fileUpload = this.fileUpload.bind(this)
        this.getData = this.getData.bind(this)
    }


    resetComponent = () => this.setState({ isLoading: false, results: [], value: '' })

    handleResultSelect = (e, { result }) => {
        this.setState({ value: result.name })
        let newProducts = this.state.products
        newProducts.push({
            id: result.id,
            name: result.name
        })
        console.log(newProducts);
        this.setState({
            products: newProducts,
            value: ""
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
                        results: response.data.Items
                    })
                })
        }

    }


    renderStatus() {
        return (
            <Tab.Pane>
                <Comment.Group>
                    <Header as='h3' dividing>Status</Header>



                    <Form reply>
                        <Form.TextArea value={this.state.status} onChange={this.onStatusChange.bind(this)} />
                        <Button content='Add Status' labelPosition='left' icon='edit' primary onClick={this.addStatus.bind(this)} />
                    </Form>
                </Comment.Group>
            </Tab.Pane>
        );
    }
    getSignedUrl() {
        return axios.get(`${BASE_URL}/api/v1/product/signedUrl/image`, { withCredentials: true })
    }
    onFormSubmit(e) {
        e.preventDefault() // Stop form submit
        this.getSignedUrl().then((response) => {
            console.log(response.data.signedRequest);
            this.fileUpload(this.state.file, response.data.signedRequest);
        })
    }
    onChange(e) {
        this.setState({ file: e.target.files[0] })
    }
    fileUpload(file, url) {
        // const url = 'http://example.com/file-upload';
        // const formData = new FormData();
        // formData.append('file', file)
        // console.log(file);
        // const config = {
        //     headers: {
        //         'content-type': 'multipart/form-data'
        //     }
        // }
        // return axios.put(url, formData, config)

        const xhr = new XMLHttpRequest();
        xhr.open('PUT', url);
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    alert("Uploaded")
                }
                else {
                    alert('Could not upload file.');
                }
            }
        };
        xhr.send(file);


    }
    panes() {
        return [
            {
                menuItem: 'Tab 1', render: () =>
                    <Tab.Pane>
                        <Comment.Group>
                            <Header as='h3' dividing>Status</Header>



                            <Form reply>
                                <Form.TextArea value={this.state.status} onChange={this.onStatusChange.bind(this)} />
                                <Button content='Add Status' labelPosition='left' icon='edit' primary onClick={this.addStatus.bind(this)} />
                            </Form>
                        </Comment.Group>
                    </Tab.Pane>

            },
            {
                menuItem: 'Tab 2', render: () =>
                    <form onSubmit={this.onFormSubmit}>
                        <h1>File Upload</h1>
                        <input type="file" onChange={this.onChange} />
                        <button type="submit">Upload</button>
                    </form>
            },
            {
                menuItem: 'Tab 3', render: () =>
                    <div>
                        <input type="text" value={this.state.youtube} onChange={this.onYoutubeChange.bind(this)} ></input>
                        <button onClick={this.addYoutubeVideo.bind(this)}>Add Youtube Video</button>
                    </div>
            }
        ]
    }
    onStatusChange(e) {
        this.setState({
            status: e.target.value
        })
    }
    onYoutubeChange(e) {
        this.setState({
            youtube: e.target.value
        })
    }
    addYoutubeVideo() {
        // alert("Hola");
        let yUrl = this.state.youtube.split("v=")[1];
        alert(yUrl);
        let data = {
            youtube: yUrl,
            id: productId,
            name: this.props.product.info.Item.name
        }
        axios.post(`${BASE_URL}/api/v1/product/youtube`, data, { withCredentials: true })
            .then(() => {
                this.setState({
                    youtube: ""
                });
            })

    }
    addStatus() {
        let data = {
            status: this.state.status,
            id: productId,
            name: this.props.product.info.Item.name
        }
        for (let i = 0; i < this.state.products.length; i++) {
            let dataTemp = {
                status: this.state.status,
                id: this.state.products[i].id,
                name: this.state.products[i].name
            }
            axios.post(`${BASE_URL}/api/v1/product/status`, dataTemp, { withCredentials: true })
                .then(() => {
                    this.setState({
                        status: ""
                    });
                })
        }
        axios.post(`${BASE_URL}/api/v1/product/status`, data, { withCredentials: true })
            .then(() => {
                this.setState({
                    status: ""
                });
            })

    }
    getData(productId) {
        const loggedInUserId = this.props.auth ? this.props.auth.id : 0;

        this.props.getProductInfo(productId);
        // this.props.getProductActivity(productId);
        if (loggedInUserId) {
            this.props.getProductNetworkFeed(loggedInUserId, productId);
        }
        else {
            this.props.getProductFeedUnauthenticated(productId);
        }
        this.props.getProductSupplier(productId);
        this.props.getProductApplication(productId);
        this.props.getProductRawMaterial(productId);
        this.props.getPotentialCustomers(productId);
    }
    renderRightSection() {
        if (this.props.auth) {
            return (
                <RightSection />
            )
        }
    }
    renderLeftSidebar() {
        if (this.props.auth) {
            return (
                <Responsive as={Grid.Column} className="left-content" minWidth={768}>
                    <LeftSidebar />
                </Responsive>
            )
        }
    }
    renderSidebar() {
        if (!this.props.auth) {
            return (
                <RightSidebar />
            )
        } else {
            return (
                <RightSidebarAuth />
            )
        }
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

        productId = this.props.match.params.id;
        localStorage.setItem("product", productId);
        this.getData(productId);
        this.resetComponent();
    }

    reload = () => {this.getData(this.props.match.params.id)}
    renderActivityProducts() {
        return this.state.products.map((item, index) => {
            return (
                <Label key={index} content={item.name} />
            )
        })
    }
    componentWillReceiveProps(nextProps) {

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

            localStorage.setItem("product", nextProps.match.params.id);
            this.getData(nextProps.match.params.id);
            productId = nextProps.match.params.id;
        }
    }
    componentDidUpdate() {
        this.refs.product_info_heading.scrollIntoView({ "block": "end", "behavior": "smooth" });
    }
    scrollToTables(id) {
        this.refs[id].scrollIntoView({ "block": "center", "behavior": "smooth" });
    }
    scrollToBottom = () => {
        const { messageList } = this.refs;
        ReactDOM.findDOMNode(messageList).scrollTop = 0;
    }
    render() {
        const productName = this.props.product.info ? this.props.product.info.Item.name : '';
        return (
            <Navbar {...this.props}>

                <div id="HEADER" className="primary-background">
                    <Container className="body-background palm-nudge-sides">
                        <Grid padded stackable>
                            <Responsive as={Grid.Column} className="left-content" minWidth={768}>
                                <LeftSidebar />
                            </Responsive>

                            <Grid.Column className='main-content-area'>
                                <div className="main-content pD-b-50">
                                    <div className="main-content_inner">
                                        <span ref="product_info_heading">
                                            {this.props.product.info && <Info info={this.props.product.info} id="product_info_heading" reload={this.reload} />}
                                        </span>
                                        <Stats raw={this.props.product.raw}
                                            application={this.props.product.application}
                                            supplier={this.props.product.supplier}
                                            customer={this.props.product.customer}
                                            info={this.props.product.info}
                                            scrollToTables={this.scrollToTables.bind(this)}
                                        />
                                        {/* <Search
                                        fluid
                                        loading={isLoading}
                                        onResultSelect={this.handleResultSelect}
                                        onSearchChange={this.handleSearchChange}
                                        results={results}
                                        value={value}
                                        resultRenderer={resultRenderer}
                                        />
                                    {this.renderActivityProducts()}
                                    <Tab panes={this.panes()} /> */}

                                        {
                                            this.props.networkFeed.productFeed &&
                                            <Activity productId={productId} productName={productName} activity={this.props.networkFeed.productFeed} history={this.props.history} />
                                        }

                                        <div ref="suppliers">
                                            {this.props.product.supplier && <Supplier auth={this.props.auth} supplier={this.props.product.supplier} info={this.props.product.info} />}
                                        </div>
                                        <div ref="raw_materials">
                                            {this.props.product.raw && <RawMaterial auth={this.props.auth} raw={this.props.product.raw} info={this.props.product.info} getData={this.getData} />}
                                        </div>
                                        <div ref="application">
                                            {this.props.product.application && <Application auth={this.props.auth} application={this.props.product.application} info={this.props.product.info} getData={this.getData} />}
                                        </div>
                                        <div ref="customer">
                                            {this.props.product.customer && <Customer auth={this.props.auth} customer={this.props.product.customer} info={this.props.product.info} />}
                                        </div>
                                    </div>
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

function mapStateToProps({ singleProduct, auth, networkFeed }) {
    return { product: singleProduct, auth, networkFeed };
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch,
        ...bindActionCreators({ ...actions, ...networkFeedActions }, dispatch)
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(ProductHome);
