import React from 'react';
import { Image, Embed } from 'semantic-ui-react'

const MediaPreviewer = ({ type, url }) => {
    switch (type) {
        case "image":
            return <Image src={url} width="100%" height="auto" />;
        case "video":
            return <video width="100%" height="400px" controls>
                <source src={url} type="video/mp4" />
                {/* <source src="movie.ogg" type="video/ogg" /> */}
            </video>
        case "pdf":
            return <embed src={`https://docs.google.com/gview?embedded=true&url=${url}&amp;`} width="100%" height="210px" type="application/pdf" />
        case "ppt":
            return <Image src={url} />;
        case "youtube":
            const youtubeUrlRegex = /(http(s)??\:\/\/)?(www\.)?((youtube\.com\/watch\?v=)|(youtu.be\/))([a-zA-Z0-9\-_])+/;
            const idRegex = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/

            const youtubeUrl = url.match(youtubeUrlRegex)[0];
            const youtubeVideoId = youtubeUrl.match(idRegex)[7];
            return <Embed source='youtube' id={youtubeVideoId} active={true} />
        default:
            return null;
    }
}

export default MediaPreviewer;
