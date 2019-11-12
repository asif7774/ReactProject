import React, { Component } from 'react';
import { Feed } from 'semantic-ui-react'

export default class AddSupplier extends Component {
    render() {
        return (
            <Feed.Event>
                                <Feed.Label image='/assets/images/avatar/small/laura.jpg' />

                <Feed.Content>
                    <Feed.Date>Today</Feed.Date>
                    <Feed.Summary>
                        <a>Rishabh Jain</a> added <a>Company one</a> as a supplier of <a>Cable</a>.
                            </Feed.Summary>
                </Feed.Content>
            </Feed.Event>
        )
    }
}