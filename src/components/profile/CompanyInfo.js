import React, { Component } from 'react';
import * as actions from '../../actions/';
import { connect } from 'react-redux';
import { Grid, Form, Button, Divider, Select, Search, Label } from 'semantic-ui-react';

import axios from 'axios';
// import placeholderImg from './placeholder.png';
import { BASE_URL } from '../../config/config';

const resultRenderer = (result) => <Label key={result._source.id} content={result._source.name} />

const options = [
    { key: '1', text: 'Manufacturer', value: 'manufacturer' },
    { key: '2', text: 'Distributor', value: 'distributor' },
    { key: '3', text: 'Publishing House', value: 'publishingHouse' },
    { key: '4', text: 'Exhibition Organiser', value: 'exhibitionOrganiser' },
    { key: '5', text: 'Sales Agent', value: 'salesAgent' },
]


class CompanyInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imagePreviewUrl: '',
            profilePic: '',
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            desc: '',
            tempComp: '',
            company: '',
            company_id: '',
            company_updated: '',
            designation: '',
            isLoading: false,
            website: '',
            country: '',
            address: "",
            description: ""

        }
        this.getCompanyData = this.getCompanyData.bind(this);
    }

    componentDidMount() {
        axios.get(`${BASE_URL}/api/v1/user/profile/data`, { withCredentials: true })
            .then(res => {

                this.setState({
                    firstName: res.data.Item.firstName,
                    lastName: res.data.Item.lastName,
                    email: res.data.Item.email,
                    phone: res.data.Item.phone,
                    desc: res.data.Item.desc,
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
                        });
                } else {
                    axios.get(`${BASE_URL}/api/v1/company/${res.data.Item.company_id}`, { withCredentials: true })
                        .then(res => {
                            if (res && res.data && res.data.Item) {
                                const { 
                                    address,
                                    country,
                                    description,
                                    id,
                                    name,
                                    url
                                } = res.data.Item;

                                this.setState({
                                    company: name,
                                    company_id: id,
                                    website: url,
                                    country,
                                    address,
                                    description
                                });
                            }
                        })
                        .catch(err => {
                            console.log(err);
                        });
                }
            })
            .catch(err => {
                console.log(err);
            })
    }

    handleResultSelect = (e, { result }) => {
        console.log(result);
        this.setState({
            company: result._source.name,
            company_id: result._source.id
        }, () => {
            // this.saveProfileData()
            this.getCompanyData();
        })

    }
    getCompanyData() {
        axios.get(`${BASE_URL}/api/v1/company/${this.state.company_id}`, { withCredentials: true })
            .then(({ data }) => {
                this.setState({
                    website: data.Item.url,
                    country: data.Item.country,
                    address: data.Item.address,
                    description: data.Item.description
                })
                console.log(data);
            }).catch(err => {
                console.log(err);
            })
    }
    addCompany() {
        // alert("I am here");
        let that = this;
        let data = {
            name: this.state.company,
            address: this.state.address,
            country: this.state.country,
            description: this.state.description,
        }
        if (this.state.company_id) {
            this.saveProfileData();
        } else {
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
    } website

    handleSearchChange = (e, { value }) => {
        this.setState({ company: value, isLoading: true })
        axios.get(`${BASE_URL}/api/v1/user/search/company/${value}`, { withCredentials: true })
            .then(response => {
                // console.log(response.data);
                this.setState({
                    isLoading: false,
                    results: response.data.hits.hits
                })
            })

    }
    handleChange(id, name) {
        console.log(id);
        this.setState({
            value: id,
            company: name
        })
    }
    handleWebsiteChange(e) {
        this.setState({
            website: e.target.value
        })
    }
    handleAddressChange(e) {
        this.setState({
            address: e.target.value
        })
    }
    handleCountryChange(e) {
        this.setState({
            country: e.target.value
        })
    }
    handleDescriptionChange(e) {
        this.setState({
            description: e.target.value
        })
    }
    handleDesignationChange(e) {
        this.setState({
            designation: e.target.value
        })
    }
    // Image Upload
    _handleSubmit(e) {
        e.preventDefault();
        // TODO: do something with -> this.state.file
        console.log('handle uploading-', this.state.file);
    }

    _handleImageChange(e) {
        e.preventDefault();

        let reader = new FileReader();
        let file = e.target.files[0];

        reader.onloadend = () => {
            this.setState({
                file: file,
                imagePreviewUrl: reader.result
            });
        }

        reader.readAsDataURL(file)
    }

    componentWillReceiveProps(nextProps) {

        if (!this.props.auth && nextProps && nextProps.auth) {
            this.getUserPicture(nextProps.auth);
        }
    }
    getUserPicture(user) {
        if (user) {
            let id = user.id
            axios.get(`${BASE_URL}/api/v1/user/${id}`, { withCredentials: true })
                .then(response => {
                    this.setState({
                        profilePic: response.data.Item.image
                    })
                }).catch(err => {
                    console.log(err);
                })
        }
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
            designation,
            website,
            country,
            address,
            description
        } = this.state;

        let {
            changeTab
        } = this.props;

        let data = {
            firstName,
            lastName,
            email,
            company_updated,
            company,
            company_id,
            phone,
            desc,
            designation,
            website,
            country,
            address,
            description,            
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
                // window.location.reload();
                changeTab();
            })
            .catch(err => {
                console.log(err);
                alert("Something went wrong");
            })
    }
    render() {
        // let {imagePreviewUrl} = this.state;
        // let $imagePreview = null;
        // if (imagePreviewUrl) {
        //     $imagePreview = (<img src={imagePreviewUrl} alt="User" />);
        // } else {
        //     $imagePreview = (
        //         (this.state.profilePic !== "")?
        //         <img src={this.state.profilePic} alt="User" />:
        //         <img src={placeholderImg} alt="User" />
        //     );
        // }
        return (

            <Grid centered padded>
                <Grid.Row className="background-white extra-padding-sides">
                    <Grid.Column width={12} className="mT-10">
                        <h4 align="center" className="page-head-h4">COMPANY DETAILS </h4>
                        {/* <div className="userImgUpload">
                            <div className="previewComponent">
                                <div className="imgPreview">
                                    {$imagePreview}
                                </div>
                                <form onSubmit={(e)=>this._handleSubmit(e)}>
                                    <div className="fileInputBtnWrapper">
                                        <div className="fileInputBtn">
                                            <input className="fileInput" 
                                            type="file" 
                                            onChange={(e)=>this._handleImageChange(e)} />
                                            <span className="icon-camera"></span>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div> */}
                    </Grid.Column>
                    <Grid.Column width={12} className="mT-10">
                        <Form stackable={'true'} className="custom-input-form">
                            <Form.Group widths={2}>
                                <Form.Field>
                                    <div>
                                        <label>COMPANY</label>
                                        <Search
                                            fluid
                                            loading={this.state.isLoading}
                                            minCharacters={3}
                                            onResultSelect={this.handleResultSelect}
                                            onSearchChange={this.handleSearchChange}
                                            results={this.state.results}
                                            value={this.state.company}
                                            // noResultsMessage={this.renderCreateCompanyButton()}
                                            resultRenderer={resultRenderer}
                                            className="profile-company-search"
                                        />
                                    </div>
                                </Form.Field>
                                <Form.Field>
                                    <Form.Input onChange={this.handleWebsiteChange.bind(this)} value={this.state.website} label='WEBSITE' />
                                </Form.Field>
                            </Form.Group>
                            <Form.Group widths={2}>
                                <Form.Field>
                                    <Form.Input onChange={this.handleAddressChange.bind(this)} value={this.state.address} placeholder='Address' label='ADDRESS' />
                                </Form.Field>
                                <Form.Field>
                                    <Form.Input onChange={this.handleCountryChange.bind(this)} value={this.state.country} placeholder='Country' label='COMPANY LOCATION' />
                                </Form.Field>
                            </Form.Group>
                            <Form.Group widths={2}>
                                <Form.Field>
                                    <Form.Input onChange={this.handleDesignationChange.bind(this)} value={this.state.designation} placeholder='Your Profile' label='DESIGNATION' />
                                </Form.Field>
                                <Form.Field>
                                    <Form.Field control={Select} label='COMPANY TYPE' options={options} placeholder='Company Type' />
                                </Form.Field>
                            </Form.Group>
                            <Form.Group widths={1}>
                                <Form.Field
                                    onChange={this.handleDescriptionChange.bind(this)} value={this.state.description}
                                    placeholder='Something about your company'
                                    control='textarea'
                                    label='ABOUT YOUR COMPANY'
                                    width={16} rows='3' />
                            </Form.Group>

                        </Form>
                    </Grid.Column>
                    <Grid.Column width={16}>
                        <Divider className="mT-20 mB-20 section" />
                        <Button type='button' onClick={e => this.props.goBack()} floated='left' size='mini'>Back</Button>
                        <Button type='button' onClick={this.addCompany.bind(this)} floated='right' size='mini' color='blue'>NEXT</Button>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }
}

function mapStateToProps({ auth, user }) {
    return { auth, user };
}

export default connect(mapStateToProps, actions)(CompanyInfo);
