import React, { Component } from 'react';
import * as actions from '../../actions/'
import { connect } from 'react-redux'
import {  Grid, Container, Image, Responsive, Header} from 'semantic-ui-react'

import './About.css'
import Navbar from '../common/Navbar'
import LeftSidebar from '../common/LeftSidebar'
import RightSection from '../common/RightSection'


class About extends Component {
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
    renderProfileImage() {
        if (this.props.auth && this.props.auth._json && this.props.auth._json.pictureUrls) {
            return (
                <Image className="avatar-40" avatar src={this.props.auth._json.pictureUrls.values[0]} />
            )
        }

    }

    render() {
        console.log(this.props.user)
        return (
            <Navbar>
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
                                                    <Header as='h1' dividing>
                                                        ABOUT MAPPES.IO
                                                    </Header>
                                                    <p><em>Product centric Social network</em></p>
                                                    <Header as='h3' >
                                                        What Is Mappes.io ?
                                                    </Header>
                                                    <p>Mappes.io is the social networking and online platform for industrial products and consumer goods. It’s a community-based platform that buyers and suppliers use to gain knowledge about their products - Discover Suppliers, Customers, Raw Materials and end-applications. User can uncover latest innovations and industry news related to products of their interest.</p>
                                                    <Header as='h3' >
                                                        How is it different from LinkedIn and Facebook?
                                                    </Header>
                                                    <p>Facebook connects people by mapping a relationship between People<br />  LinkedIn connects people by mapping a relationship between professionals <br /> Mappes.io connects people by mapping a relationship between products</p>
                                                    <p>By connecting a raw material to its applications, we are effectively connecting a supplier to its buyer, so, while LinkedIn has been able to create hiring solutions, Mappes.io can create sales and marketing solutions.</p>
                                                    <Header as='h3' >
                                                        How do I build my network on Mappes.io?
                                                    </Header>
                                                    <p>Unlike Linkedin or facebook, you don’t add other people into your network but map your products to its raw materials and applications. Once you do that Mappes.io automatically builds your network for you by bringing your suppliers and customers closer to you. With each added application, you will get access to its potential customer base and with each added raw material or equipment you will get access to its supplier base.</p>
                                                    <Header as='h3' >
                                                        What kinds of solutions does Mappes.io offer?
                                                    </Header>
                                                    <p>Mappes.io delivers Product related solutions.</p>
                                                    <ul>
                                                        <li>Lead Generation: Find new customers worldwide.</li>
                                                        <li>Supplier Discovery: Helps find new suppliers of raw material and machinery.</li>
                                                        <li>Product Discovery: Helps find new products in your field of work.</li>
                                                        <li>Curates product related articles, videos from the member community.</li>
                                                        <li>Curates top news stories, industry updates and blog posts</li>
                                                    </ul>
                                                    <p>Our web platform provides real-time insights that you won’t find anywhere else. That includes millions of searchable products, which includes product graph, latest news and much more.</p>
                                                    <Header as='h3' >
                                                        How do I make the most out of Mappes.io?
                                                    </Header>
                                                    <p>Start by FOLLOWING the products that you make or sell or the products you are interested in. We will auto-populate all the products, companies and information related to that product for you. You’ll get all the latest updates on that product and related products, including new applications, new processes, new suppliers and buyers, press mentions, blog posts, and press releases, so you’ll never miss a thing.</p>
                                                    <Header as='h3' >
                                                        How many people use Mappes.io?
                                                    </Header>
                                                    <p>Mappes.io is powered by an active community of business professionals related to optical fiber industry. We quickly plan to expand to other industries.</p>
                                                    <Header as='h3' >
                                                        How many people use Mappes.io?
                                                    </Header>
                                                    <p>Mappes.io is powered by an active community of business professionals related to optical fiber industry. We quickly plan to expand to other industries.</p>
                                                    <Header as='h3' >
                                                        How does the Mappes.io Community contribute information?
                                                    </Header>
                                                    <p>Most business professionals hold valuable knowledge and important insights about a handful of products —their manufacturing process, suppliers, customers, raw materials, end-application and other product related insights. The members can add articles, presentations, case studies related to the products they manufacture. They can also map the products to its applications and help build the product network.</p>
                                                    <p>Members of the Mappes.io community contributes unique product insights, such as new process knowhow, new raw material or end-use. This feet-on-the-street knowledge provides other Mappes.io members with answers to questions such as “How to make optical fiber” or “Who are the suppliers and/or customers of optical fiber”. That’s the power of Mappes.io!</p>
                                                    <Header as='h3' >
                                                        Who uses Mappes.io?
                                                    </Header>
                                                    <p>Like LinkedIn, Mappes.io is used by business professionals across all job functions and industries. Anyone who wants to gain knowledge related his products, find new customers and suppliers, discover new applications of his products, or find new processes to better its existing manufacturing process, can benefit from Mappes.io.</p>
                                                    <p>Here are just a few examples of Mappes.io in action:</p>
                                                    <ul>
                                                        <li><b>CEOs</b> follow all products in their Product Relationship Graph including customers, prospects, competitors, partners, vendors, and suppliers to have a 360 degree view of their business environment.</li>
                                                        <li><b>CTOs</b> follow all products in their Product Relationship Graph to discover new technologies, new applications for their product.</li>
                                                        <li><b>Sales people</b> use Mappes.io to identify trigger events, discover prospective companies, and ultimately close more deals.</li>
                                                        <li><b>Marketers</b> help their brand gain visibility with Mappes.io.</li>
                                                        <li><b>Procurement</b> people use Mappes.io to find new products and new suppliers.</li>
                                                        <li><b>Recruiters</b> pounce on top talent by discovering professionals with knowledge in a particular product.</li>
                                                        <li><b>Investors</b> drive better returns by tapping into market insights by understanding the potential of products.</li>
                                                        <li><b>Business Development Professionals</b> identify new partnership opportunities by staying abreast of the latest news, and alerts in their industry.</li>
                                                        <li><b>Product Managers</b> share and gain knowledge about the products.</li>
                                                        <li><b>Job Seekers</b> identify companies related to their products, and research potential opportunities.</li>
                                                    </ul>
                                                    <Header as='h3' >
                                                        What types of companies use Mappes.io?
                                                    </Header>
                                                    <p>Mappes.io helps businesses of all shapes and sizes; from small startups with a single office all the way to large, global enterprises.</p>
                                                    <Header as='h3' >
                                                        How accurate is Mappes.io’s information?
                                                    </Header>
                                                    <p>Mappes.io has the most accurate product information on the planet. Mappes.io is updated in real-time from our community of business professionals. Because contributions from in-the-know members are always rolling in, our data is always fresh, and the most accurate on the market.</p>
                                                    <p>Our accuracy improves with each new member and every additional contribution.</p>
                                                    <p>Mappes.io solves the core problem that exists in competitive intelligence: the lag between the creation of information and the timeliness in which it’s needed.</p>
                                                    <Header as='h3' >
                                                        Wow, that sounds great to me. I want to get on Mappes.io NOW! How do I get started?
                                                    </Header>
                                                    <p>We won’t make you wait. You can sign up for Mappes.io right away on <a href="http://www.mappes.io">www.mappes.io</a> with your LinkedIn credentials. Once you do so, you’ll immediately understand the power that Mappes.io has to offer and the value we deliver.</p>
                                                    <Header as='h3' >
                                                        That sounds expensive… how much does it cost?
                                                    </Header>
                                                    <p>Actually, believe it or not, it’s completely free, alteast for now. Yes, really. So, why would we offer such a valuable service at absolutely no cost? Well, our reasoning is two-fold. For one, we want every business professional in the world using Mappes.io. And second, that’s how we gather build our latest data regarding products: from contributions from our community of business professionals.<br /><br /></p>
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

export default connect(mapStateToProps, actions)(About);
