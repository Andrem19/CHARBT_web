import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Dropdown, Image, OverlayTrigger, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faP, faGear, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { TIME_CONVERT, COIN_CRYPTO_SET, TIMEFRAMES, FOREX, STOCK } from '../../config';
import { useNavigate } from "react-router-dom";
import SettingsModal from "./modals/settingsModal";
import AddChart from "./addChart";
import { v4 as uuidv4 } from 'uuid';
import { changeSettings } from "../../api/auth";
import { getAvaliblePairs, getAvalibleTimeframes } from '../../services/access';
import { ErrorBoundary } from "../errors/ErrorBoundary";
import { convertTimeframe } from "../../services/services";
import { setUuidCode } from "../../redux/sessionActions";
import {
    calculateMA,
    calculateRSI,
    calculateBollingerBands,
  } from "../../services/indicators";
import {
    setPair,
    setTimeframe,
    setNewPair,
    setShowTime,
    setPercPrice,
    setTpSl,
    setMarkersShow,
    setShowAddData,
    showPatterns,
    setShowTools,
  } from "../../redux/dataActions";

function TopMenu({ setZIndexDrawPanel, selectedIndicators, setSelectedIndicators }) {
    const dropdownRef = useRef(null);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const isMobile = useSelector(state => state.user.isMobile);
    const showTime = useSelector((state) => state.data.showTime);
    const percPrice = useSelector((state) => state.data.percPrice);
    const showTpsl = useSelector((state) => state.data.showTpsl);
    const showMarkers = useSelector((state) => state.data.showMarkers);
    const patterns = useSelector((state) => state.data.showPatterns);
    const tools = useSelector((state) => state.data.showTools);
    const list = useSelector((state) => state.data.list);
    const user = useSelector((state) => state.user.user);
    const theme = useSelector((state) => state.data.theme);
    const currentSession = useSelector(state => state.session.curent_session);
    const currentPosition = useSelector(state => state.session.current_position);
    const currentPair = useSelector((state) => state.data.current_pair);
    const currentTimeframe = useSelector((state) => state.data.timeframe);

    const [handleShowSettings, setHandleShowSettings] = useState(false)
    const [showTooltip, setShowTooltip] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    //===============Rights=======================
    let availableTimeframes = getAvalibleTimeframes(user);

    let availablePairs = getAvaliblePairs(user)

    //===============End Rights=======================

    //==================Top Menu==========================

  const setPriceScale = async () => {
    await changeSettings(navigate, {'settings': {'rightScale': !percPrice}})
    dispatch(setPercPrice(!percPrice))    
  }

  const setShowMarkers = async () => {
    await changeSettings(navigate, {'settings': {'showMarkers': !showMarkers}})
    dispatch(setMarkersShow(!showMarkers))    
  }
  const setShowPatterns = async () => {
    await changeSettings(navigate, {'settings': {'showPatterns': !patterns}})
    dispatch(showPatterns(!patterns))    
  }

  const setTools = async () => {
    await changeSettings(navigate, {'settings': {'showTools': !tools}})
    dispatch(setShowTools(!tools))    
  }

  const setShowTpsl = async () => {
    await changeSettings(navigate, {'settings': {'showTpsl': !showTpsl}})
    dispatch(setTpSl(!showTpsl))
  }

  const setTimeScale = async () => {
    await changeSettings(navigate, {'settings': {'timeScale': !showTime}})
    dispatch(setShowTime(!showTime)) 
  }

  const clickChouseCoin = () => {
    setZIndexDrawPanel(0);
  };

  const handleCheckboxChange = (event) => {
    event.stopPropagation();
    const { name, checked } = event.target;
    setSelectedIndicators((prevState) => ({ ...prevState, [name]: checked }));
  };

  useEffect(() => {
    window.localStorage.setItem(
      "indicators_settings",
      JSON.stringify(selectedIndicators)
    );
  }, [selectedIndicators]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setZIndexDrawPanel(9999);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelectPair = async (selectedPair) => {
    dispatch(setPair(selectedPair));
    const time = convertTimeframe(currentTimeframe)
    localStorage.setItem("coin", selectedPair);
    dispatch(setUuidCode(uuidv4()))
    dispatch(setNewPair(selectedPair, time, 0))
  };

  const handleSelectTimeframe = (selectedTime) => {
    dispatch(setTimeframe(selectedTime));
    const time = convertTimeframe(selectedTime)
    localStorage.setItem("timeframe", time);
    dispatch(setUuidCode(uuidv4()))
    dispatch(setNewPair(currentPair, time, 0))
  };
  const showAddData = useSelector(state => state.data.showAddData);
  const setAddDataShow = () => {
    dispatch(setShowAddData())
  }
  //==================End Top Menu==========================

    return (
        <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          marginBottom: "10px",
          marginRight: "10px",
        }}
      >
        <Dropdown
          onClick={clickChouseCoin}
          onSelect={handleSelectPair}
          className={theme}
          style={{ width: isMobile? "110px" : "140px", marginRight: "10px", }}
          
        >
          <Button
            disabled={true}
            variant="outline-success"
            id="dropdown-basic"
            className="w-100"
            style={{height: isMobile? "35px" : ""}}
          >
            <span style={{fontSize: isMobile? '13px' : '20px'}}>{currentPair ? currentPair : "BTCUSDT"}</span>
          </Button>

          <Dropdown.Menu>
            {COIN_CRYPTO_SET.map((pair, index) => (
              <Dropdown.Item
                key={index}
                eventKey={pair}
                active={pair === currentPair}
                disabled={!availablePairs.includes(pair)}
                style={{color: !availablePairs.includes(pair) ? 'grey' : theme === 'dark' ? 'white' : 'black'}}
              >
                {pair}
              </Dropdown.Item>
            ))}

            <Dropdown.Divider />
              {STOCK.map((pair, index) => (
                <Dropdown.Item
                  key={index}
                  eventKey={pair}
                  active={pair === currentPair}
                  disabled={!availablePairs.includes(pair)}
                  style={{color: !availablePairs.includes(pair) ? 'grey' : theme === 'dark' ? 'white' : 'black'}}
                >
                  {pair}
                </Dropdown.Item>
              ))}

              <Dropdown.Divider />
                {FOREX.map((pair, index) => (
                  <Dropdown.Item
                    key={index}
                    eventKey={pair}
                    active={pair === currentPair}
                    disabled={!availablePairs.includes(pair)}
                    style={{color: !availablePairs.includes(pair) ? 'grey' : theme === 'dark' ? 'white' : 'black'}}
                  >
                    {pair}
                  </Dropdown.Item>
                ))}
          </Dropdown.Menu>
        </Dropdown>

        <Dropdown
          onSelect={handleSelectTimeframe}
          className={theme}
          style={{ width: isMobile? "35px" : "50px", marginRight: 5 }}
        >
          <Button style={{height: isMobile? "35px" : ""}} disabled={true} variant="outline-success" id="dropdown-basic">
            <span style={{fontSize: isMobile? '13px' : '20px'}}>{currentTimeframe ? currentTimeframe : "1d"}</span>
          </Button>

          <Dropdown.Menu>
            {TIMEFRAMES.map((t, index) => (
              <Dropdown.Item
                key={index}
                eventKey={t}
                active={t === currentTimeframe}
                disabled={!availableTimeframes.includes(t)}
                style={{color: !availableTimeframes.includes(t) ? 'grey' : theme === 'dark' ? 'white' : 'black'}}
              >
                {t}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>

          { user.payment_status === 'premium-plus' && currentTimeframe != '1d' && list.length > 0 && !currentPosition && <div style={{marginLeft: 10, marginTop: 6, cursor: 'crosshair', color: '#14A44D'}} onMouseEnter={() => setShowTooltip(true)} onMouseLeave={() => setShowTooltip(false)}>
            <span style={{ marginLeft: 2 }}>
              {TIME_CONVERT[currentSession.additional_timaframe]}
            </span>
            <FontAwesomeIcon icon={faInfoCircle} />
            {showTooltip && (
              <div style={{ position: 'absolute', backgroundColor: 'white', border: '1px solid black', zIndex: 1000 }}>
                <ErrorBoundary>
                  <AddChart />
                </ErrorBoundary>
              </div>
            )}
          </div>}

        <div style={{ position: "relative", marginLeft: 15 }} ref={dropdownRef}>
          <Dropdown.Toggle
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(!isOpen);
            }}
            variant="outline-success"
            id="dropdown-basic"
            style={{height: isMobile? "35px" : ""}}
          >
            Indicators
          </Dropdown.Toggle>
          {isOpen && (
            <div
              style={{
                position: "absolute",
                backgroundColor: "white",
                border: "1px solid #ccc",
                zIndex: 9999,
                marginLeft: 10
              }}
            >
              {["MA", "RSI", "BOL"].map((indicator, index) => (
                <div
                  key={index}
                  style={{
                    background: "grey",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <label style={{ color: "black" }}>
                    <input
                      type="checkbox"
                      name={indicator}
                      checked={selectedIndicators[indicator]}
                      onChange={handleCheckboxChange}
                    />
                    <span style={{ marginLeft: "5px" }}>{indicator}</span>
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>

          {patterns && !isMobile && <div style={{ marginLeft: 10, marginTop: 7, color: '#14A44D' }}>
            <OverlayTrigger
            
              placement={isMobile? "left" : "right"}
              overlay={
                  <Image src="cheetsheat.png" alt="Patterns" style={{ width: '500px', height: 'auto', zIndex: 9999, border: '2px solid black', borderRadius: '10px' }} />
              }
            >
              <FontAwesomeIcon style={{fontSize: isMobile ? 12 : 16, marginRight: 5, color: '#14A44D' }} icon={faP} />
            </OverlayTrigger>
          </div>}

      <FontAwesomeIcon style={{fontSize: isMobile ? 15 : 20, marginLeft: 'auto', marginTop: 5, marginRight: 5, cursor: 'pointer'}} icon={faGear} onClick={() => setHandleShowSettings(true)} />
        <SettingsModal showSettings={handleShowSettings} setShowChart={setHandleShowSettings} setPriceMode={setPriceScale} setTimeLine={setTimeScale} setTpsl={setShowTpsl} setMarkers={setShowMarkers} setPatterns={setShowPatterns} setTools={setTools} />
      </div>
    )
}

export default TopMenu;