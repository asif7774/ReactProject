import React, { Component } from 'react';
import * as actions from '../../actions/'
import { connect } from 'react-redux'
import { Grid, Container, Search, Label, Form, Button, Responsive } from 'semantic-ui-react'

import Navbar from '../common/Navbar'
import LeftSidebar from '../common/LeftSidebar'
import RightSection from '../common/RightSection'

import axios from 'axios'
import { BASE_URL } from '../../config/config'
// import Follow from '../activityFeed/Follow';
// import AddStatus from '../activityFeed/AddStatus'

// import Create from '../activityFeed/Create'
// import AddRaw from '../activityFeed/AddRaw'
// import AddApplication from '../activityFeed/AddApplication'

const resultRenderer = (result) => <Label key={result._source.id} content={result._source.name} />




class Profile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            firstName: '',
            lastName: '',
            email: '',
            tempComp: '',
            phone: '',
            companySuggestion: [],
            company: '',
            designation: '',
            desc: ''
        }
    }
    handleSearchChange = (e, { value }) => {
        this.setState({ tempComp: value, isLoading: true })
        axios.get(`${BASE_URL}/api/v1/user/search/company/${value}`, { withCredentials: true })
            .then(response => {
                // console.log(response.data);
                this.setState({
                    isLoading: false,
                    results: response.data.hits.hits
                })
            })

    }
    handleFirstNameChange(e) {
        this.setState({
            firstName: e.target.value
        })
    }
    handleLastNameChange(e) {
        this.setState({
            lastName: e.target.value
        })
    }
    handleEmailChange(e) {
        this.setState({
            email: e.target.value
        })
    }
    handlePhoneChange(e) {
        this.setState({
            phone: e.target.value
        })
    }
    handleDescChange(e) {
        this.setState({
            desc: e.target.value
        })
    }

    handleDesignationChange(e) {
        this.setState({
            designation: e.target.value
        })
    }
    addCompany() {
        // alert("I am here");
        let that = this;
        let data = {
            name: this.state.company
        }
        axios.post(`${BASE_URL}/api/v1/user/add/company`, data, { withCredentials: true })
            .then(res => {
                console.log(res);
                this.setState({
                    company_id: res.data.id
                }, () => {
                    that.saveProfileData();
                })
                // window.location.reload();
            })
            .catch(err => {
                alert("Something went wrong");
            })
    }
    saveProfileData() {
        let {
            firstName,
            lastName,
            email,
            company,
            phone,
            company_id,
            company_updated,
            desc,
            designation
        } = this.state;

        let data = {
            firstName,
            lastName,
            email,
            company_updated,
            company,
            company_id,
            phone,
            desc,
            designation
        }
        if (this.state.value || data.company_id) {
            data.company_updated = 1;
            data.company_id = this.state.value || data.company_id;
        } else {
            data.company_updated = -1;
            data.company_id = ""
        }
        console.log(data);
        axios.post(`${BASE_URL}/api/v1/user/profile`, data, { withCredentials: true })
            .then(res => {
                window.location.reload();
            })
            .catch(err => {
                alert("Something went wrong");
            })
    }
    componentWillMount() {
        axios.get(`${BASE_URL}/api/v1/user/profile/data`, { withCredentials: true })
            .then(res => {
                // console.log(res);

                this.setState({
                    firstName: res.data.Item.firstName,
                    lastName: res.data.Item.lastName,
                    email: res.data.Item.email,
                    phone: res.data.Item.phone,
                    desc: res.data.Item.desc,
                    company: res.data.Item.company,
                    company_id: res.data.Item.company_id,
                    company_updated: res.data.Item.company_updated,
                    designation: res.data.Item.designation
                })
                if (res && res.data && res.data.Item && res.data.Item.company_updated === -1) {
                    axios.get(`${BASE_URL}/api/v1/user/search/company/${res.data.Item.company}`, { withCredentials: true })
                        .then(res => {
                            console.log(res);
                            this.setState({
                                companySuggestion: res.data.hits.hits
                            })

                        })
                        .catch(err => {
                            console.log(err);
                            // alert("Something went wrong");
                        })
                }
            })
            .catch(err => {
                console.log(err);
                // alert("Something went wrong");
            })
    }

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
    handleChange(id, name) {
        console.log(id);
        this.setState({
            value: id,
            company: name
        })
    }
    renderCreateCompanyButton() {
        return (
            <div>
                <div className="empty-message-text">Couldn't Find your company?</div>
                <Button fluid onClick={this.addCompany.bind(this)} color='blue'>Add Company </Button>
            </div>
        )
    }
    handleResultSelect = (e, { result }) => {
        console.log(result);
        this.setState({
            company: result._source.name,
            company_id: result._source.id
        }, () => {
            this.saveProfileData()
        })

    }
    render() {
        const { isLoading, results } = this.state
        // console.log(this.props.user)
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
                                            <Grid.Row className="background-white extra-padding-sides">
                                                <Grid.Column width={16} className="mT-10">
                                                    <Form stackable={'true'} className="custom-input-form">
                                                        <Form.Group widths={2}>
                                                            <Form.Field>
                                                                <Form.Input onChange={this.handleFirstNameChange.bind(this)} value={this.state.firstName} label='FIRST NAME' />
                                                            </Form.Field>
                                                            <Form.Field>
                                                                <Form.Input onChange={this.handleLastNameChange.bind(this)} value={this.state.lastName} label='LAST NAME' />
                                                            </Form.Field>
                                                        </Form.Group>
                                                        <Form.Group widths={2}>
                                                            <Form.Field>
                                                                <Form.Input onChange={this.handleEmailChange.bind(this)} value={this.state.email} label='EMAIL' />
                                                                {/* <Form.Field className="toggle-custom mB-10 mT-15">
                                                                    <span className="toggle-label">Visiblity:</span>
                                                                    <Checkbox toggle />
                                                                </Form.Field> */}
                                                            </Form.Field>
                                                            <Form.Field>
                                                                <Form.Input onChange={this.handlePhoneChange.bind(this)} value={this.state.phone} label='PHONE' />
                                                                {/* <Form.Field className="toggle-custom mB-10 mT-15">
                                                                    <span className="toggle-label">Visiblity:</span>
                                                                    <Checkbox toggle />
                                                                </Form.Field> */}
                                                            </Form.Field>
                                                            
                                                        </Form.Group>
                                                        <Form.Group widths={2}>
                                                            <Form.Field>

                                                                {this.state.company_updated === -1 &&
                                                                    <div>
                                                                        <label>COMPANY</label>
                                                                        <Search
                                                                            fluid
                                                                            loading={isLoading}
                                                                            minCharacters={3}
                                                                            onResultSelect={this.handleResultSelect}
                                                                            onSearchChange={this.handleSearchChange}
                                                                            results={results}
                                                                            value={this.state.tempComp}
                                                                            noResultsMessage={this.renderCreateCompanyButton()}
                                                                            resultRenderer={resultRenderer}
                                                                            className="profile-company-search"
                                                                        />
                                                                    </div>
                                                                }
                                                                {
                                                                    this.state.company_updated === 1 &&
                                                                    <Form.Input readOnly value={this.state.company} label='Company' />
                                                                }
                                                                {/* <Form.Field className="toggle-custom mB-10 mT-15">
                                                                    <span className="toggle-label">Visiblity:</span>
                                                                    <Checkbox toggle />
                                                                </Form.Field> */}
                                                            </Form.Field>
                                                        </Form.Group>
                                                        <Form.Group widths={2}>
                                                            <Form.Field>
                                                                <Form.Input onChange={this.handleDesignationChange.bind(this)} value={this.state.designation} label='DESIGNATION' />
                                                                {/* <Form.Field className="toggle-custom mB-10 mT-15">
                                                                    <span className="toggle-label">Visiblity:</span>
                                                                    <Checkbox toggle />
                                                                </Form.Field> */}
                                                            </Form.Field>
                                                        </Form.Group>

                                                        <Form.Group widths={1}>
                                                            <Form.Field
                                                                onChange={this.handleDescChange.bind(this)} value={this.state.desc}
                                                                control='textarea'
                                                                label='SOMETHING ABOUT YOU'
                                                                width={16} rows='3' />
                                                        </Form.Group>
                                                        {/* <Form.Field label='YOUR PROFILE PICTURE' />
                                                        <Form.Group widths={1}>
                                                            <div className="sixteen wide field">
                                                                <div className="input-type-file large">
                                                                    <input type='file' className='file-input' placeholder='Something about you...' />
                                                                    <Icon name="cloud upload"/>
                                                                    <p>Drag and drop a file here or click</p>
                                                                </div>
                                                            </div>
                                                        </Form.Group> */}
                                                        {/* <Divider section /> */}
                                                        {/* <Button type='button' size='mini'>Reset</Button> */}
                                                        <Button type='button' onClick={this.saveProfileData.bind(this)} floated='right' size='mini' color='blue'>Save</Button>
                                                    </Form>
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

export default connect(mapStateToProps, actions)(Profile);
