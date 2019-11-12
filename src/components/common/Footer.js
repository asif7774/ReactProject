import React, { Component } from 'react';
import { List } from 'semantic-ui-react'

export default class Footer extends Component {


    render() {
        return (
            <footer className="footer"> 				
				<List horizontal link>
					<List.Item as='a' href="/aboutus">About Us</List.Item>
					{/* <List.Item as='a'>Terms &amp; Conditions</List.Item> */}
					{/* <List.Item as='a'>Privacy Policy</List.Item> */}
					<List.Item as='a' href="/contact">Contact Us</List.Item>
					{/* <List.Item as='a' href="/faq">FAQ</List.Item> */}
				</List>
				<div className="pull-right copright">2019 &copy; Mappes Inc.</div>
            </footer>

        )
    }

}
