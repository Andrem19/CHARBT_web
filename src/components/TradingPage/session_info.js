import { useSelector, useDispatch } from "react-redux";
import React, { useEffect, useState } from "react";
import {
  Container,
  Form,
  Row,
  Col,
  Spinner,
  Button,
  Modal,
} from "react-bootstrap";
import Select from "react-select";
import { TIME_CONVERT } from "../../config";
import { countSessionStatistic } from "../../services/services";
import SessionModal from "./modals/sessionModal";
import { createSession, getSession, deleteSession } from "../../api/data";
import {
  addSessionToList,
  setCurrentSession,
  removeOneSession,
  setCurrentSessionPnl,
  setIsSelfData
} from "../../redux/sessionActions";
import { clearMarkers, setCursor, setSelfData, setList, setAddList, setPrevCursor } from "../../redux/dataActions";
import { SessionOption } from "./sessionOption";
import { useNavigate } from "react-router-dom";
import { setUuidCode, resetPositions } from "../../redux/sessionActions";
import { getColor } from "../../services/poisition";
import { v4 as uuidv4 } from "uuid";
import { setPair, setTimeframe, setNewPair } from "../../redux/dataActions";
import StatisticModal from "./modals/statModal";
import { setMsg } from "../../redux/userActions";
import { getDefaultSessionData } from "../../services/services";

function SessionInfo() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.data.theme);
  const sessions = useSelector((state) => state.session.sessions_list || [getDefaultSessionData()]);
  const user = useSelector((state) => state.user.user);
  const currentSession = useSelector((state) => state.session.curent_session || getDefaultSessionData());
  const current_position = useSelector(
    (state) => state.session.current_position
  );
  const [sessionStat, setSessionStat] = useState(
    countSessionStatistic(currentSession.positions)
  );
  const [show, setShow] = useState(false);
  const [font, setFont] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState(null);
  const [curentPositionPnl, setCurentPositionPnl] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSave = async (name, coin_pair, timeframe, is_self_data, data, decimalPlaces) => {
    if (!user) {
      dispatch(setMsg('You need to Sign In to use all functionality'))
      return
    }
    const result = await createSession(navigate, name, coin_pair, timeframe, is_self_data, data.name, data.id, decimalPlaces);
    if (result.result) {
      dispatch(setList([]))
      dispatch(setAddList([]))
      dispatch(setPrevCursor(null))
      dispatch(addSessionToList(result.session));
      dispatch(resetPositions());
      dispatch(setCurrentSession(result.session));

      dispatch(clearMarkers());
      dispatch(setPair(result.session.coin_pair));
      dispatch(setTimeframe(is_self_data? '1h' : TIME_CONVERT[result.session.timeframe]));
      dispatch(setUuidCode(uuidv4()));
      dispatch(setIsSelfData(result.session.is_self_data))
      if (result.session.is_self_data) {
        dispatch(setSelfData(navigate, result.session.selfDataId, 100))
      } else {
        dispatch(setNewPair(result.session.coin_pair, result.session.timeframe, 0, 100));
      }
      
    }
    handleClose();
  };

  const handleSessionChange = async (selectedOption) => {
    if (!user) {
      dispatch(setMsg('You need to Sign In to use all functionality'))
      return
    }
    const result = await getSession(navigate, selectedOption.value);
    if (result) {
      dispatch(setList([]))
      dispatch(setAddList([]))
      dispatch(setPrevCursor(null))
      dispatch(resetPositions());
      dispatch(setCurrentSession(result));

      dispatch(clearMarkers());
      dispatch(setPair(result.coin_pair));
      dispatch(setTimeframe(result.is_self_data? '1h' : TIME_CONVERT[result.timeframe]));
      dispatch(setUuidCode(uuidv4()));
      dispatch(setIsSelfData(result.is_self_data))//???
      if (result.is_self_data) {
        dispatch(setSelfData(navigate, result.selfDataId, result.cursor))
      } else {
        dispatch(setNewPair(result.coin_pair, result.timeframe, 0, 100));
      }
    }
  };

  const handleDeleteClick = (event, sessionId) => {
    event.stopPropagation();
    setShowDeleteModal(true);
    setSessionToDelete(sessionId);
  };

  const options = sessions.map((session) => ({
    value: session.id,
    label: (
      <SessionOption
        session={session}
        currentSessionId={currentSession.id}
        handleDeleteClick={handleDeleteClick}
        sessionsCount={sessions.length}
        currentSessionPnl={sessionStat.pnl}
      />
    ),
    balance: session.balance,
  }));

  useEffect(() => {
    if (!user) {
      return
    }
    let result = countSessionStatistic(currentSession.positions);
    dispatch(setCurrentSessionPnl(sessionStat.pnl.toFixed(2)));
    setSessionStat(result);
  }, [currentSession]);

  useEffect(() => {
    if (current_position !== null && current_position.profit != 0) {
      setCurentPositionPnl(current_position.profit);
      setFont(true);
      const timer = setTimeout(() => {
        setFont(false);
      }, 400);
      return () => clearTimeout(timer);
    } else {
      setCurentPositionPnl(0);
    }
  }, [current_position]);

  const handleConfirmDelete = async () => {
    if (!user) {
      dispatch(setMsg('You need to Sign In to use all functionality'))
      return
    }
    // Закрыть модальное окно
    setShowDeleteModal(false);

    // Отправить запрос на сервер для удаления сессии
    const response = await deleteSession(navigate, sessionToDelete);
    if (response.result) {
      dispatch(removeOneSession(sessionToDelete));
      if (sessionToDelete === currentSession.id) {
      
      const result = await getSession(navigate, response.current_session_id);
      if (result) {
        dispatch(setList([]))
        dispatch(setAddList([]))
        dispatch(setPrevCursor(null))
        dispatch(resetPositions());
        dispatch(setCurrentSession(result));

        dispatch(clearMarkers());
        dispatch(setPair(result.coin_pair));
        dispatch(setTimeframe(TIME_CONVERT[result.timeframe]));
        dispatch(setUuidCode(uuidv4()));
        dispatch(setIsSelfData(result.is_self_data))
        if (result.is_self_data) {
          dispatch(setSelfData(navigate, result.selfDataId, result.cursor))
        } else {
          dispatch(setNewPair(result.coin_pair, result.timeframe, 0, 100));
        }
        
      }
    }
    }
  };

  const openStatistics = () => {
    if (currentSession.positions.length <= 3) {
      dispatch(setMsg("Insufficient data to calculate statistics"));
    } else {
      setShowModal(true);
    }
  };

  return currentSession && sessions ? (
    <Container fluid>
      <SessionModal
        show={show}
        handleClose={handleClose}
        handleSave={handleSave}
      />

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this session?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      <StatisticModal showModal={showModal} setShowModal={setShowModal} />

      <Form >
        <Form.Group controlId="sessionSelect">
          <Form.Label>Choose/Create Session</Form.Label>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ flexGrow: 1, marginRight: 10 }}>
              <Select
                value={options.find(
                  (option) => option.value === currentSession.id
                )}
                isSearchable={false}
                options={options}
                defaultValue={options.find(
                  (option) => option.value === currentSession.id
                )}
                styles={{
                  container: (provided) => ({ ...provided, width: "100%" }),
                }}
                onChange={handleSessionChange}
              />
            </div>
            <Button
              disabled={!user || user.payment_status === "default"}
              variant="success"
              onClick={handleShow}
            >
              <i className="bi bi-plus-square"></i>
            </Button>
          </div>
        </Form.Group>
        <Col
          style={{
            display: "flex",
            flexDirection: "column",
            marginLeft: 15,
            marginTop: 10,
          }}
        >
          <Row style={{ fontSize: 14 }}>
            Session PnL: {sessionStat.pnl.toFixed(2)}
          </Row>
          <Row style={{ fontSize: 14, whiteSpace: "nowrap" }}>
            Current Position PnL:{" "}
            <Col
              style={{
                fontSize: current_position ? (font ? 18 : 14) : 14,
                fontWeight: current_position
                  ? font
                    ? "bold"
                    : "normal"
                  : "normal",
                color: getColor(theme, curentPositionPnl),
              }}
            >{`${
              curentPositionPnl < 0 ? "-" : curentPositionPnl > 0 ? "+" : ""
            }${Math.abs(curentPositionPnl)}`}</Col>
          </Row>

          <hr />

          <Row style={{ marginBottom: 1, fontSize: 13 }}>
            Positions: {currentSession.positions.length}
          </Row>
          <Row style={{ fontSize: 13 }}>
            Success Positions: {sessionStat.successPositionPercent.toFixed(2)}%
          </Row>
          <Row style={{ fontSize: 13 }}>
            Sum profit: ${sessionStat.sumProfit.toFixed(2)}
          </Row>
          <Row style={{ fontSize: 13 }}>
            Sum loss: ${sessionStat.sumLoss.toFixed(2)}
          </Row>
          <hr />
          <Button
            disabled={!user || user.payment_status !== 'premium-plus' && user.payment_status !== 'default' && user.payment_status !== 'premium'}
            onClick={openStatistics}
            variant="secondary"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "50px",
              fontSize: "12px",
              height: "20px",
              width: "150px",
            }}
          >
            Detailed statistics
          </Button>
        </Col>
      </Form>
    </Container>
  ) : (
    <Spinner animation="border" role="status">
      <span className="sr-only">Loading...</span>
    </Spinner>
  );
}

export default SessionInfo;
