import React, { useState, useEffect } from "react";
import { Button, Modal, Form, Alert, Dropdown } from "react-bootstrap";
import { convertTimeframe } from "../../../services/services";
import { COIN_CRYPTO_SET, STOCK, FOREX, TIMEFRAMES } from "../../../config";
import { useSelector, useDispatch } from "react-redux";
import {
  getAvaliblePairs,
  getAvalibleTimeframes,
} from "../../../services/access";

export default function SessionModal({ show, handleClose, handleSave }) {
  const dispatch = useDispatch();
  const [imageName, setImageName] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const sessions_list = useSelector((state) => state.session.sessions_list);
  const currentPair = useSelector((state) => state.data.current_pair);
  const currentTimeframe = useSelector((state) => state.data.timeframe);
  const [coin_pair, setCoinPair] = useState(currentPair || 'BTCUSDT');
  const [timeframe, setTimeframe] = useState(currentTimeframe);
  const [personalData, setPersonalData] = useState(false);
  const [decimalPlaces, setDecimalPlaces] = useState(2)
  const [selectedDataset, setSelectedDataset] = useState('')
  const user = useSelector((state) => state.user.user);
  const theme = useSelector((state) => state.data.theme);

  const [zIndexDrawPanel, setZIndexDrawPanel] = useState(9999);

  let availableTimeframes = getAvalibleTimeframes(user);

  let availablePairs = getAvaliblePairs(user);

  const clickChouseCoin = () => {
    setZIndexDrawPanel(0);
  };

  const handleSelectPair = async (selectedPair) => {
    setCoinPair(selectedPair);
  };

  const handleSelectTimeframe = (selectedTime) => {
    setTimeframe(selectedTime);
  };

  const closeWindow = () => {
    setImageName('')
    setCoinPair('')
    setSelectedDataset('')
    setPersonalData(false)
    setDecimalPlaces(2)
    handleClose()
  }

  const handleImageNameChange = (e) => {
    const newName = e.target.value;

    const latinLettersNumbersSymbolsAndSpaces = /^[A-Za-z0-9_ -]*$/;

    if (newName.length > 15) {
      setShowAlert(true);
      setAlertMessage(
        "The session name should not be longer than 15 characters."
      );
    } else if (!latinLettersNumbersSymbolsAndSpaces.test(newName)) {
      setShowAlert(true);
      setAlertMessage(
        "The session name name should only contain Latin letters, numbers, hyphens, and underscores."
      );
    } else {
      setShowAlert(false);
      setImageName(newName);
    }
  };

  const saveHandler = (name) => {
    const nameExists = sessions_list.some((session) => session.session_name === name);
  
    if (nameExists || !name) {
      setShowAlert(true);
      setAlertMessage("The session name already exists or is empty. Please choose a different name.");
      return;
    }

    if (!coin_pair && !personalData) {
      setShowAlert(true);
      setAlertMessage("Please select the coin pair.");
      return;
    }
  
    if (personalData && !selectedDataset) {
      setShowAlert(true);
      setAlertMessage("You need to load and select your dataset.");
      return;
    }
  
    let tm = personalData ? 60 : convertTimeframe(timeframe);
  
    handleSave(imageName, coin_pair, tm, personalData, selectedDataset, decimalPlaces);
  
    // Reset state
    setImageName('');
    setCoinPair('');
    setSelectedDataset('');
    setPersonalData(false);
    setDecimalPlaces(2);
  };
  

  const handlePersonalDataChange = (event) => {
    setPersonalData(event.target.checked);
  };

  // useEffect(() => {
  //   console.log(selectedDataset)
  // }, [selectedDataset]);

  const handleSelectDecimalPlaces = (eventKey) => {
    setDecimalPlaces(parseInt(eventKey));
  };

  return (
    <Modal show={show} onHide={closeWindow}>
      <Modal.Header closeButton>
        <Modal.Title>Create New Session</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formImageName">
            <Form.Label>Session Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter session name"
              value={imageName}
              onChange={handleImageNameChange}
            />
            <Alert
              show={showAlert}
              variant="danger"
              dismissible
              onClose={() => setShowAlert(false)}
            >
              {alertMessage}
            </Alert>
          </Form.Group>
        </Form>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            marginTop: 10,
          }}
        >
          <Dropdown
            onClick={clickChouseCoin}
            onSelect={handleSelectPair}
            className={theme}
            style={{ width: "140px", marginRight: "10px", zIndex: 99999 }}
          >
            <Dropdown.Toggle
              variant="outline-default"
              id="dropdown-basic"
              className="w-100"
            >
              {personalData? "BTCUSDT" : coin_pair ? coin_pair : "BTCUSDT"}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              {COIN_CRYPTO_SET.map((pair, index) => (
                <Dropdown.Item
                  key={index}
                  eventKey={pair}
                  active={pair === coin_pair}
                  disabled={!availablePairs.includes(pair)}
                  style={{
                    color: !availablePairs.includes(pair)
                      ? "grey"
                      : theme === "dark"
                      ? "white"
                      : "black",
                  }}
                  onClick={() => setCoinPair(pair)}
                >
                  {pair}
                </Dropdown.Item>
              ))}

              <Dropdown.Divider />
              {STOCK.map((pair, index) => (
                <Dropdown.Item
                  key={index}
                  eventKey={pair}
                  active={pair === coin_pair}
                  disabled={!availablePairs.includes(pair)}
                  style={{
                    color: !availablePairs.includes(pair)
                      ? "grey"
                      : theme === "dark"
                      ? "white"
                      : "black",
                  }}
                  onClick={() => setCoinPair(pair)}
                >
                  {pair}
                </Dropdown.Item>
              ))}

              <Dropdown.Divider />
              {FOREX.map((pair, index) => (
                <Dropdown.Item
                  key={index}
                  eventKey={pair}
                  active={pair === coin_pair}
                  disabled={!availablePairs.includes(pair)}
                  style={{
                    color: !availablePairs.includes(pair)
                      ? "grey"
                      : theme === "dark"
                      ? "white"
                      : "black",
                  }}
                  onClick={() => setCoinPair(pair)}
                >
                  {pair}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>

          <Dropdown
            onSelect={handleSelectTimeframe}
            className={theme}
            style={{ width: "50px", marginRight: 5 }}
          >
            <Dropdown.Toggle variant="outline-default" id="dropdown-basic">
              {timeframe ? timeframe : "1d"}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              {TIMEFRAMES.map((t, index) => (
                <Dropdown.Item
                  key={index}
                  eventKey={t}
                  active={t === timeframe}
                  disabled={!availableTimeframes.includes(t)}
                  style={{
                    color: !availableTimeframes.includes(t)
                      ? "grey"
                      : theme === "dark"
                      ? "white"
                      : "black",
                  }}
                  onClick={() => setTimeframe(t)}
                >
                  {t}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </div>

        <Form.Group controlId="formPersonalData" style={{ marginTop: 10 }}>
          <Form.Check
            disabled={!user || user.payment_status === 'defoult' || user.payment_status === 'essential'}
            type="checkbox"
            label="Personal Data"
            checked={personalData}
            onChange={handlePersonalDataChange}
          />
        </Form.Group>
        {personalData && (
          <div>
          <div style={{ display: "flex", alignItems: "center", marginTop: 10 }}>
            <Dropdown
              // onSelect={handleSelectDataset}
              className={theme}
              style={{ width: "100%" }}
            >
              <Dropdown.Toggle variant="outline-default" id="dropdown-basic">
                Select Dataset
              </Dropdown.Toggle>

              <Dropdown.Menu>
                {user.datasets.map((dataset, index) => (
                  <Dropdown.Item
                    key={index}
                    eventKey={dataset.id}
                    active={dataset.id === selectedDataset?.id}
                    style={{
                      color: theme === "dark" ? "white" : "black",
                    }}
                    onClick={() => setSelectedDataset(dataset)}
                  >
                    {dataset.name}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
            {selectedDataset && (
              <span style={{ marginRight: 15 }}>{selectedDataset.name}</span>
            )}
            
          </div>
            <div style={{ display: "flex", alignItems: "center", marginTop: 10 }}>
            <Dropdown onSelect={handleSelectDecimalPlaces} className={theme} style={{ width: "100%", marginTop: 10 }}>
            <Dropdown.Toggle variant="outline-default" id="dropdown-decimal-places">
              Decimal Places:
            </Dropdown.Toggle>

            <Dropdown.Menu>
              {[1, 2, 3, 4, 5, 6].map((number) => (
                <Dropdown.Item
                  key={number}
                  eventKey={number.toString()}
                  active={number === decimalPlaces}
                  style={{
                    color: theme === "dark" ? "white" : "black",
                  }}
                >
                  {number}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
          <span style={{ marginRight: 15 }}>{decimalPlaces}</span>
          </div>
        </div>
        )}
        

      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={closeWindow}>
          Close
        </Button>
        <Button
          variant="primary"
          onClick={() => saveHandler(imageName)}
          disabled={showAlert}
        >
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
