import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import { Image, Button, Input, Modal, Message, Icon } from 'semantic-ui-react'
import qs from 'querystring'
import '../landing/landing.css'
import { BASE_URL } from '../../config/config'
import * as actions from '../../actions/'
import { connect } from 'react-redux'
import mappesWhite from '../common/mappesLogo-white.svg'
import axios from 'axios'

class LoginBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loginModalOpen: false,
            signInVisible: true,
            closeOnDimmerClick: true,
            showMessage: false
        }
    }
    componentWillMount() {
        let sessionStart = sessionStorage.getItem("sessionStart");
        if (!sessionStart) {
            sessionStorage.setItem("sessionStart", new Date().getTime());
        } else {
            if (new Date().getTime() - sessionStart > 30000) {
                // this.props.showLoginModal();
                this.setState({ loginModalOpen: true, closeOnDimmerClick: false, signInVisible: false });
            }
        }
        const query = qs.parse(this.props.location.search.slice(1))
        console.log("query string", this.props.location.search, query)
        if (query && query.loginerror) {
            this.setState({ loginerror: query.loginerror })
        }
        if (query && query.login) {
            this.setState({ loginModalOpen: true, signInVisible: query.signup ? false : true })
            if (this.props.loginModelOpenCallback) {
                this.props.loginModelOpenCallback();
            }
        }
    }

    handleLoginModalOpen = () => this.setState({ loginModalOpen: true })
    handleLoginModalClose = () => this.setState({ loginModalOpen: false })

    handleSignInOption = () => this.setState({ signInVisible: true, loginModalOpen: true })
    handleSignUpOption = () => this.setState({ signInVisible: false, loginModalOpen: true })

    //startOnboarding = history => history.push({ pathname: '/onBoarding', state: { email: this.state.email } })
    startOnboarding = () => {
        if (!this.state.email) {
            this.setState({ message: "Please enter your work email", showMessage: true, success: false })
            return;
        }
        this.setState({loading:true});

        axios.post(`${BASE_URL}/registration/email`, { email: this.state.email }, { withCredentials: false })
            .then(res => {
                // window.location.reload();
                this.setState({
                    loading: false, showMessage: true, success: true,
                    message: "Please click on the link that has just been sent to your email account to verify your email and continue the registration process."
                })
            })
            .catch(err => {
                console.log(err);
                this.setState({ loading: false })
                if (err.response && err.response.data && err.response.data.error) {
                    this.setState({ message: err.response.data.error, showMessage: true, success: false });
                }
            });
    }

    handleEmailChange = (e, { value }) => this.setState({ email: value })

    handleDismiss = () => this.setState({ showMessage: false, errorMessage: '' })

    renderMessage = () => {
        if(this.state.success){
            this.props.history.push('/signup/verificationMessage');
            return;
        }
        return <Message onDismiss={this.handleDismiss}
            style={{ zIndex: 2000, position: 'relative', bottom: 10 }}
            error={!this.state.success}
            content={this.state.message}
            header={"Error"}/>
    }

    render() {
        const { signInVisible } = this.state
        return (
            <React.Fragment>
                {this.props.auth == false && <div className="loginBar">
                    <div className="login-strip">
                        <Button className="linkedinBtn" as="a" href={`${BASE_URL}/auth/linkedin`}>
                            <span className="icon-linkedin-alt"></span><span>Signup with Linkedin</span>
                        </Button>
                        <span className="or">Or</span>
                        <Input placeholder='Enter work email address' className="dark-input sinupInput" onChange={this.handleEmailChange} />
                        <Button primary className="signinBtn" onClick={this.startOnboarding}>
                            <span>Sign Up</span>
                        </Button>
                    </div>
                    <div className="login-alt-option">
                        already a member? <a onClick={this.handleLoginModalOpen}>Log In</a>
                    </div>
                    {this.state.showMessage && this.renderMessage()}
                </div>}

                {this.props.auth == false && <Modal open={this.state.loginModalOpen}
                    onClose={this.handleLoginModalClose}
                    closeOnDimmerClick={this.state.closeOnDimmerClick}
                    className="login-modal"
                    basic
                    size='small'>
                    {signInVisible &&
                        <form className="login-box" action={BASE_URL + '/auth/login'} method="post">
                            <Image style={{ width: 170 }} centered src={mappesWhite} />

                            <span className="or">LOG IN</span>
                            {this.state.loginerror && <span className="error mB-20">{this.state.loginerror}</span>}
                            <div className="mB-20">
                                <Input type="text" name="username" placeholder='Email' className="dark-input sinupInput" onChange={e => { this.setState({ loginUsername: e.target.value }) }} />
                            </div>
                            <div className="mB-10">
                                <Input type="password" name="password" placeholder='Password' className="dark-input sinupInput" onChange={e => { this.setState({ loginPassword: e.target.value }) }} />
                            </div>
                            <a className="color-white mB-20 forgot" ><small>Forgot Password</small></a>
                            <div >
                                <Button primary className="signinBtn M0auto" value="submit" type="submit">
                                    <span>Log In</span>
                                </Button>
                            </div>

                            <div className="signup-alt-option mT-40">
                                <Button className="linkedinBtn mR-20" as={'a'} href={`${BASE_URL}/auth/linkedin`}>
                                    <span className="icon-linkedin-alt"></span><span>Login with Linkedin</span>
                                </Button>
                                <span >Don't have an account? <a className="color-white" onClick={this.handleSignUpOption}><b>Sign Up</b></a></span>
                            </div>

                        </form>
                    }
                    {!signInVisible &&
                        <div className="login-box">
                            <Image style={{ width: 170 }} centered src={mappesWhite} />

                            <span className="or">Join for free</span>
                            <div>
                                <Input placeholder='Enter work email address' className="dark-input sinupInput" onChange={this.handleEmailChange} />
                                <span className="mT20"></span>
                                <Button primary className="signinBtn" onClick={this.startOnboarding} loading={this.state.loading}>
                                    <span>Sign Up</span>
                                </Button>
                            </div>
                            <span className="or">Or</span>
                            <Button className="linkedinBtn" as={'a'} href={`${BASE_URL}/auth/linkedin`}>
                                <span className="icon-linkedin-alt"></span><span>Signup with Linkedin</span>
                            </Button>
                            <div className="login-alt-option">
                                already a member? <a className="color-white" onClick={this.handleSignInOption}><b>Log In</b></a>
                            </div>

                            {this.state.showMessage && this.renderMessage()}

                        </div>
                    }
                </Modal>}
            </React.Fragment>
        )
    }
}

function mapStateToProps({ auth, user }) {
    return { auth, user };
}

export default connect(mapStateToProps, actions)(LoginBar);
