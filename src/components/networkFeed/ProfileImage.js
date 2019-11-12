import React from 'react';
import { Image} from 'semantic-ui-react'

const ProfileImage = ({image}) => {
    return (
        image?
            <Image className="user-avtar-image" src={image} />
            :
            null
    )
}
export default ProfileImage;