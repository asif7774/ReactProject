import React, { Component } from 'react';
import { List } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import User from './user';
import AvatarSmall from "../../common/AvatarSmall";

export default (notification, index) => (
    <List.Item key={index}>
        <AvatarSmall id={notification.actor_id} name={notification.actor_name} />
        <List.Content>
            <List.Description>
                <User id={notification.actor_id}/>{" "}
                has added{" "}
                <Link to={`/product/${notification.linked_product_id}`}>
                    {notification.linked_product_name}
                </Link>{" "}
                as end product of{" "}
                <Link to={`/product/${notification.product_id}`}>{notification.product_name}</Link>
                {/* <a className='color-light-blue'>Lorem</a> ipsum dolor <a className='color-light-blue'>sit</a> amet */}
            </List.Description>
        </List.Content>
    </List.Item>);