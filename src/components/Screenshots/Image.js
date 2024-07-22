import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Image } from "react-bootstrap";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

function ImageWithDelete({ url, handleShow, handleDelete }) {
    const [showDeleteIcon, setShowDeleteIcon] = useState(false);
    const fileName = url.substring(url.lastIndexOf('/') + 1, url.lastIndexOf('.'));
  
    return (
      <div 
        className="image-container" 
        style={{ position: 'relative' }}
        onMouseEnter={() => setShowDeleteIcon(true)}
        onMouseLeave={() => setShowDeleteIcon(false)}
      >
        <Image 
          src={url} 
          thumbnail 
          onClick={() => handleShow(url)} 
          style={{cursor: 'pointer', height: 'auto', minHeight: '200px'}}
        />
        {showDeleteIcon && (
          <FontAwesomeIcon 
            onClick={() => handleDelete(url)} 
            icon={faTrash} 
            style={{ cursor: 'pointer', color: 'var(--navbar-text-color)', position: 'absolute', top: '10px', right: '10px' }}
          />
        )}
        <div className="image-title" style={{marginLeft: 10}} >{fileName}</div>
      </div>
    );
  }

  export default ImageWithDelete;