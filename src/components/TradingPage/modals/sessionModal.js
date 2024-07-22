import React, { useState } from "react";
import { Button, Modal, Form, Alert, Dropdown } from "react-bootstrap";
import { convertTimeframe } from "../../../services/services";
import { COIN_CRYPTO_SET, STOCK, FOREX, TIMEFRAMES } from "../../../config";
import { useSelector, useDispatch } from "react-redux";
import {
  getAvaliblePairs,
  getAvalibleTimeframes,
} from "../../../services/access";
import { TIME_CONVERT } from "../../../config";
import { v4 as uuidv4 } from "uuid";
import { setUuidCode } from "../../../redux/sessionActions";
import { setPair, setTimeframe, setNewPair } from "../../../redux/dataActions";

export default function SessionModal({ show, handleClose, handleSave }) {
  const dispatch = useDispatch();
  const [imageName, setImageName] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const sessions_list = useSelector((state) => state.session.sessions_list);
  const currentPair = useSelector((state) => state.data.current_pair);
  const currentTimeframe = useSelector((state) => state.data.timeframe);
  const [coin_pair, setCoinPair] = useState(currentPair);
  const [timeframe, setTimeframe] = useState(currentTimeframe);
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
    // dispatch(setPair(selectedPair));
    // const time = convertTimeframe(currentTimeframe)
    // localStorage.setItem("coin", selectedPair);
    // dispatch(setUuidCode(uuidv4()))
    // dispatch(setNewPair(selectedPair, time, 0))
  };

  const handleSelectTimeframe = (selectedTime) => {
    setTimeframe(selectedTime);
    // dispatch(setTimeframe(selectedTime));
    // const time = convertTimeframe(selectedTime)
    // localStorage.setItem("timeframe", time);
    // dispatch(setUuidCode(uuidv4()))
    // dispatch(setNewPair(currentPair, time, 0))
  };

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
        "The image name should only contain Latin letters, numbers, hyphens, and underscores."
      );
    } else {
      setShowAlert(false);
      setImageName(newName);
    }
  };

  const saveHandler = (name) => {
    const nameExists = sessions_list.some((session) => {
      return session.session_name === name;
    });

    if (nameExists) {
      setShowAlert(true);
      setAlertMessage(
        "The image name already exists. Please choose a different name."
      );
    } else {
      handleSave(imageName, coin_pair, convertTimeframe(timeframe));
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
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
              {coin_pair ? coin_pair : "BTCUSDT"}
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
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
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
