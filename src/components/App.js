import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom'
import { connect } from 'react-redux'
import * as actions from '../actions/auth/auth'
import AllProducts from './product/AllProducts'
import AddCompany from './AddCompany'
import AddProduct from './product/AddProduct'
// import ProductHome from './product/ProductHome'
import ProductHomeNew from './product/ProductHomeNew'
import ProductActivity from './product/ProductActivity'
import MyProducts from './myproducts/MyProducts'
import Company from './company/Company'
import Landing from './landing/Landing'
import Feed from './networkFeed/NetworkFeedLayout'
import Profile from './profile/Profile'
import Message from './message/Message'
import ProfileFeed from './profileFeed/profileFeed'
import profileFeedStatic from './profileFeed/profileFeedStatic'
import About from './about/About'
import Faq from './faq/Faq'
import NetworkFeedLayout from './networkFeed/NetworkFeedLayout'
import Contact from './contact/Contact'
import Hidden from './hidden/Hidden'
import onBoarding from './onBoarding/onBoarding'
import Notifications from './notifications/Notifications'
import EmailVerificationMessage from './common/EmailVerificationMessage'
// import UserInfo from './onBoarding/UserInfo'

class App extends Component {

  componentDidMount(){
    this.props.fetchUser();
  }

  render() {
    return (
        <BrowserRouter onUpdate={() => window.scrollTo(100, 100)}>
          <div className="main-wrapper">
            <Route exact path="/" component={Landing} />
            <Route exact path="/feed" component={Feed} />
            <Route exact path="/contact" component={Contact} />
            <Route exact path="/hidden" component={Hidden} />
            <Route exact path="/company" component={Company} />
            <Route exact path="/profile" component={Profile} />
            <Route exact path="/message" component={Message} />
            <Route exact path="/aboutus" component={About} />
            <Route exact path="/faq" component={Faq} />
            <Route exact path="/onBoarding" component={onBoarding} />
            <Route exact path="/profileFeed/:id" component={ProfileFeed} />
            <Route exact path="/profileFeedStatic/" component={profileFeedStatic} />            
            <Route path="/networkFeed/:feedType/:entityId?/:postId?" component={NetworkFeedLayout} /> 
            <Route exact path="/product/:id" component={ProductHomeNew} />
            <Route exact path="/product/:id/activity" component={ProductActivity} />
            <Route exact path="/myproduct" component={MyProducts} />
            <Route exact path="/company/:id" component={Company} />
            {/* <Route exact path="/producttemp/:id" component={ProductHomeNew} /> */}
            <Route exact path="/products" component={AllProducts} />
            <Route exact path="/addCompany" component={AddCompany} />
            <Route exact path="/update/product/:id " component={AddCompany} />
            <Route exact path="/add/product" component={AddProduct} />
            <Route exact path="/notifications" component={Notifications} />
            <Route exact path="/signup/verificationMessage" component={EmailVerificationMessage} />
            
          </div>
        </BrowserRouter>
    );
  }
}

export default connect(null,actions)(App);
