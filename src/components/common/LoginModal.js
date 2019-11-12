import React, { Component } from 'react'
import { Grid, Image, Modal, TransitionablePortal } from 'semantic-ui-react'
import * as actions from '../../actions/'
import { connect } from 'react-redux'
import { BASE_URL } from '../../config/config'
import linkedin from '../landing/linkedin.png'
import mappes from '../landing/mappes.png'


class LoginModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalOpen: false
        }
    }
    componentWillReceiveProps(nextProps) {
        // console.log(nextProps);
        // console.log(this.props.auth);
        if (nextProps &&
            nextProps.singleCompany &&
            nextProps.singleCompany.showLoginModal &&
            nextProps.singleCompany.showLoginModal !== this.state.modalOpen) {
            if (!nextProps.auth) {
                this.setState({
                    modalOpen: true
                })
            }
        }
    }
    // handleOpen = () => this.setState({ modalOpen: true })

    // handleClose = () => this.setState({ modalOpen: false })

    // componentWillMount(){
    //     this.setState({
    //         modalOpen : this.props.show
    //     })
    // }

    render() {
        // console.log(this.props);
        return (
            <TransitionablePortal
                closeOnTriggerClick
                open={this.state.modalOpen}
                onClose={this.handleClose}
                openOnTriggerClick                
                animation={'slide down'}
                duration={1000}
              >
                <Modal
                    dimmer={false}
                    open={this.state.modalOpen}
                    onClose={this.handleClose}
                    size='large'
                    className='sign-in-reminder'
                >
                    {/* <Header icon='sign in alternate' content='Log in to access the content' /> */}
                    <Modal.Content>
                        <Grid>
                            <Grid.Column width={16} textAlign='center'>
                                <Image centered src={mappes} size='small' />
                                <div className="signin-text">Signup to the fastest growing product centric platform of the world</div>
                                <a className="ui primary button" href={`${BASE_URL}/auth/linkedin`}>Signup</a>
                                <Image centered src={linkedin} className="linkedin-img-small" size='small' />
                            </Grid.Column>
                        </Grid>
                    </Modal.Content>

                </Modal>
            </TransitionablePortal>
        )
    }
}

function mapStateToProps({ singleCompany, auth }) {
    return { singleCompany, auth };
}
export default connect(mapStateToProps, actions)(LoginModal);
