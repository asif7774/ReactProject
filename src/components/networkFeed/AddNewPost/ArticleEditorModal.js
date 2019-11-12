import React from 'react';
import { Tab, Header, Button, Divider, Modal, Form } from 'semantic-ui-react';
import FileUploadControl from '../../common/FileUploadControl';
import { Editor } from 'react-draft-wysiwyg';

const ArticleEditorModal = () => {

    const panesModal = [
        {
            menuItem: 'Article', render: () =>
                <Tab.Pane attached={false}>
                    <Form>
                        <Form.Field>
                            <label>Title</label>
                            <input placeholder='Title' />
                        </Form.Field>
                    </Form>
                    <label>Content</label>
                    <Editor />
                    <div className="mT-20"></div>
                    <label>Attachment</label>
                    <FileUploadControl />
                    <div className="mT-20"></div>
                    <Divider />
                    <div className="mT-20">
                        <Button primary className="with-icon"><i className="icon-envelope-medium"></i> Submit</Button>
                        <Button className="with-icon"><i className="icon-close-medium"></i> Discard</Button>
                    </div>
                </Tab.Pane>
        },
        {
            menuItem: 'Document', render: () =>
                <Tab.Pane attached={false}>
                    <Form>
                        <Form.Field>
                            <label>Title</label>
                            <input placeholder='Title' />
                        </Form.Field>
                    </Form>
                    <label>Thumbnail</label>
                    <FileUploadControl />
                    <div className="mT-20"></div>

                    <label>Attachment</label>
                    <FileUploadControl />

                    <div className="mT-20"></div>
                    <Divider />
                    <div className="mT-20">
                        <Button primary className="with-icon"><i className="icon-envelope-medium"></i> Submit</Button>
                        <Button className="with-icon"><i className="icon-close-medium"></i> Discard</Button>
                    </div>
                </Tab.Pane>
        },
    ]


    return (
        <Modal
            dimmer
            open={true}
            onClose={this.handleOpen}
            size='large'
            className='edit-article-box'
        >
            <Header>
                <h3 className="t600 m-0">Write something smart!!!
                                <i name='close' className="icon-close close" onClick={this.handleOpen} ></i>
                </h3>
            </Header>
            <Modal.Content>
                <Tab menu={{ secondary: true }} panes={panesModal} />
            </Modal.Content>

        </Modal>
    )
}

export default ArticleEditorModal;