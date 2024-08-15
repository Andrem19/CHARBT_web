import React, { useState, useEffect } from "react";
import { countSessionStatistic } from "../../../services/services";
import { Row, Col, Container, Button, OverlayTrigger, Tooltip, Table } from 'react-bootstrap';
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
        <Table striped bordered hover style={{ maxWidth: '300px', maxHeight: '500px', overflowY: 'scroll' }}>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Value</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>1</td>
                    <td>Session PnL</td>
                    <td>{sessionStat.pnl.toFixed(2)}</td>
                </tr>
                <tr>
                    <td>2</td>
                    <td>Positions</td>
                    <td>{positions.length}</td>
                </tr>
                <tr>
                    <td>3</td>
                    <td>Profit positions</td>
                    <td>{sessionStat.profitCount}</td>
                </tr>
                <tr>
                    <td>4</td>
                    <td>Loss positions</td>
                    <td>{sessionStat.lossCount}</td>
                </tr>
                <tr>
                    <td>5</td>
                    <td>Buy positions</td>
                    <td>{sessionStat.buy}</td>
                </tr>
                <tr>
                    <td>6</td>
                    <td>Sell positions</td>
                    <td>{sessionStat.sell}</td>
                </tr>
                <tr>
                    <td>7</td>
                    <td>Success Positions</td>
                    <td>{sessionStat.successPositionPercent.toFixed(2)}%</td>
                </tr>
                <tr>
                    <td>8</td>
                    <td>Sum profit</td>
                    <td>${sessionStat.sumProfit.toFixed(2)}</td>
                </tr>
                <tr>
                    <td>9</td>
                    <td>Sum loss</td>
                    <td>${sessionStat.sumLoss.toFixed(2)}</td>
                </tr>
                <tr>
                    <td>10</td>
                    <td>Average profit</td>
                    <td>${sessionStat.averageProfit.toFixed(2)}</td>
                </tr>
                <tr>
                    <td>11</td>
                    <td>Average loss</td>
                    <td>${sessionStat.averageLoss.toFixed(2)}</td>
                </tr>
                <tr>
                    <td>12</td>
                    <td>Auto Close</td>
                    <td>{sessionStat.autoClose}</td>
                </tr>
                <tr>
                    <td>13</td>
                    <td>Take Profit</td>
                    <td>{sessionStat.takeProfitClose}</td>
                </tr>
                <tr>
                    <td>14</td>
                    <td>Stop Loss</td>
                    <td>{sessionStat.stopLossClose}</td>
                </tr>
                <tr>
                    <td>15</td>
                    <td>Manual</td>
                    <td>{sessionStat.manualClose}</td>
                </tr>
                <tr>
                    <td>16</td>
                    <td>Average Duration</td>
                    <td>{sessionStat.averageDuration}</td>
                </tr>
            </tbody>
        </Table>
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
            <div style={{ marginTop: 10 }}>
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
);
};

export default StatisticPage;