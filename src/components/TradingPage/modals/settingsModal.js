import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useSelector } from "react-redux";

const SettingsModal = ({showSettings, setShowChart, setPriceMode, setTimeLine, setTpsl, setMarkers, setPatterns, setTools}) => {

    const handleClose = () => setShowChart(false);
    const showTime = useSelector((state) => state.data.showTime);
    const percPrice = useSelector((state) => state.data.percPrice);
    const showTpsl = useSelector((state) => state.data.showTpsl);
    const showMarkers = useSelector((state) => state.data.showMarkers);
    const patterns = useSelector((state) => state.data.showPatterns);
    const showTools = useSelector((state) => state.data.showTools);
    

    return (
        <>
            

            <Modal show={showSettings} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Chart Settings</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                    <Form.Check 
                            onChange={setTools}
                            type="switch"
                            id="setTools"
                            label="Show Tools"
                            checked={showTools}
                        />
                        <Form.Check 
                            onChange={setPatterns}
                            type="switch"
                            id="setPatterns"
                            label="Show Patterns"
                            checked={patterns}
                        />
                        <Form.Check 
                            onChange={setPriceMode}
                            type="switch"
                            id="price_percent"
                            label="Price/Percent"
                            checked={percPrice}
                        />
                        <Form.Check 
                            onChange={setTimeLine}
                            type="switch"
                            id="time_scale"
                            label="Show Time Scale"
                            checked={showTime}
                        />
                        <Form.Check 
                            onChange={setTpsl}
                            type="switch"
                            id="tpsl"
                            label="Show TP/SL lines"
                            checked={showTpsl}
                        />
                        <Form.Check 
                            onChange={setMarkers}
                            type="switch"
                            id="setMarkers"
                            label="Show Markers"
                            checked={showMarkers}
                        />
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default SettingsModal;
