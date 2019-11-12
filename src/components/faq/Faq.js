import React, { Component } from 'react';
import * as actions from '../../actions/'
import { connect } from 'react-redux'
import {  Grid, Container, Image, Responsive, Icon, Accordion, Header } from 'semantic-ui-react'

import './Faq.css'
import Navbar from '../common/Navbar'
import LeftSidebar from '../common/LeftSidebar'
import RightSection from '../common/RightSection'


class Faq extends Component {
    state = { activeIndex: 0 }

      handleClick = (e, titleProps) => {
        const { index } = titleProps
        const { activeIndex } = this.state
        const newIndex = activeIndex === index ? -1 : index

        this.setState({ activeIndex: newIndex })
      }
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
        const { activeIndex } = this.state
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
                                                        FAQ: Mappes.io Basics
                                                    </Header>
                                                    <p>You’ve got questions about the basics? Well, find some answers below! This page is dedicated to explaining what Mappes.io is and how it works.</p>
                                                    <Accordion>
                                                        <Accordion.Title className="color-light-blue" active={activeIndex === 0} index={0} onClick={this.handleClick}>
                                                          <Icon name='chevron right' />
                                                          What is Mappes.io?
                                                        </Accordion.Title>
                                                        <Accordion.Content active={activeIndex === 0}>
                                                          <p>Mappes.io is a Social Network Platform running on top of our Product Mapping backbone. We are mapping a product’s ecosystem by bringing all the products, companies, people, applications, knowledge related to those products closer to each other.</p>
                                                          <p>We have thousands of product and company profiles. We connect the product’s value chain by connecting a raw material to its applications. This is done using our algorithms and also by taking feedback from our users. Once the products are connected to each other, companies manufacturing those products and the people associated with those products are also connected to each other.</p>
                                                          <p>Users can FOLLOW a product to access information related to that product or to receive updates about that product.</p>
                                                          <p>A user can feed articles/videos/news/updates related to products by tagging the products which we then feed it to the users in that product’s network, thus creating a knowledge platform around a product. Similarly, you will have access to the latest updates related to the products in your industry.</p>
                                                          <p>No one ‘owns’ a product profile – it is all open. We do have checks in place to make sure no one is abusing the system, but it is all crowdsourced.</p>
                                                          <p>When you tell us what products you make and where you work, we auto-populate the product network for you and show you the products that you should be interested in. We send you Sales Leads and information on new suppliers, along with any new applications or a new raw material or process that you should be looking at.</p>
                                                          <p>You can market your products directly to the people/companies in your product network. You can get all of that for free, just by signing up (providing your email address, your employer name and the product you make).</p>
                                                        </Accordion.Content>

                                                        <Accordion.Title className="color-light-blue" active={activeIndex === 1} index={1} onClick={this.handleClick}>
                                                          <Icon name='chevron right' />
                                                          How do I build my network on Mappes.io?
                                                        </Accordion.Title>
                                                        <Accordion.Content active={activeIndex === 1}>
                                                          <p>Start by becoming a part of your company profile and providing us information about the products you make. You can then connect your products to its applications and raw materiasl to build your customer and supplier network. You will have access to the complete value chain of your products.</p>
                                                        </Accordion.Content>

                                                        <Accordion.Title className="color-light-blue" active={activeIndex === 2} index={2} onClick={this.handleClick}>
                                                          <Icon name='chevron right' />
                                                          There is no information related to my product on Mappes.io?
                                                        </Accordion.Title>
                                                        <Accordion.Content active={activeIndex === 2}>
                                                          <p>Even though we are working tirelessly in bringing all the industrial products on our platform we can still fall short sometimes. If there is no information on your product, you can help us build your product network by sending us email on <a href="mailto:ankit.singhal@mappes.io">ankit.singhal@mappes.io</a>. We will work with you to map your product’s value chain.</p>                                                         
                                                        </Accordion.Content>

                                                        <Accordion.Title className="color-light-blue" active={activeIndex === 3} index={3} onClick={this.handleClick}>
                                                          <Icon name='chevron right' />
                                                          What is a Product profile?
                                                        </Accordion.Title>
                                                        <Accordion.Content active={activeIndex === 3}>
                                                          <p>A Product profile is an online profile page of a Product. It’s one way we collect, archive and feed data to you and Mappes.io members, who are following that product. A profile includes all the key information we source about the value chain of a product, including: Manufacturers of the product, raw materials/equipment (and their suppliers), end-use/applications (and their manufactures, who are your potential customers) of the product.It also shows articles, case studies, and other information added by the users for that product.</p>                                                         
                                                        </Accordion.Content>
                                                        <Accordion.Title className="color-light-blue" active={activeIndex === 4} index={4} onClick={this.handleClick}>
                                                          <Icon name='chevron right' />
                                                          What is a company profile?
                                                        </Accordion.Title>
                                                        <Accordion.Content active={activeIndex === 4}>
                                                          <p>A company profile is an online profile of your company. A profile includes all the key information we source about a company, including: products manufactured, contact person for each product, profile and contact of the company.</p>                                                         
                                                        </Accordion.Content>
                                                        <Accordion.Title className="color-light-blue" active={activeIndex === 5} index={5} onClick={this.handleClick}>
                                                          <Icon name='chevron right' />
                                                          What is a user profile?
                                                        </Accordion.Title>
                                                        <Accordion.Content active={activeIndex === 5}>
                                                          <p>A user profile is effectively your business card and also has a Feed section for you, to quickly access all the information related to the products you follow.</p>                                                         
                                                        </Accordion.Content>
                                                        <Accordion.Title className="color-light-blue" active={activeIndex === 6} index={6} onClick={this.handleClick}>
                                                          <Icon name='chevron right' />
                                                          Who will see the articles I upload?
                                                        </Accordion.Title>
                                                        <Accordion.Content active={activeIndex === 6}>
                                                          <p>Users who are part of your product network will see the updates you make. You can change the view settings anytime to make is viewable by only you, or only your team.</p>                                                         
                                                        </Accordion.Content>
                                                        <Accordion.Title className="color-light-blue" active={activeIndex === 7} index={7} onClick={this.handleClick}>
                                                          <Icon name='chevron right' />
                                                          Why does it say some users are out of my network?
                                                        </Accordion.Title>
                                                        <Accordion.Content active={activeIndex === 7}>
                                                          <p>A user profile, product profile or company profile are part of your network only when they are part of your product’s network. Your products should have a relation with their products. If that relation has not been established yet, you can help us create that relationship by sending a message to <a href="mailto:ankit.singhal@mappes.io">ankit.singhal@mappes.io</a> and we will link those products and thus provide access to that value chain to you.</p>                                                         
                                                        </Accordion.Content>
                                                        <Accordion.Title className="color-light-blue" active={activeIndex === 8} index={8} onClick={this.handleClick}>
                                                          <Icon name='chevron right' />
                                                          Where does Mappes.io get its information?
                                                        </Accordion.Title>
                                                        <Accordion.Content active={activeIndex === 8}>
                                                          <p>Mappes.io gathers and stores information from a variety of places. The primary way we gather information is through our own algorithms. Mappes.io members also vote on our data and contribute information. We also source information through industry exhibitions, news articles, publicly-available government documents, press releases, and company-produced documents and sites like blogs.</p>                                                         
                                                        </Accordion.Content>
                                                        <Accordion.Title className="color-light-blue" active={activeIndex === 9} index={9} onClick={this.handleClick}>
                                                          <Icon name='chevron right' />
                                                          Why does my company have a profile on Mappes.io?
                                                        </Accordion.Title>
                                                        <Accordion.Content active={activeIndex === 9}>
                                                          <p>Your company most likely has a profile because someone, at some point in time, was looking for info on your company. We also add companies to Mappes.io when an event prompts us to do so. Such events might include: 1) news about a company 2) You attended an exhibition 3) a Mappes.io member requests that the company be added to our database. 
                                                          </p>          
                                                        </Accordion.Content>
                                                        <Accordion.Title className="color-light-blue" active={activeIndex === 10} index={10} onClick={this.handleClick}>
                                                          <Icon name='chevron right' />
                                                          Can I request Mappes.io to remove my company’s profile?
                                                        </Accordion.Title>
                                                        <Accordion.Content active={activeIndex === 10}>
                                                          <p>Since all of the information on Mappes.io is publicly-sourced, our policy is that we don’t remove company profiles. However, we’re absolutely committed to ensuring the data about a company is accurate. Of course, if we mistakenly added a profile that is not a corporation, we’ll remove it. We will also remove logos upon request.</p>   
                                                        </Accordion.Content>
                                                        <Accordion.Title className="color-light-blue" active={activeIndex === 11} index={11} onClick={this.handleClick}>
                                                          <Icon name='chevron right' />
                                                          How do I edit a product or company’s information on Mappes.io?
                                                        </Accordion.Title>
                                                        <Accordion.Content active={activeIndex === 11}>
                                                          <p>If you come across a product or company profile that is incomplete or displays data you believe is inaccurate we’d love to work with you to ensure it is fixed, you may email us at <a href="mailto:ankit.singhal@mappes.io">ankit.singhal@mappes.io</a> to make a change. Please describe the specific data points that are inaccurate, or if it is a link, please include it.</p>   
                                                        </Accordion.Content>
                                                        <Accordion.Title className="color-light-blue" active={activeIndex === 12} index={12} onClick={this.handleClick}>
                                                          <Icon name='chevron right' />
                                                          Why do you need to register?
                                                        </Accordion.Title>
                                                        <Accordion.Content active={activeIndex === 12}>
                                                          <p>Primarily because there are bots out there that do like to crawl our data. Ensuring you’re a human like us prevents that! It also helps us keep members accountable for the accuracy of the data they provide.</p>   
                                                        </Accordion.Content>
                                                        <Accordion.Title className="color-light-blue" active={activeIndex === 13} index={13} onClick={this.handleClick}>
                                                          <Icon name='chevron right' />
                                                          Can my company own its profile on Mappes.io?
                                                        </Accordion.Title>
                                                        <Accordion.Content active={activeIndex === 13}>
                                                          <p>Yes, we encourage users to own their company pages and provide up to date information on it. Please contact <a href="mailto:ankit.singhal@mappes.io">ankit.singhal@mappes.io</a> on how to get access to your company page.</p>   
                                                        </Accordion.Content>
                                                        <Accordion.Title className="color-light-blue" active={activeIndex === 14} index={14} onClick={this.handleClick}>
                                                          <Icon name='chevron right' />
                                                          How does Mappes.io Ensure the Accuracy of Its Data?
                                                        </Accordion.Title>
                                                        <Accordion.Content active={activeIndex === 14}>
                                                          <p>Mappes.io has an awesome team of data researchers. Any time an update is made to a piece of non-subjective data on our platform they verify the update. Our researchers will locate a source that confirms the inputted data before the data appears on any company profile. For example, if you update the headquarter information for a company, one of our researchers will verify this data before the profile is updated. If you make an edit to our data and receive a notice that the update was not approved, this is either because the researchers were unable to confirm your data or they found the data to be inaccurate. If you received such a notice from us but know your data is accurate, great. Please let us know! We’d love to learn about that. Contact us at <a href="mailto:ankit.singhal@mappes.io">ankit.singhal@mappes.io</a></p>   
                                                        </Accordion.Content>
                                                        <Accordion.Title className="color-light-blue" active={activeIndex === 15} index={15} onClick={this.handleClick}>
                                                          <Icon name='chevron right' />
                                                          How do I create an account on Mappes.io ?
                                                        </Accordion.Title>
                                                        <Accordion.Content active={activeIndex === 15}>
                                                          <p>Great! You’d like to sign up for Mappes.io! We’d love to have you in our community. Signin up for Mappes.io is a simple process, get started by visiting <a href="http://www.mappes.io">www.mappes.io</a> and login in using your Linkedin ID. Once you sign in, we will map you to company’s page. This way people in your product network can contact you.</p>   
                                                        </Accordion.Content>
                                                      </Accordion>
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

export default connect(mapStateToProps, actions)(Faq);
