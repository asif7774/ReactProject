import React from 'react';
import { Icon, Button, Transition } from 'semantic-ui-react'
import FileUploadControl from '../../common/FileUploadControl';

class NewArticle extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fileReadCompleted: false,
            showFileUploadControl: false
        }
        this.handleVisibility = this.handleVisibility.bind(this);
        this.handleFileUpload = this.handleFileUpload.bind(this);
    }

    componentWillReceiveProps(newProps) {
        if (newProps.postStatus !== this.props.postStatus && newProps.postStatus === "created") {
            this.setState({ showFileUploadControl: false })
        }
    }

    handleVisibility(e) {
        this.setState({ showFileUploadControl: !this.state.showFileUploadControl });
        this.setState({ label: e.target.name === "pdfOrPpt" ? "Upload your pdf" : "Upload your photo or video" });
    }

    handleFileUpload(event) {
        let file = event.target.files[0];

        if (file) {

            let fileType = file.type;
            let name;

            if (fileType.indexOf("image") > -1) name = "image";
            else if (fileType.indexOf("video") > -1) name = "video";
            else if (fileType.indexOf("pdf") > -1) name = "pdf";
            else if (fileType.indexOf("powerpoint") > -1) name = "ppt";

            let reader = new FileReader();
            this.props.assemblePost(name, file);
            let self = this;
            reader.onload = function (e) {
                self.props.previewPostMedia(name, e.target.result);
                self.setState({ fileReadCompleted: true, showFileUploadControl: false })
            };
            reader.readAsDataURL(file);
        }
    }

    changeSelectedFile=()=>{
        //show file upload control
        this.setState({ showFileUploadControl: true, fileReadCompleted: false,  });

        //hide previewer
        this.props.previewPostMedia('','');
    }
    render() {

        return (
            <React.Fragment>
                <Button size='mini' basic className="mR-10 btn-sm" name="pdfOrPpt" onClick={this.handleVisibility} >
                    <Icon className="text-blue icon-pdf" name='codepen' />
                    {/* Pdf or Ppt */}
                    Pdf
                </Button>

                {/* <Button size='mini' basic className="mR-10 btn-sm" onClick={this.handleOpen} >
                    <Icon className="text-blue" name='align left' />
                    Write an article
                </Button> */}
                {/* <TransitionablePortal open={open} transition={{ animation, duration }}> */}
                {/* <TransitionablePortal open={false}>
                    <ArticleEditorModal />
                </TransitionablePortal> */}

                <Button size='mini' basic className="btn-sm" name="imageOrVideo" onClick={this.handleVisibility}>
                    <Icon className="text-blue" name='camera' />
                    Image or Video
                </Button>


                {this.state.fileReadCompleted &&
                    <Button icon="delete" circular size="tiny" floated='right' onClick={this.changeSelectedFile} />
                }

                {this.state.showFileUploadControl &&
                    <Transition.Group animation={'slide down'} duration={300} >
                        <div className="mT-5 mB-20">
                            <label>{this.state.label}</label>
                            <FileUploadControl handleFileUpload={this.handleFileUpload} />
                        </div>
                    </Transition.Group>
                }
            </React.Fragment>
        )
    }
}

export default NewArticle;