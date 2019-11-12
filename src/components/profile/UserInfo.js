import React, { Component } from 'react';
import * as actions from '../../actions/';
import { connect } from 'react-redux';
import { Grid, Form, Button, Divider, Popup, Header, Message} from 'semantic-ui-react';

import axios from 'axios';
import placeholderImg from './placeholder.png';
import { BASE_URL } from '../../config/config';



class UserInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: '',
            lastName: '',
            primaryEmail: '',
            secondaryEmail: '',
            preferredEmail: 1,
            tempComp: '',
            phone: '',
            companySuggestion: [],
            company: '',
            designation: '',
            desc: '',
            file: '',
            imagePreviewUrl: '',
            profilePic : '',
            loading: true,
            companyDetails: {}
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
            primaryEmail: e.target.value
        })
    }
    handleSecondaryEmailChange(e) {
        this.setState({
            secondaryEmail: e.target.value
        })
    }
    handlePhoneChange(e) {
        this.setState({
            phone: e.target.value
        })
    }
    handlePreferredEmailChange = (e, { value }) => {
        this.setState({
            preferredEmail: value
        });
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

    registerUser(user) {
        let that = this;
        if(this.state.password !== this.state.confirmPassword){
            this.showMessage("Comfirm password and password do not match", false);
            return;
        }
        this.setState({loading: true});
        user.password = this.state.password;
        user.displayName = user.firstName ? user.firstName + " " + user.lastName : null;
        axios.post(`${BASE_URL}/registration`, user, { withCredentials: false })
            .then(res => {
                // window.location.reload();
                that.setState({loading: false})
                that.showMessage("Registered successfully, please check your email for verification link.", true)
            })
            .catch(err => {
                console.log(err);
                that.setState({loading: false})
                if(err.response && err.response.data && err.response.data.error){
                    that.showMessage(err.response.data.error, false);
                }
            });
    }

    resendVerificationLink = email => {
        axios.post(`${BASE_URL}/registration/resend`, { email }, { withCredentials: false })
            .then(res => {
                // window.location.reload();
                this.showMessage("Verification link resent.", true)
            })
            .catch(err => {
                console.log(err);
                this.setState({loading: false})
                if(err.response && err.response.data && err.response.data.error){
                    this.showMessage(err.response.data.error, false);
                }
            });
    }

    showMessage(message, success) {
        this.setState({message: message, showMessage: true, success: success});
    }

    saveProfileData() {
        let that = this;

        let {
            firstName,
            lastName,
            primaryEmail,
            secondaryEmail,
            preferredEmail,
            company,
            phone,
            company_id,
            company_updated,
            desc,
            designation,
            companyDetails = {}
        } = this.state;
 
        let {
            url,
            country,
            address,
            description
        } = companyDetails;

        let {
            changeTab
        } = this.props;

        let data = {
            firstName,
            lastName,
            email: primaryEmail,
            secondaryEmail: !(secondaryEmail) || (secondaryEmail && secondaryEmail.length < 1) ? undefined : secondaryEmail,
            preferredEmail: preferredEmail === 1 ? primaryEmail : secondaryEmail,
            company_updated,
            company,
            company_id,
            phone,
            desc,
            designation,
            website: url,
            country,
            address,
            description
        }
        if (this.state.value || data.company_id) {
            data.company_updated = 1;
            data.company_id = this.state.value || data.company_id;
        } else {
            data.company_updated = -1;
            data.company_id = "";
        }
        console.log(data);
        if(!this.props.auth){
            this.registerUser(data);
            return;
        }

        if(this.state.password !== this.state.confirmPassword){
            this.showMessage("Comfirm password and password do not match", false);
            return;
        }

        data.password = this.state.password;

        axios.post(`${BASE_URL}/api/v1/user/profile`, data, { withCredentials: true })
            .then(res => {
                // window.location.reload();
                changeTab();
            })
            .catch(err => {
                console.log(err);
                if(err.response && err.response.data && err.response.data.error) {
                    that.showMessage(err.response.data.error, false);
                }
            });
    }
    componentDidMount() {
        let newState = {};

        axios.get(`${BASE_URL}/api/v1/user/profile/data`, { withCredentials: true })
            .then(res => {
                newState = {
                    ...newState,
                    firstName: res.data.Item.firstName,
                    lastName: res.data.Item.lastName,
                    primaryEmail: res.data.Item.email,
                    phone: res.data.Item.phone,
                    desc: res.data.Item.desc,
                    company: res.data.Item.company,
                    company_id: res.data.Item.company_id,
                    company_updated: res.data.Item.company_updated,
                    designation: res.data.Item.designation
                };

                this.setState(newState);


                return Promise.all([
                    axios.get(`${BASE_URL}/api/v1/user/${res.data.Item.user_id}`, { withCredentials: true }),
                    axios.get(`${BASE_URL}/api/v1/user/emails/${newState.primaryEmail}`, { withCredentials: true }),
                    axios.get(`${BASE_URL}/api/v1/company/${res.data.Item.company_id}`, { withCredentials: true })
                ]);
            })
            .then(res => {
                const [
                    userDetails,
                    primaryEmailDetails,
                    companyDetails
                ] = res;

                newState = {
                    ...newState,
                    secondaryEmail: userDetails.data.Item.secondaryEmail,
                    isPrimaryEmailVerified: primaryEmailDetails.data.Item && primaryEmailDetails.data.Item.verified,
                    preferredEmail: primaryEmailDetails.data.Item.isPrimary ? 1 : 2,
                    companyDetails: companyDetails ? companyDetails.data.Item : {}
                };

                this.setState(newState);

                return axios.get(`${BASE_URL}/api/v1/user/emails/${newState.secondaryEmail}`, { withCredentials: true });
            })
            .then(secondaryEmailDetails => {
                newState = {
                    ...newState,
                    loading: false,
                    secondaryEmailData: secondaryEmailDetails.data.Item,
                    isSecondaryEmailVerified: secondaryEmailDetails.data.Item && secondaryEmailDetails.data.Item.verified
                };

                this.setState(newState);
            })
            .catch(err => {
                console.log(err);
            })

            if (this.props.auth) {
                this.getUserPicture(this.props.auth)
            }
    }
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
        });
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

    componentWillMount() {
        if(!this.props.auth && !this.state.primaryEmail && this.props.email){
            this.setState({primaryEmail: this.props.email})
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

    handleDismiss = () => {
        this.setState({showMessage: false, errorMessage: ''})
    }

    render() {
        let {imagePreviewUrl} = this.state;
        let $imagePreview = null;
        if (imagePreviewUrl) {
            $imagePreview = (<img src={imagePreviewUrl} alt="User" />);
        } else {
            $imagePreview = (
                (this.state.profilePic !== "")?
                <img src={this.state.profilePic} alt="User" />:
                <img src={placeholderImg} alt="User" />
            );
        }
        return (

            <Grid centered padded>
                <Grid.Row className="background-white extra-padding-sides">
                    <Grid.Column width={12}  className="mT-10">
                        <h4 align="center" className="page-head-h4"> PERSONAL INFORMATION</h4>
                        <div className="userImgUpload">
                            <div className="previewComponent">
                                <div className="imgPreview">
                                    {$imagePreview}
                                </div>
                                {/* <form onSubmit={(e)=>this._handleSubmit(e)}>
                                    <div className="fileInputBtnWrapper">
                                        <div className="fileInputBtn">
                                            <input className="fileInput"
                                            type="file"
                                            onChange={(e)=>this._handleImageChange(e)} />
                                            <span className="icon-camera"></span>
                                        </div>
                                    </div>
                                </form> */}
                            </div>
                        </div>
                    </Grid.Column>
                    <Grid.Column width={13}  className="mT-10">
                        <Form stackable={'true'} className="custom-input-form field-brack-md" loading={this.state.loading}>
                            <Form.Group widths={2}>
                                <Form.Field>
                                    <Form.Input onChange={this.handleFirstNameChange.bind(this)} value={this.state.firstName} label='FIRST NAME' />
                                </Form.Field>
                                <Form.Field>
                                    <Form.Input onChange={this.handleLastNameChange.bind(this)} value={this.state.lastName} label='LAST NAME' />
                                </Form.Field>
                            </Form.Group>
                            <Form.Group widths={2}>
                                <Form.Field className="validation-input">
                                    <Form.Input readOnly onChange={this.handleEmailChange.bind(this)} value={this.state.primaryEmail} label='EMAIL 1' />
                                    {/* verified popup*/}
                                    {
                                        this.state.isPrimaryEmailVerified && 
                                        <Popup
                                            trigger={<i className="icon-check-mark valid"></i>}
                                            position='top center'
                                        >
                                            <div className="d-flex valign-middle">
                                                <i className="icon-check-mark color-light-green mR-5"></i>
                                                <span>Verified Email Address</span>
                                            </div>
                                        </Popup>
                                    }

                                    {/* nonverified popup */}
                                    {
                                        !this.state.isPrimaryEmailVerified &&
                                        <Popup
                                            trigger={<i className="icon-info nonvalid"></i>}
                                            flowing
                                            hoverable
                                            position='top center'
                                        >
                                            <Grid centered divided columns={1}>
                                                <Grid.Column textAlign='center'>
                                                    <Header as='h4'>Email verification needed</Header>
                                                    <Button
                                                        type='button'
                                                        floated='left'
                                                        size='mini'
                                                        color="blue"
                                                        onClick={() => this.resendVerificationLink(this.state.secondaryEmail)}
                                                    >
                                                        Send verification link
                                                    </Button>
                                                </Grid.Column>
                                            </Grid>
                                        </Popup>
                                    }
                                </Form.Field>
                                
                                <Form.Field className="validation-input">
                                    <Form.Input onChange={this.handleSecondaryEmailChange.bind(this)} value={this.state.secondaryEmail} label='EMAIL 2' />
                                    {/* verified popup*/}
                                    {
                                        this.state.isSecondaryEmailVerified && 
                                        <Popup
                                            trigger={<i className="icon-check-mark valid"></i>}
                                            position='top center'
                                        >
                                            <div className="d-flex valign-middle">
                                                <i className="icon-check-mark color-light-green mR-5"></i>
                                                <span>Verified Email Address</span>
                                            </div>
                                        </Popup>
                                    }

                                    {/* nonverified popup */}
                                    {
                                        this.state.secondaryEmailData && !this.state.isSecondaryEmailVerified &&
                                        <Popup
                                            trigger={<i className="icon-info nonvalid"></i>}
                                            flowing
                                            hoverable
                                            position='top center'
                                        >
                                            <Grid centered divided columns={1}>
                                                <Grid.Column textAlign='center'>
                                                    <Header as='h4'>Email verification needed</Header>
                                                    <Button
                                                        type='button'
                                                        floated='left'
                                                        size='mini'
                                                        color="blue"
                                                        onClick={() => this.resendVerificationLink(this.state.secondaryEmail)}
                                                    >
                                                        Send verification link
                                                    </Button>
                                                </Grid.Column>
                                            </Grid>
                                        </Popup>
                                    }
                                </Form.Field>
                            </Form.Group>
                            <Form.Group widths={2}>
                                <Form.Field>
                                    <Form.Input onChange={this.handlePhoneChange.bind(this)} value={this.state.phone} label='PHONE' />
                                </Form.Field>
                                <Form.Field>
                                    <label>CHOOSE PREFERENCE MAIL</label>
                                    <Form.Group>
                                        <Form.Radio
                                            value={1}
                                            checked={this.state.preferredEmail === 1}
                                            onChange={this.handlePreferredEmailChange}
                                            label='Email 1'
                                            className="mB-0 mT-10"
                                        />
                                        <Form.Radio
                                            value={2}
                                            checked={this.state.preferredEmail === 2}
                                            onChange={this.handlePreferredEmailChange}
                                            label='Email 2'
                                            className="mB-0 mT-10"
                                        />
                                    </Form.Group>
                                </Form.Field>
                            </Form.Group>
                            <Form.Group widths={2}>
                                <Form.Field>
                                    <Form.Input type="password" label='PASSWORD'
                                        onChange={(e, {value}) => this.setState({password: value})}/>
                                </Form.Field>
                                <Form.Field>
                                    <Form.Input type='password' label='CONFIRM PASSWORD'
                                        onChange={(e, {value}) => this.setState({confirmPassword: value})} />
                                </Form.Field>
                            </Form.Group>

                            {/* <Form.Group widths={1}>
                                <Form.Field
                                    onChange={this.handleDescChange.bind(this)} value={this.state.desc}
                                    control='textarea'
                                    label='SOMETHING ABOUT YOU'
                                    width={16} rows='3' />
                            </Form.Group> */}

                        </Form>
                    </Grid.Column>
                    <Grid.Column width={16}>
                        <Divider className="mT-20 mB-20 section" />
                        <Button type='button' onClick={this.saveProfileData.bind(this)} floated='right' size='mini' color='blue'>{this.props.auth ? 'NEXT' : 'REGISTER'}</Button>
                        {this.state.showMessage && <Message onDismiss={this.handleDismiss} content={this.state.message} style={{zIndex: 2000, position: 'relative', bottom: 10}} error={!this.state.success} success={this.state.success}/>}
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }
}

function mapStateToProps({ auth, user }) {
    return { auth, user };
}

export default connect(mapStateToProps, actions)(UserInfo);
