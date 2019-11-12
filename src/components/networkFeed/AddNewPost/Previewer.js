import React from 'react';
import MediaPreviewer from '../../common/MediaPreviewer';

class Previewer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            type: props.type
        }
    }

    componentWillReceiveProps(newProps) {
        if (newProps.type !== this.props.type) {
            this.setState({ type: newProps.type })
        }

        if (newProps.postStatus !== this.props.postStatus && newProps.postStatus === "created") {
            this.setState({ type: '' })
        }
    }

    render() {
        const { url } = this.props;

        return (
            <React.Fragment>
                {this.state.type === "pdf" ?
                    <embed src={url} width="100%" height="210px" type="application/pdf" />
                    :
                    <MediaPreviewer type={this.state.type} url={url} />
                }
            </React.Fragment>
        )
    }
}

export default Previewer;
