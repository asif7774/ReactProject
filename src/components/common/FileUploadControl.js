import React from 'react';

const FileUploadControl = (props) => {
    return (
        <div className="input-type-file large">
            <input type='file' className='file-input' onChange={props.handleFileUpload}/>
            <i className="icon-cloud-uplod"></i>
            <p>Drag and drop a file here or click</p>
        </div>
    )
}

export default FileUploadControl;