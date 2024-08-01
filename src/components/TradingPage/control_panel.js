import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Row, Col, Dropdown } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { setCursor } from '../../redux/dataActions';
import { setCurrentPosition, addPositionToSession } from '../../redux/sessionActions';
import { setMsg } from '../../redux/userActions';
import { addPosition } from '../../api/data';
import { LineStyle } from 'lightweight-charts';
import { useNavigate } from "react-router-dom";
import { addMarker, setTakeProfitLine, setStopLossLine, resetStopLossLine, resetTakeProfitLine, loadList } from '../../redux/dataActions';
import { TIME_CONVERT_REVERSED, tradingPairs } from '../../config';
import { createPosition, calculateProfit, checkBalance, checkStopLoss, checkTakeProfit, checkSL, checkTP, getVolatility, convertPercentToPrice } from '../../services/poisition';

function ControlPanel() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    // const positionToClose = useRef(false);
    // const positionToClose = useSelector(state => state.data.positionToClose);
    const cursor = useSelector(state => state.data.cursor);
    const uuidCode = useSelector(state => state.session.uuidCode);
    const list = useSelector(state => state.data.list);
    const user = useSelector(state => state.user.user);
    const globalSettings = useSelector(state => state.user.globalSettings);
    const current_pair = useSelector(state => state.data.current_pair);
    const current_timeframe = useSelector(state => state.data.timeframe);
    const current_position = useSelector(state => state.session.current_position);
    const curent_session = useSelector(state => state.session.curent_session);
    const curent_session_pnl = useSelector(state => state.session.curent_session_pnl);
    const isMobile = useSelector(state => state.user.isMobile);
    const [amount, setAmount] = useState(20);
    const [showTPSL, setShowTPSL] = useState(false);
    const [autoClose, setAutoClose] = useState(false);
    const [autoCloseSteps, setAutoCloseSteps] = useState(5);
    const [inCicle, setInCicle] = useState(false);
    const [cursorAutoClose, setCursorAutoClose] = useState(0)
    const [positionToClose, setPositionToClose] = useState(false)
    

    const [resultVars, setResultVars] = useState({});
    const [step, setStep] = useState(1);
    const [takeProfit, setTakeProfit] = useState(null);
    const [stopLoss, setStopLoss] = useState(null);
    const [takeProfitPerc, setTakeProfitPerc] = useState(null);
    const [stopLossPerc, setStopLossPerc] = useState(null);
    const [addTpsl, setAddTpsl] = useState(false);
    const [tpslType, setTpslType] = useState('')

    const handleTakeProfitChange = (event) => {
      if (tpslType === 'price') {
        setTakeProfit(event.target.value);
      } else if (tpslType === 'percent') {
        setTakeProfitPerc(event.target.value);
        setTakeProfit(1);
      }
  };
  
  

    const handleStopLossChange = (event) => {
      if (tpslType === 'price') {
        setStopLoss(event.target.value);
      } else if (tpslType === 'percent') {
        setStopLossPerc(event.target.value);
        setStopLoss(1);
      }
        
    };

    const handleSelect = (event) => {
      const value = event.target.value;
      if (value === 'off') {
          setAddTpsl(false);
          setShowTPSL(false);
      } else {
          setAddTpsl(true);
          setShowTPSL(true);
          setTpslType(value)
      }
  };
    const hendleCheckboxAutoClose = () => {
      setAutoClose(!autoClose);
    };

    const hendleAutoCloseCandle = (event) => {
      if (Number(event.target.value) <= 10){
      setAutoCloseSteps(Number(event.target.value));
      } else {
        dispatch(setMsg("Step can't be biger then 10"))
      }
    };

    const handleQuantity = (event) => {
      setAmount(Number(event.target.value));
    }

    const handleStepChange = (event) => {
      if (Number(event.target.value) <= 5){
        setStep(Number(event.target.value));
      } else {
        dispatch(setMsg("Step can't be biger then 5"))
      }
    };

    const changeTP = () => {
      let tp = 0
      if (tpslType === 'percent' && current_position) {
        const afterDot = tradingPairs[current_pair];
        let tpslconverted = convertPercentToPrice(list[cursor-1].close,  takeProfitPerc, stopLossPerc, current_position.buy_sell, afterDot)
        if (tpslconverted.tp != null && tpslconverted.tp > 0) {
          setTakeProfit(tpslconverted.tp)
          tp = tpslconverted.tp
        }
      }
      
    if (takeProfit && addTpsl) {
      const value = tpslType === 'percent' ? tp : takeProfit;
      const numbersAfterDot = tradingPairs[current_pair];
      const regex = new RegExp(`^\\d+(\\.\\d{1,${numbersAfterDot}})?$`);
  
      if (regex.test(value)) { 
        try {
          tp = parseFloat(value)
        } catch {
          dispatch(setMsg('Incorrect Value. Please enter a number that does not have more than ' + numbersAfterDot + ' decimal places.'))
          setTakeProfit(null)
          return
        }
      } else {
        dispatch(setMsg('Incorrect Value. Please enter a number that does not have more than ' + numbersAfterDot + ' decimal places.'));
        setTakeProfit(null)
        return
      }
      if (!checkTP(tp, list[cursor].close, current_position.buy_sell)) {
        dispatch(setMsg('In long position take profit should be higher then current price. In short position take profit shoul be lower then current price'));
        setTakeProfit(null)
        return
      }

      const takeLine = {
        price: tp,
        color: 'green',
        lineWidth: 1,
        lineStyle: LineStyle.Dashed,
        axisLabelVisible: true,
        title: 'Take Profit',
      }
      dispatch(resetTakeProfitLine())
      setTimeout(() => {
        dispatch(setTakeProfitLine(takeLine));
      }, 0);
    }

    let newPosition = {...current_position}
    newPosition.take_profit = tp
    dispatch(setCurrentPosition(newPosition))
    }

    const changeSL = () => {
      let sl = 0
      if (tpslType === 'percent' && current_position) {
        const afterDot = tradingPairs[current_pair];
        let tpslconverted = convertPercentToPrice(list[cursor-1].close,  takeProfitPerc, stopLossPerc, current_position.buy_sell, afterDot)
        
        if (tpslconverted.sl != null && tpslconverted.sl > 0) {
          setStopLoss(tpslconverted.sl)
          sl = tpslconverted.sl
        }
        
      }
      
      if (stopLoss && addTpsl) {
        const value = tpslType === 'percent'? sl : stopLoss;
        const numbersAfterDot = tradingPairs[current_pair];
        const regex = new RegExp(`^\\d+(\\.\\d{1,${numbersAfterDot}})?$`);
        
        if (regex.test(value)) { 
          try {
            sl = parseFloat(value)
          } catch {
            dispatch(setMsg('Incorrect Value. Please enter a number that does not have more than ' + numbersAfterDot + ' decimal places.'))
            setStopLoss(null)
            return
          }
        } else {
          dispatch(setMsg('Incorrect Value. Please enter a number that does not have more than ' + numbersAfterDot + ' decimal places.'));
          setStopLoss(null)
          return
        }
        if (!checkSL(sl, list[cursor].close, current_position.buy_sell)) {
          dispatch(setMsg('In long position stop loss should be lower then current price. In short position stop loss shoul be higher then current price'));
          setStopLoss(null)
          return
        }

      const stopLine = {
        price: sl,
        color: 'red',
        lineWidth: 1,
        lineStyle: LineStyle.Dashed,
        axisLabelVisible: true,
        title: 'Stop Loss',
      }
      dispatch(resetStopLossLine())
      setTimeout(() => {
      dispatch(setStopLossLine(stopLine))
    }, 0);
    }

    let newPosition = {...current_position}
    newPosition.stop_loss = sl
    dispatch(setCurrentPosition(newPosition))
    }
    



    const openPosition = async (Buy_Sell) => {
      if (curent_session.positions.length >= globalSettings.position_in_session) {
        dispatch(setMsg('You have reached the limit on the number of positions in the session. Create a new session.'))
        return
      }
      setPositionToClose(false)
      const candel = list[cursor-1]
      if (amount>curent_session.balance) {
        dispatch(setMsg('Your balance is not enough'))
      }
      let tp = 0
      let sl = 0
      if (tpslType === 'percent') {
        const afterDot = tradingPairs[current_pair];
        let tpslconverted = convertPercentToPrice(list[cursor-1].close, takeProfitPerc, stopLossPerc, Buy_Sell, afterDot)
        if (tpslconverted.tp != null && tpslconverted.tp > 0) {
          setTakeProfit(tpslconverted.tp)
          tp = tpslconverted.tp
        }
        if (tpslconverted.sl != null && tpslconverted.sl > 0) {
          setStopLoss(tpslconverted.sl)
          sl = tpslconverted.sl
        }
      }
      if (stopLoss && addTpsl) {
        const value = tpslType === 'percent' ? sl : stopLoss;
        const numbersAfterDot = tradingPairs[current_pair];
        const regex = new RegExp(`^\\d+(\\.\\d{1,${numbersAfterDot}})?$`);
        
        if (regex.test(value)) { 
          try {
            sl = parseFloat(value)
          } catch {
            dispatch(setMsg('Incorrect Value. Please enter a number that does not have more than ' + numbersAfterDot + ' decimal places.'))
            setStopLoss(null)
            return
          }
        } else {
          dispatch(setMsg('Incorrect Value. Please enter a number that does not have more than ' + numbersAfterDot + ' decimal places.'));
          setStopLoss(null)
          return
        }
        if (!checkSL(sl, list[cursor-1].close, Buy_Sell)) {
          dispatch(setMsg('Stop loss should be within 5% of the current price: lower for long positions and higher for short positions.'));
          // setStopLoss(null)
          return
        }

      const stopLine = {
        price: sl,
        color: 'red',
        lineWidth: 1,
        lineStyle: LineStyle.Dashed,
        axisLabelVisible: true,
        title: 'Stop Loss',
      }
      dispatch(setStopLossLine(stopLine))
    }
    
    if (takeProfit && addTpsl) {
      const value = tpslType === 'percent' ? tp : takeProfit;
      const numbersAfterDot = tradingPairs[current_pair];
      const regex = new RegExp(`^\\d+(\\.\\d{1,${numbersAfterDot}})?$`);
  
      if (regex.test(value)) { 
        try {
          tp = parseFloat(value)
        } catch {
          dispatch(setMsg('Incorrect Value. Please enter a number that does not have more than ' + numbersAfterDot + ' decimal places.'))
          setTakeProfit(null)
          return
        }
      } else {
        dispatch(setMsg('Incorrect Value. Please enter a number that does not have more than ' + numbersAfterDot + ' decimal places.'));
        setTakeProfit(null)
        return
      }
      if (!checkTP(tp, list[cursor-1].close, Buy_Sell)) {
        dispatch(setMsg('Take profit should be within 5% of the current price: higher for long positions and lower for short positions.'));
        // setTakeProfit(null)
        return
      }

      const takeLine = {
        price: tp,
        color: 'green',
        lineWidth: 1,
        lineStyle: LineStyle.Dashed,
        axisLabelVisible: true,
        title: 'Take Profit',
      }
      dispatch(setTakeProfitLine(takeLine))
    }

      let position = createPosition(user.id, TIME_CONVERT_REVERSED[current_timeframe], autoCloseSteps, amount, Buy_Sell, candel.close, candel.time, current_pair, curent_session.id, tp, sl)
      
      position['volatility'] = getVolatility(current_timeframe, list.slice(cursor-5, cursor))
      
      const marker = {
        time: candel.time,
        position: Buy_Sell === 'Buy' ? 'belowBar' : 'aboveBar',
        color: Buy_Sell === 'Buy' ? 'green' : 'red',
        shape: Buy_Sell === 'Buy' ? 'arrowUp' : 'arrowDown',
      }
      dispatch(addMarker(marker))
      dispatch(setCurrentPosition(position))
      
      if (autoClose) {
        setCursorAutoClose(cursor+autoCloseSteps)
        let toBorder = cursor+autoCloseSteps

          for (let i = cursor; i < cursor+autoCloseSteps; i++) {
            let pnl = calculateProfit(position.amount, position.open_price, position.buy_sell == 'Buy' ? list[cursor-1].low : list[cursor-1].high, position.buy_sell);
            const balance_invalid = checkBalance(pnl, curent_session.balance+curent_session_pnl);
            if (balance_invalid) {
              toBorder = i+1
              break
            }

            if (stopLoss && addTpsl){
              let price = position.buy_sell === 'Buy' ? list[i].low : list[i].high;
              const stls = checkStopLoss(position.stop_loss, price, position.buy_sell);
              if (stls) {
                toBorder = i+1
                break
              }
            }
            if (takeProfit && addTpsl){
              let price = position.buy_sell === 'Buy' ? list[i].high : list[i].low;
              const tapr = checkTakeProfit(position.take_profit, price, position.buy_sell);
              
              if (tapr) {
                toBorder = i+1
                break
              }
            }
        }
        setInCicle(true)
        for (let i = cursor+1; i <= toBorder; i++) {
          await new Promise(resolve => setTimeout(resolve, 500));
          dispatch(setCursor(i));
        } 
        setInCicle(false)
      }
    }

    const updatePositionAndDispatch = async (current_position) => {
      let newPosition = {
          ...current_position,
          close_price: resultVars['close_price'],
          profit: resultVars['profit'],
          close_time: resultVars['close_time'],
          type_of_close: resultVars['type_of_close'],
          data_ident: uuidCode
      };
      const marker = {
        time: resultVars['close_time'],
        position: current_position.buy_sell === 'Buy' ? 'aboveBar' : 'belowBar',
        color: current_position.buy_sell === 'Buy' ? 'red' : 'green',
        shape: current_position.buy_sell === 'Buy' ? 'arrowDown' : 'arrowUp',
      }
      dispatch(addMarker(marker))
      const response = await addPosition(navigate, curent_session.id, newPosition)
      if (response['status']) {
        newPosition['id'] = response['id']
        
        dispatch(addPositionToSession(newPosition));
        dispatch(setCurrentPosition(null))
      }
      dispatch(resetStopLossLine())
      dispatch(resetTakeProfitLine())
      if (list.length-21 < cursor) {
        dispatch(loadList(current_pair, TIME_CONVERT_REVERSED[current_timeframe], list[list.length-1].time *1000))
      }
  };

    useEffect(() => {
      let result_vars = {...resultVars};
      if (current_position !== null) {
        let pnl = calculateProfit(current_position.amount, current_position.open_price, list[cursor-1].close, current_position.buy_sell);

        if (current_position.stop_loss && !positionToClose && addTpsl) {
          const price = current_position.buy_sell === 'Buy' ? list[cursor-1].low : list[cursor-1].high;
          const stls = checkStopLoss(current_position.stop_loss, price, current_position.buy_sell);
          if (stls) {
            setPositionToClose(true)
            pnl = calculateProfit(current_position.amount, current_position.open_price, current_position.stop_loss, current_position.buy_sell);
            result_vars['close_price'] = current_position.stop_loss;
            result_vars['profit'] = pnl;
            result_vars['close_time'] = list[cursor-1].time;
            result_vars['type_of_close'] = 'stop_loss';
            setResultVars(result_vars);
            return
          }
        }

        if (!positionToClose) {
          pnl = calculateProfit(current_position.amount, current_position.open_price, current_position.buy_sell == 'Buy' ? list[cursor-1].low : list[cursor-1].high, current_position.buy_sell);
          const balance_invalid = checkBalance(pnl, curent_session.balance+curent_session_pnl);
          if (balance_invalid) {
            setPositionToClose(true)
            dispatch(setMsg('Balance less then 0. Position liquidation.'))
            result_vars['close_price'] = list[cursor-1].close;
            result_vars['profit'] = pnl;
            result_vars['close_time'] = list[cursor-1].time;
            result_vars['type_of_close'] = 'liquidation';
            setResultVars(result_vars);
            return
          }

        }
        
        if (current_position.take_profit && !positionToClose && addTpsl) {
          const price = current_position.buy_sell === 'Buy' ? list[cursor-1].high : list[cursor-1].low;
          const tapr = checkTakeProfit(current_position.take_profit, price, current_position.buy_sell);
          if (tapr) {
            setPositionToClose(true)
            pnl = calculateProfit(current_position.amount, current_position.open_price, current_position.take_profit, current_position.buy_sell);
            result_vars['close_price'] = current_position.take_profit;
            result_vars['profit'] = pnl;
            result_vars['close_time'] = list[cursor-1].time;
            result_vars['type_of_close'] = 'take_profit';
            setResultVars(result_vars);
            return
          }
        }

        if (!positionToClose) {
          pnl = calculateProfit(current_position.amount, current_position.open_price, list[cursor-1].close, current_position.buy_sell);
          let newPosition = {...current_position, profit: pnl.toFixed(2)};
          dispatch(setCurrentPosition(newPosition))
        }
        if (cursor === cursorAutoClose && !positionToClose && autoClose) {
          const pnl = calculateProfit(current_position.amount, current_position.open_price, list[cursor-1].close, current_position.buy_sell);
          result_vars['close_price'] = list[cursor-1].close;
          result_vars['profit'] = pnl;
          result_vars['close_time'] = list[cursor-1].time;
          result_vars['type_of_close'] = 'auto_close';
          setResultVars(result_vars);
          setPositionToClose(true)

        }
      }
  }, [cursor]);

  useEffect(() => {
    if (positionToClose) {
      updatePositionAndDispatch(current_position, resultVars);
    }
  }, [positionToClose]);

    const closePosition = () => {
      let result_vars = {...resultVars};
      const pnl = calculateProfit(current_position.amount, current_position.open_price, list[cursor-1].close, current_position.buy_sell);
      result_vars['close_price'] = list[cursor-1].close;
      result_vars['profit'] = pnl;
      result_vars['close_time'] = list[cursor-1].time;
      result_vars['type_of_close'] = 'manual';
      setResultVars(result_vars);
      setPositionToClose(true)
    }

    const buyClick = async (event) => {
      await openPosition('Buy')
    };
    const sellClick = async (event) => {
      await openPosition('Sell')
    };

  const nextHandler = async () => {
    if (autoClose && current_position) {
      let toBorder = cursor+autoCloseSteps
      setCursorAutoClose(cursor+autoCloseSteps)
        if (current_position.stop_loss !== 0 || current_position.take_profit !== 0){
          for (let i = cursor; i < cursor+autoCloseSteps; i++) {
            let pnl = calculateProfit(current_position.amount, current_position.open_price, current_position.buy_sell == 'Buy' ? list[cursor-1].low : list[cursor-1].high, current_position.buy_sell);
            const balance_invalid = checkBalance(pnl, curent_session.balance+curent_session_pnl);
            if (balance_invalid) {
              toBorder = i+1
              break
            }

              if (stopLoss && addTpsl){
                let price = current_position.buy_sell === 'Buy' ? list[i].low : list[i].high;
                const stls = checkStopLoss(current_position.stop_loss, price, current_position.buy_sell);
                if (stls) {
                  toBorder = i+1
                  break
                }
              }
              if (takeProfit && addTpsl){
                let price = current_position.buy_sell === 'Buy' ? list[i].high : list[i].low;
                const tapr = checkTakeProfit(current_position.take_profit, price, current_position.buy_sell);
                
                if (tapr) {
                  toBorder = i+1
                  break
                }
              }
            }
        }
        setInCicle(true)
        for (let i = cursor+1; i <= toBorder; i++) {
          await new Promise(resolve => setTimeout(resolve, 500));
          dispatch(setCursor(i));
        } 
        setInCicle(false)
    } else {
    for (let i = 0; i < step; i++) {
        await new Promise(resolve => setTimeout(resolve, 500));
        dispatch(setCursor(cursor + i + 1));
      }
    }

  };


    return (
        <Container fluid >
            <Form >
                <Form.Group controlId="quantity">
                    <Form.Label>Quantity (USDT)</Form.Label>
                    <Form.Control value={amount} onChange={handleQuantity} type="number" placeholder="Enter quantity" style={{ WebkitAppearance: "none", margin: "0" }} />
                </Form.Group>

                <Form.Group controlId="tpsl" style={{ alignSelf: 'flex-start', marginTop: '15px', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', width: '30%' }}>
                <Form.Label style={{ fontSize: '12px' }}>TPSL</Form.Label>
                <Form.Control as="select" onChange={handleSelect} style={{ WebkitAppearance: "menulist" }}>
                    <option value="off">Off</option>
                    <option value="percent">Percent</option>
                    <option value="price">Price</option>
                </Form.Control>
            </div>
            <div style={{ fontSize: isMobile ? '12px' : '15px', width: '30%' }}>
                <Form.Check type="checkbox" label="Auto Close" onChange={hendleCheckboxAutoClose} />
            </div>
            {autoClose && (
                <Form.Control as="select" value={autoCloseSteps} onChange={hendleAutoCloseCandle} style={{ width: '30%', WebkitAppearance: "menulist",  marginTop: '25px', display: 'flex' }}>
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                    <option>6</option>
                    <option>7</option>
                    <option>8</option>
                    <option>9</option>
                    <option>10</option>
                </Form.Control>
            )}
            {!autoClose && <div style={{ width: '30%' }}></div>}
        </Form.Group>

                {showTPSL && (
                    <>
                        <Form.Group controlId="takeProfit">
                            <Form.Label>Take Profit ({tpslType})</Form.Label>
                            <Row>
                              <Col style={{ paddingRight: '7.5px' }}>
                                <Form.Control value={tpslType === 'percent' ? takeProfitPerc : takeProfit} type="text"  placeholder={tpslType === 'percent' ? "1.25" : "Enter take profit"} onChange={handleTakeProfitChange} />
                              </Col>
                              <Col style={{ paddingLeft: '7.5px' }}>
                                <Button disabled={!current_position || autoClose} onClick={changeTP} variant="secondary" style={{ width: '100%' }}>Add/Change TP</Button>
                              </Col>
                            </Row>
                        </Form.Group>

                        <Form.Group controlId="stopLoss">
                            <Form.Label>Stop Loss ({tpslType})</Form.Label>
                            <Row style={{ marginBottom: 20 }}>
                              <Col style={{ paddingRight: '7.5px' }}>
                                <Form.Control value={tpslType === 'percent' ? stopLossPerc : stopLoss} type="text" placeholder={tpslType === 'percent' ? "0.85" : "Enter stop loss"} onChange={handleStopLossChange} />
                              </Col>
                              <Col style={{ paddingLeft: '7.5px' }}>
                                <Button disabled={!current_position || autoClose} onClick={changeSL} variant="secondary" style={{ width: '100%' }}>Add/Change SL</Button>
                              </Col>
                            </Row>
                        </Form.Group>
                    </>
                )}
                

                <Row style={{ marginTop: '9px' }}>
                    <Col style={{ paddingRight: '7.5px' }}>
                        <Button disabled={current_position}  onClick={buyClick} variant="success" style={{ width: '100%' }}>Buy</Button>
                    </Col>
                    <Col style={{ paddingLeft: '7.5px' }}>
                        <Button disabled={current_position} onClick={sellClick} variant="danger" style={{ width: '100%' }}>Sell</Button>
                    </Col>
                    <Col style={{ paddingLeft: '7.5px' }}>
                        <Button disabled={autoClose || !current_position} onClick={closePosition} variant="warning" style={{ width: '100%' }}>Close</Button>
                    </Col>
                </Row>

                <Row style={{ marginTop: '12px' }}>
                    <Col style={{ paddingRight: '7.5px' }}>
                        <Form.Group controlId="step">
                            <Form.Label>Step</Form.Label>
                            <Form.Control as="select" value={step} onChange={handleStepChange} style={{ WebkitAppearance: "menulist" }}>
                                <option>1</option>
                                <option>2</option>
                                <option>3</option>
                                <option>4</option>
                                <option>5</option>
                            </Form.Control>
                        </Form.Group>
                    </Col>
                    <Col style={{ paddingLeft: '7.5px' }}>
                        <Button variant="secondary" disabled={inCicle} onClick={nextHandler} style={{ width: '100%', marginTop: '30px' }}>Next</Button>
                    </Col>
                </Row>
            </Form>
        </Container>
    );
}

export default ControlPanel;
