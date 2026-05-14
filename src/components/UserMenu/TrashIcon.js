import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const TrashIcon = ({ onClick }) => {
  const [isIconHovered, setIconHovered] = useState(false);

  return (
    <FontAwesomeIcon 
      icon={faTrash} 
      onClick={onClick}
      onMouseEnter={() => setIconHovered(true)}
      onMouseLeave={() => setIconHovered(false)}
      style={{ fontSize: isIconHovered ? '1.2em' : '1em', cursor: 'pointer' }}
    />
  );
};

export default TrashIcon;
