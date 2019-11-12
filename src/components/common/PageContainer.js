import React, { Component } from 'react';
import { Label, Table, Sticky, Transition, List, Container, Sidebar, Icon, Grid, Header, Image, Menu, Segment, Button, Divider, Responsive } from 'semantic-ui-react'

export default class PageContainer extends Component {


    render() {
        return (
            <Segment className="body-background" basic style={{ padding: '50px', paddingRight: "150px", paddingLeft: "150px" }}>
                <Grid stackable={true}>
                    <Responsive as={Grid.Column} className="left-content" minWidth={768}>
                        <LeftSidebar />
                    </Responsive>
                    <Grid.Column width={10} style={{ 'border': '1px solid rgba(0,0,0,0.3)' }}>
                        <Container>
                            <Grid className="padding-top-30 padding-bottom-30">
                                <Grid.Column width={13}>
                                    <div>
                                        <span className="color-light-green product-name">Optical Fibre (55 Connected)</span>
                                        <Button className=" margin-left-25 background-light-blue" primary size={'mini'} animated>
                                            <Button.Content visible>Follow</Button.Content>
                                            <Button.Content hidden>
                                                <Icon name='plus' />
                                            </Button.Content>
                                        </Button>
                                    </div>

                                </Grid.Column>
                                <Grid.Column floated='right' width={2}>
                                    <Icon className="color-light-blue" size='big' name={'ellipsis horizontal'} />
                                </Grid.Column>
                            </Grid>

                        </Container>
                        <Container>

                            <Grid className="padding-top-30 padding-bottom-30 background-white">
                                <Grid.Column className="stats-border" textAlign="center" width={4}>
                                    <div className="info-text color-light-blue" >222K</div>
                                    <div className="padding-top-20" style={{ fontSize: '15px' }} >
                                        <div className="info-icon-holder color-light-grey" style={{ fontSize: '30px', marginBottom: '15px' }} ><Icon name={'mail forward'} /></div>
                                        <div className="info-icon-holder color-light-grey" style={{ textAlign: 'left' }} >Connected <br /> Supplier</div>
                                    </div>
                                </Grid.Column>
                                <Grid.Column className="stats-border" textAlign="center" width={4}>
                                    <div className="info-text color-light-blue" >222K</div>
                                    <div className="padding-top-20" style={{ fontSize: '15px' }} >
                                        <div className="info-icon-holder color-light-grey" style={{ fontSize: '30px', marginBottom: '15px' }} ><Icon name={'grid layout'} /></div>
                                        <div className="info-icon-holder color-light-grey" style={{ textAlign: 'left' }} >Connected <br /> Raw Materials</div>
                                    </div>
                                </Grid.Column>
                                <Grid.Column className="stats-border" textAlign="center" width={4}>
                                    <div className="info-text color-light-blue" >222K</div>
                                    <div className="padding-top-20" style={{ fontSize: '15px' }} >
                                        <div className="info-icon-holder color-light-grey" style={{ fontSize: '30px', marginBottom: '15px' }} ><Icon name={'bullseye'} /></div>
                                        <div className="info-icon-holder color-light-grey" style={{ textAlign: 'left' }} >Product <br /> Applications</div>
                                    </div>
                                </Grid.Column>
                                <Grid.Column textAlign="center" width={4}>
                                    <div className="info-text color-light-blue" >222K</div>
                                    <div className="padding-top-20" style={{ fontSize: '15px' }} >
                                        <div className="info-icon-holder color-light-grey" style={{ fontSize: '30px', marginBottom: '15px' }} ><Icon name={'users'} /></div>
                                        <div className="info-icon-holder color-light-grey" style={{ textAlign: 'left' }} >Potential <br /> Customers</div>
                                    </div>
                                </Grid.Column>
                                <div>
                                    Optical fibers are used most often as a means to transmit light between the two ends of the fiber and find wide usage in fiber-optic communications, where they permit transmission over longer distances and at higher bandwidths (data rates) than wire cables.
                                    </div>
                            </Grid>

                        </Container>
                        <Container>
                            <Grid>
                                <Grid.Column floated='left' width={14}>
                                    <Header className="table-heading" >Some Header Description</Header>
                                </Grid.Column>
                                <Grid.Column floated='right' width={2}>
                                    <Icon className="color-light-blue" size='big' name={'ellipsis horizontal'} />
                                </Grid.Column>
                            </Grid>
                            <Divider />
                            <Table color='grey' padded={true} basic='very'>
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell className="color-light-blue" >Name</Table.HeaderCell>
                                        <Table.HeaderCell className="color-light-blue">Status</Table.HeaderCell>
                                        <Table.HeaderCell className="color-light-blue">Notes</Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>

                                <Table.Body>
                                    <Table.Row>
                                        <Table.Cell>John</Table.Cell>
                                        <Table.Cell>Approved</Table.Cell>
                                        <Table.Cell>None</Table.Cell>
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Cell>Jamie</Table.Cell>
                                        <Table.Cell>Approved</Table.Cell>
                                        <Table.Cell>Requires call</Table.Cell>
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Cell>Jill</Table.Cell>
                                        <Table.Cell>Denied</Table.Cell>
                                        <Table.Cell>None</Table.Cell>
                                    </Table.Row>
                                </Table.Body>
                            </Table>
                        </Container>
                        <Container>
                            <Grid>
                                <Grid.Column floated='left' width={14}>
                                    <Header className="table-heading" >Some Header Description</Header>
                                </Grid.Column>
                                <Grid.Column floated='right' width={2}>
                                    <Icon className="color-light-blue" size='big' name={'ellipsis horizontal'} />
                                </Grid.Column>
                            </Grid>
                            <Divider />
                            <Table color='grey' padded={true} basic='very'>
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell className="color-light-blue" >Name</Table.HeaderCell>
                                        <Table.HeaderCell className="color-light-blue">Status</Table.HeaderCell>
                                        <Table.HeaderCell className="color-light-blue">Notes</Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>

                                <Table.Body>
                                    <Table.Row>
                                        <Table.Cell>John</Table.Cell>
                                        <Table.Cell>Approved</Table.Cell>
                                        <Table.Cell>None</Table.Cell>
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Cell>Jamie</Table.Cell>
                                        <Table.Cell>Approved</Table.Cell>
                                        <Table.Cell>Requires call</Table.Cell>
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Cell>Jill</Table.Cell>
                                        <Table.Cell>Denied</Table.Cell>
                                        <Table.Cell>None</Table.Cell>
                                    </Table.Row>
                                </Table.Body>
                            </Table>
                        </Container>
                        <Container>
                            <Grid>
                                <Grid.Column floated='left' width={14}>
                                    <Header className="table-heading" >Some Header Description</Header>
                                </Grid.Column>
                                <Grid.Column floated='right' width={2}>
                                    <Icon className="color-light-blue" size='big' name={'ellipsis horizontal'} />
                                </Grid.Column>
                            </Grid>
                            <Divider />
                            <Table color='grey' padded={true} basic='very'>
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell className="color-light-blue" >Name</Table.HeaderCell>
                                        <Table.HeaderCell className="color-light-blue">Status</Table.HeaderCell>
                                        <Table.HeaderCell className="color-light-blue">Notes</Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>

                                <Table.Body>
                                    <Table.Row>
                                        <Table.Cell>John</Table.Cell>
                                        <Table.Cell>Approved</Table.Cell>
                                        <Table.Cell>None</Table.Cell>
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Cell>Jamie</Table.Cell>
                                        <Table.Cell>Approved</Table.Cell>
                                        <Table.Cell>Requires call</Table.Cell>
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Cell>Jill</Table.Cell>
                                        <Table.Cell>Denied</Table.Cell>
                                        <Table.Cell>None</Table.Cell>
                                    </Table.Row>
                                </Table.Body>
                            </Table>
                        </Container>
                    </Grid.Column>
                    <RightSection />
                </Grid>
            </Segment>

        )
    }

}
