import React, { Component } from 'react';
import { List } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import AvatarSmall from "../../common/AvatarSmall";
import User from './user';

export default (notification, index) => (
    <List.Item key={index}>
        <AvatarSmall id={notification.actor_id} name={notification.actor_name} />
        <List.Content>
            <List.Description>
            <User id={notification.actor_id}/>{" "}
                has been added to{" "}
                <Link to={`/company/${notification.company_id}`}>
                    {notification.company_name}
                </Link>
            </List.Description>
        </List.Content>
    </List.Item>);
