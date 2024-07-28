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
        style={{ overflowY: "auto", maxHeight: "300px" }}
      >
        {currentSession &&
          [...currentSession.positions].reverse().map((position) => (
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
              <span>{position.coin_pair}</span>
              <span>{position.buy_sell === "Buy" ? "Buy" : "Sell"}</span>
              <span>
                Price: (Open: {position.open_price} Close:{" "}
                {position.close_price})
              </span>
              {showTime && (
                <span>
                  Time( Open: {convertTimestamp(position.open_time, timeframe)}{" "}
                  Close: {convertTimestamp(position.close_time, timeframe)})
                </span>
              )}
              {biutyfyTOS(position.type_of_close)}
              <span>
                Profit: {Number(position.profit).toFixed(2)}{" "}
                {position.profit < 0 ? "▼" : "▲"}
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
