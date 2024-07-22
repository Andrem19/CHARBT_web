import React, { useState } from 'react';
import { Button, Modal, Form, Alert } from 'react-bootstrap';
import { useSelector } from 'react-redux';


export default function ImageModal({ show, handleClose, handleSave }) {

    
    const [imageName, setImageName] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const screenshot_collection = useSelector(state => state.data.screenshots);

    const handleImageNameChange = (e) => {
        const newName = e.target.value;
    
        const latinLettersNumbersAndSymbols = /^[A-Za-z0-9_-]*$/;
    
        if (newName.includes(' ')) {
            setShowAlert(true);
            setAlertMessage('The image name should not contain spaces.');
        } else if (newName.length > 20) {
            setShowAlert(true);
            setAlertMessage('The image name should not be longer than 20 characters.');
        } else if (!latinLettersNumbersAndSymbols.test(newName)) {
            setShowAlert(true);
            setAlertMessage('The image name should only contain Latin letters, numbers, hyphens, and underscores.');
        } else {
            setShowAlert(false);
            setImageName(newName);
        }
    };
    
    

    const saveHandler = (name) => {
        const nameExists = screenshot_collection.some(url => {
            const fileName = url.split('/').pop().split('.')[0]; // Extract file name from URL
            return fileName === name;
        });

        if (nameExists) {
            setShowAlert(true);
            setAlertMessage('The image name already exists. Please choose a different name.');
    } else {
        handleSave(imageName)
    }
    
}

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Save Image</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="formImageName">
                        <Form.Label>Image Name</Form.Label>
                        <Form.Control type="text" placeholder="Enter image name" value={imageName} onChange={handleImageNameChange} />
                        <Alert show={showAlert} variant="danger" dismissible onClose={() => setShowAlert(false)}>
                            {alertMessage}
                        </Alert>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={() => saveHandler(imageName)} disabled={showAlert}>
                    Save
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
