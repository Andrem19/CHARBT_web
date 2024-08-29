import React from 'react';
import { Image, Badge } from 'react-bootstrap';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const AvatarWithBadge = ({ src, badgeColor, width, height }) => {
    return (
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <Image src={src || "placeholder_avatar.jpg"} roundedCircle style={{ width: width, height: height }} />
          {badgeColor && (
            <div
              style={{
                position: 'absolute',
                bottom: -5,
                right: -5,
                color: badgeColor,
              }}
            >
              <FontAwesomeIcon icon={faStar} />
            </div>
          )}
        </div>
      );
};

export default AvatarWithBadge;
