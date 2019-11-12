import { constants } from "./index";

export const getYouTubeVideoId = (articleText) => {
    if (!articleText) { return '' };
    const youtubeUrl = articleText.match(constants.youtubeUrlRegex);
    const youtubeVideoId = youtubeUrl && youtubeUrl[0].match(constants.youTubeVideoIdRegex)[7];
    return youtubeVideoId || '';
}

export const getUrlFromText = (text) => {
    if(!text) {return ''}
    const articleUrl = text.match(constants.urlRegex);
    return articleUrl ? articleUrl[0] : '';
}
