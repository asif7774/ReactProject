import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import { Container, Label, Search, Header, Grid, Image, Statistic, Dropdown, Button, Input, Modal, Responsive } from 'semantic-ui-react'
import Navbar from '../common/Navbar'
import qs from 'querystring'
// import mappes from './mappes.png'
import mappes from './mappesLogo.svg'
import circle1 from './circle1.png'
import circle2 from './circle2.png'
import circle3 from './circle3.png'
import circle4 from './circle4.png'
import circle5 from './circle5.png'
import circle6 from './circle6.png'
import circle1_1 from './circle1-1.png'
import circle1_2 from './circle1-2.png'
import circle1_3 from './circle1-3.png'
import circle1_4 from './circle1-4.png'
import circle1_5 from './circle1-5.png'
import circle1_6 from './circle1-6.png'
import circle1_7 from './circle1-7.png'
import circle1_8 from './circle1-8.png'
import mappesWhite from '../common/mappesLogo-white.svg'
//import linkedin from './linkedin.png'
import './landing.css'
// import Parser from 'html-react-parser';
import axios from 'axios'
// import {Link} from 'react-router-dom';
import { BASE_URL } from '../../config/config'
import LoginModal from '../common/LoginModal'
import Footer from '../common/Footer'
import * as actions from '../../actions/'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import LoginBar from '../common/LoginBar';
const resultRenderer = (result) => {
    console.log(result);
    // if (result && result._source && result._source.id)
        // return <Label key={result._source.id} content={Parser(result.highlight.name[0])} />
        if (result && result._source && result._source.id)
        return (
            <div key={result._source.id}>

                {result._index === 'products' && <Label content={result._source.name} />}
                {result._index !== 'products' && <Label content={result._source.name+" ("+result._source.country+")"} />}
                {result._index === 'products' && <Label style={{float:"right"}} content={"Product"} />}
                {result._index !== 'products' && <Label style={{float:"right"}} content={"Company"} />}
            </div>
        )
}

const options = [
    { key: 1, text: 'By Company', value: 1 },
    { key: 2, text: 'By Product', value: 2 },
  ]


class Landing extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalOpen : true,
            active : true,
            loginModalOpen:false,
            signInVisible: true,
            searchCategory: 2
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
                // this.props.showLoginModal();
            }
        }
        this.resetComponent()
        const query=qs.parse(this.props.location.search.slice(1))
        console.log("query string", this.props.location.search, query)
        if(query && query.loginerror){
            this.setState({loginerror: query.loginerror})
        }
        if(query && query.login){
            this.setState({loginModalOpen: true})
        }
        axios.get(`${BASE_URL}/api/v1/log/landing`, { withCredentials: true })
            .then(response => {
                console.log(response.data);

            })
    }

    resetComponent = () => this.setState({ isLoading: false, results: [], value: '' })

    handleResultSelect = (e, { result }) => {
        if (result._index === 'products') {
            this.props.history.push(`/product/${result._source.id}`)
        } else {
            this.props.history.push(`/company/${result._source.id}`)
        }


    }

    handleSearchChange = (e, { value }) => {
        this.setState({ value })
        if (value.length > 2) {
            let searchCategoryUrl = "company"
            this.setState({ isLoading: true })
            if(this.state.searchCategory == 2){
                searchCategoryUrl = "product"
            }
            axios.get(`${BASE_URL}/api/v1/${searchCategoryUrl}/search/${value}`, { withCredentials: true })
                .then(response => {
                    console.log(response.data);
                    this.setState({
                        isLoading: false,
                        results: response.data
                    })
                })
        }

    }

    handleSearchCategoryChange = (e, {value}) => {
        this.setState({searchCategory: value})
        this.handleSearchChange(null, {value: this.state.value})
    }

    handleFiberIndustry = () => this.setState({ active: true, modalOpen: false})
    handleRadTech = () => this.setState({active: false, modalOpen: false})

    handleOpen = () => this.setState({ modalOpen: true })
    handleClose = () => this.setState({ modalOpen: false })

    handleLoginModalOpen = () => this.setState({ loginModalOpen: true })
    handleLoginModalClose = () => this.setState({ loginModalOpen: false, signInVisible: true })

    handleSignInOption = () => this.setState({ signInVisible: true, loginModalOpen: true  })
    handleSignUpOption = () => this.setState({ signInVisible: false, loginModalOpen: true  })

    startOnboarding = history => history.push({pathname: '/onBoarding', state: {email: this.state.email}})
    handleEmailChange = (e, {value}) => this.setState({email: value})

    render() {
        const { isLoading, value, results, active, signInVisible } = this.state
        return (

            <Navbar {...this.props} >
                <LoginModal />
                <Container>
                    <Grid padded centered>
                        <Grid.Column className='landing-content-area' >
                            <Image style={{ width: 240 }} centered src={mappes} />

                            {!active && <span className="radTekText">For RadTech Industry</span>}
                            {active && <span className="radTekText">For Optical Fiber and Cable Industry</span>}

                            <Header textAlign="center" className="landing-header-text">
                                Network and collaborate with industry stakeholders.
                            </Header>
                            <div className="landingSearchBarWrapper">

                                <Search
                                    fluid
                                    placeholder="Search here..."
                                    className="searchWithScroll dark-input landingSearchBar"
                                    loading={isLoading}
                                    onResultSelect={this.handleResultSelect}
                                    onSearchChange={this.handleSearchChange}
                                    results={results}
                                    value={value}
                                    resultRenderer={resultRenderer}
                                />
                                <Dropdown options={options} selection defaultValue={options[1].value}
                                    onChange={this.handleSearchCategoryChange}/>
                            </div>
                            <div className="landing-page-wrap">
                                <div className="landing-page-featured">
                                    <Grid padded textAlign="center" stackable>
                                        <Grid.Row>
                                          <Grid.Column width={16}>
                                            <Statistic size='mini'>
                                              <Statistic.Label className="color-gray">Find customers, suppliers, raw materials, machinery, news</Statistic.Label>
                                              {/* <Statistic.Label className="color-gray">Explore these Products</Statistic.Label>
                                              <Statistic.Value>
                                                <Link to="/product/SkW9l-VnJRsG" className="color-light-blue">Single Mode Optical fiber</Link>, <Link to="/product/HJ9ZV21CjG" className="color-light-blue">Thixotropic Jelly</Link>, <Link to="/product/HJpXxbE2yRjG" className="color-light-blue">UV curing system</Link>
                                              </Statistic.Value> */}
                                            </Statistic>
                                            {active &&
                                                <div className="feature-life-cycle-wrapper">
                                                    <div className="heading">Explore our Optical Fiber Network</div>
                                                </div>
                                            }
                                            {!active &&
                                                <div className="feature-life-cycle-wrapper">
                                                    <div className="heading">Explore our UV/EB RadTech Network</div>
                                                </div>
                                            }


                                          </Grid.Column>
                                        </Grid.Row>
                                    </Grid>

                                </div>
                            </div>
                        </Grid.Column>
                    </Grid>
                    {!active &&
                    <div className="feature-cycle-wrapper">
                        
                        <ul>
                            <li className="clickable">
                                <a href="/product/HyW0GZNn1Aoz">
                                    <span>
                                        <img src={circle1} alt="" /></span>
                                    <span>Photoinitiator</span>
                                </a>
                            </li>
                            <li className="clickable">
                                <a href="/product/BkBfWEhyCoG">
                                    <span><img src={circle4} alt="" /></span>
                                    <span>UV Coating</span>
                                </a>
                            </li>
                            <li className="clickable">
                                <a href="/product/SJwzbEnkCjM">
                                    <span><img src={circle3} alt="" /></span>
                                    <span>UV Ink</span>
                                </a>
                            </li>
                            <li className="clickable">
                                <a href="/product/SkW9l-VnJRsG">
                                    <span><img src={circle6} alt="" /></span>
                                    <span>Optical Fiber</span>
                                </a>
                            </li>
                            <li className="clickable">
                                <a href="/product/HJpXxbE2yRjG">
                                    <span><img src={circle5} alt="" /></span>
                                    <span>UV Curing System</span>
                                </a>
                            </li>
                            <li className="clickable">
                                <a href="/product/SyWmlbV2k0if">
                                    <span><img src={circle2} alt="" /></span>
                                    <span>UV Bulb</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                    }
                    {active &&
                    <div className="feature-cycle-wrapper">
                        
                        <ul>
                            <Responsive as={"li"} className="clickable" minWidth={768}>
                                <a href="/product/HyZ-EnkRjG">
                                    <span><img src={circle1_1} alt="" /></span>
                                    <span>Base Oil</span>
                                </a>
                            </Responsive>
                            <Responsive as={"li"} className="clickable" minWidth={768}>
                                <a href="/product/HJ9ZV21CjG">
                                    <span><img src={circle1_2} alt="" /></span>
                                    <span>Cable Filling Jelly</span>
                                </a>
                            </Responsive>
                            <li className="clickable">
                                <a href="/product/ryTIWNny0iG">
                                    <span><img src={circle1_3} alt="" /></span>
                                    <span>Aramid Yarn</span>
                                </a>
                            </li>
                            <li className="clickable">
                                <a href="/product/HySJGZN2kAif">
                                    <span><img src={circle1_5} alt="" /></span>
                                    <span>BroadBand</span>
                                </a>
                            </li>
                            <li className="clickable">
                                <a href="/product/SkW9l-VnJRsG">
                                    <span><img src={circle1_6} alt="" /></span>
                                    <span>Optical Fiber</span>
                                </a>
                            </li>
                            <li className="clickable">
                                <a href="/product/HyXO-EhJCsM">
                                    <span><img src={circle1_8} alt="" /></span>
                                    <span>Quartz Tube</span>
                                </a>
                            </li>
                            <li className="clickable">
                                <a href="/product/rkfO-N3JAof">
                                    <span><img src={circle1_7} alt="" /></span>
                                    <span>Preform</span>
                                </a>
                            </li>
                            <li className="clickable">
                                <a href="/product/rJEFl-Vn1Ajz">
                                    <span><img src={circle1_4} alt="" /></span>
                                    <span>Optical Fiber Cable</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                    }
                </Container>

                <Modal open={this.state.modalOpen}
                    onClose={this.handleClose}
                    basic={true}
                    closeOnDimmerClick={true}
                    className="landing-option-modal"
                    trigger={<Button onClick={this.handleOpen} className="landing-option-btn" primary><span className="icon-arrow-right"></span></Button>}
                    size='small'>
                    <div className="landing-option">
                        <Button onClick={this.handleRadTech}>RadTech Industry</Button>
                        <Button onClick={this.handleFiberIndustry} primary>Optical Fiber and Cable</Button>
                    </div>
                </Modal>
                <LoginBar className="other-page-login-bar"
                 location={this.props.location}
                  loginModelOpenCallback={() => { this.setState({ modalOpen: false }) }} 
                  history={this.props.history}/>

                <Footer />
            </Navbar>
        )
    }
}

function mapStateToProps({ auth, user }) {
    return { auth, user };
}

export default connect(mapStateToProps, actions)(Landing);
