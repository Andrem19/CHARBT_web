import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Spinner } from "react-bootstrap";
import { convertTimestamp, biutyfyTOS } from "../../services/services";
import ChartModal from "./modals/chartModal";
import "./css/position_list.css";

function PositionsList() {
  

  const currentSession = useSelector((state) => state.session.curent_session);
  const timeframe = useSelector((state) => state.data.timeframe);
  const showTime = useSelector((state) => state.data.showTime);
  const isMobile = useSelector(state => state.user.isMobile);
  const [showChart, setShowChart] = useState(false);
  const [positionShow, setPositionShow] = useState(null);

  const showChartHandler = (position) => {
    setShowChart(true);
    setPositionShow(position);
  };

  return currentSession ? (
    <div>
      <ul
        className="list-group"
        style={{ maxHeight: isMobile ? "220px" : "300px" }}
      >
        {currentSession &&
          [...currentSession.positions]
          .filter(position => position.session_id === currentSession.id)
          .sort((a, b) => b.id - a.id)
          .reduce((unique, position) => {
            if (!unique.some(item => item.id === position.id)) {
              unique.push(position);
            }
            return unique;
          }, [])
          .map((position) => (
            <li
              key={position.profit}
              className={`list-group-item ${
                position.profit < 0
                  ? "list-group-item-danger"
                  : "list-group-item-success"
              }`}
              style={{
                display: "flex",
                justifyContent: "space-between",
                cursor: "pointer",
              }}
              onClick={() => {
                showChartHandler(position);
              }}
            >
              <span style={isMobile ? {fontSize: '7px', marginRight: 5} : {}}>{position.coin_pair}</span>
              {!isMobile && <span style={isMobile ? {fontSize: '10px', margin: 5} : {}}>{position.buy_sell === "Buy" ? "Buy" : "Sell"}</span>}
              <span style={isMobile ? {fontSize: '10px', marginRight: 5} : {}}>
                Price: (Open: {position.open_price} Close:{" "}
                {position.close_price})
              </span>
              {showTime && (
                <span style={isMobile ? {fontSize: '10px', marginRight: 5} : {}}>
                  Time( Open: {convertTimestamp(position.open_time, timeframe)}{" "}
                  Close: {convertTimestamp(position.close_time, timeframe)})
                </span>
              )}
              <span style={isMobile ? {fontSize: '10px', marginRight: 5} : {}}>{biutyfyTOS(position.type_of_close)}</span>
              <span style={isMobile ? {fontSize: '10px'} : {}}>
                Profit: {Number(position.profit).toFixed(2)}{" "}
                {position.buy_sell === "Buy" ? "▲" : "▼"}
              </span>
            </li>
          ))}
      </ul>

      {positionShow && (
        <ChartModal
          showChart={showChart}
          setShowChart={setShowChart}
          position={positionShow}
        />
      )}
    </div>
  ) : (
    <Spinner animation="border" role="status">
      <span className="sr-only">Loading...</span>
    </Spinner>
  );
}

export default PositionsList;
