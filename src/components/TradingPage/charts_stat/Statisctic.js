import React, { useState, useEffect } from "react";
import { countSessionStatistic } from "../../../services/services";
import { Row, Col, Container, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useSelector, useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";
import { setMsg } from "../../../redux/userActions";
import { saveAs } from 'file-saver';
import { API_URL } from "../../../config";

const StatisticPage = ({ positions }) => {

const navigate = useNavigate();
const dispatch = useDispatch();
let sessionStat = countSessionStatistic(positions)
const user = useSelector((state) => state.user.user);
const currentSession = useSelector((state) => state.session.curent_session);

const saveCSV = async () => {
    const jwt = localStorage.getItem('jwt');
    if (!jwt) {
        console.error('No JWT found in local storage');
        return;
    }
    const response = await fetch(`${API_URL}/get_session_data?session_id=${currentSession.id}`, {
        headers: {
            'Authorization': `Bearer ${jwt}`
        }
    });
    if (!response.ok) {
        dispatch(setMsg(`${response.data.message}`));
    }
    const blob = await response.blob();
    saveAs(blob, `${currentSession.name}_${currentSession.coin_pair}_${currentSession.timeframe}.csv`);
};


return (
    <Container>
        <Col>
            <Row style={{ fontSize: 14}} >Session PnL: {sessionStat.pnl.toFixed(2)}</Row>
            <Row style={{ marginBottom: 3, fontSize: 14}} >Positions: {positions.length}</Row>
            <Row style={{ fontSize: 13}} >Profit positions: {sessionStat.profitCount}</Row>
            <Row style={{ fontSize: 13}} >Loss positions: {sessionStat.lossCount}</Row>
            <Row style={{ fontSize: 13}} >Buy positions: {sessionStat.buy}</Row>
            <Row style={{ fontSize: 13}} >Sell positions: {sessionStat.sell}</Row>
            <Row style={{ fontSize: 13}} >Success Positions: {sessionStat.successPositionPercent.toFixed(2)}%</Row>
            <Row style={{ fontSize: 13}} >Sum profit: ${sessionStat.sumProfit.toFixed(2)}</Row>
            <Row style={{ fontSize: 13}} >Sum loss: ${sessionStat.sumLoss.toFixed(2)}</Row>
            <Row style={{ fontSize: 13}} >Average profit: ${sessionStat.averageProfit.toFixed(2)}</Row>
            <Row style={{ fontSize: 13}} >Average loss: ${sessionStat.averageLoss.toFixed(2)}</Row>
            
            <hr />
            <Row style={{ marginBottom: 3,  fontSize: 14}} >Closing type statistics:  </Row>
            <Row style={{ fontSize: 13}} >Auto Close: {sessionStat.autoClose}</Row>
            <Row style={{ fontSize: 13}} >Take Profit: {sessionStat.takeProfitClose}</Row>
            <Row style={{ fontSize: 13}} >Stop Loss: {sessionStat.stopLossClose}</Row>
            <Row style={{ fontSize: 13}} >Manual: {sessionStat.manualClose}</Row>
            <hr />
            <Row style={{ fontSize: 13}} >Average Duration: {sessionStat.averageDuration}</Row>
        </Col>
        <div style={{ display: "flex", alignItems: "center" }}>
        <Button
            disabled={user.payment_status !== 'premium-plus'}
            onClick={saveCSV}
            variant="secondary"
            style={{
            marginTop: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "12px",
            height: "20px",
            width: "80px",
            }}
        >
            Save CSV
        </Button>
        <div style={{ marginTop: 10 }} >
        <OverlayTrigger
            placement="right"
            overlay={<Tooltip>
                {user.payment_status !== 'premium-plus' ? 'This feature is available in the Premium Plus package' : 'This function allows you to save the data of the candles before your taken positions in a csv file with the tags buy/sell and success/failure for further use for scientific purposes. 1,2...100,101(buy(1)/sell(0)),102(success(1)/failure(0))'}
              </Tooltip>}
        >
            <FontAwesomeIcon style={{ marginLeft: 5 }} icon={faInfoCircle} />
        </OverlayTrigger>
        </div>
        </div>
    </Container>

)
};

export default StatisticPage;