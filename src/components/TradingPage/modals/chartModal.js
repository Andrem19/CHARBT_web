import React, { useEffect, useRef, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { setMsg } from "../../../redux/userActions";
import { createChart } from "lightweight-charts";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getPositionHistory,
  selfPositionHistory,
  uploadScreenshot,
} from "../../../api/data";
import { convertTimeframe } from "../../../services/services";
import { tradingPairs } from "../../../config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import { TIME_CONVERT } from "../../../config";
import { addScreenshot } from "../../../redux/dataActions";
import ImageModal from "./imageModal";

const ChartModal = ({ showChart, setShowChart, position }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleClose = () => {
    setShowChart(false);
    setlistData([]);
    chartContainerRef.current = null;
    volumeSeriesRef.current = null;
    lineSeriesRef.current = null;
  };
  const showTime = useSelector((state) => state.data.showTime);
  const percPrice = useSelector((state) => state.data.percPrice);
  const isSelfData = useSelector((state) => state.session.isSelfData);
  const currentTimeframe = useSelector((state) => state.data.timeframe);
  const theme = useSelector((state) => state.data.theme);
  const chartContainerRef = useRef(null);
  const volumeSeriesRef = useRef(null);
  const lineSeriesRef = useRef(null);
  const [listData, setlistData] = useState([]);
  const [chartGl, setChartGl] = useState(null);
  const currentPair = useSelector((state) => state.data.current_pair);

  const [show, setShow] = useState(false);

  const handleCloseImage = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSaveImage = async (imageName) => {
    let screenshot = chartGl.takeScreenshot();
    const screenshot_url = await uploadScreenshot(
      navigate,
      screenshot,
      imageName
    );
    dispatch(addScreenshot(screenshot_url));
    handleClose();
  };

  const saveImage = () => {
    handleShow();
  };

  const markers = [
    {
      time: position.open_time,
      position: position.buy_sell === "Buy" ? "belowBar" : "aboveBar",
      color: position.buy_sell === "Buy" ? "green" : "red",
      shape: position.buy_sell === "Buy" ? "arrowUp" : "arrowDown",
      text: position.buy_sell === "Buy" ? "Entry Long" : "Entry Short",
    },
    {
      time: position.close_time,
      position: position.buy_sell === "Buy" ? "aboveBar" : "belowBar",
      color: position.buy_sell === "Buy" ? "red" : "green",
      shape: position.buy_sell === "Buy" ? "arrowDown" : "arrowUp",
      text: position.buy_sell === "Buy" ? "Close Long" : "Close Short",
    },
  ];
  useEffect(() => {
    const getDataset = async () => {
      let response = null
      if (isSelfData) {
        response = await selfPositionHistory(navigate, position.id);
      } else {
        response = await getPositionHistory(navigate, position.id);
      }
      if (response["status"]) {
        console.log('response["data"]', response["data"])
        setlistData(response["data"]);
      } else {
        dispatch(setMsg(response["message"]));
      }
    };
    if (listData.length === 0 && showChart) {
      getDataset();
    }
  }, [showChart]);

  useEffect(() => {
    if (listData.length === 0 || !chartContainerRef.current) {
      return;
    }
    chartContainerRef.current.innerHTML = "";
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { color: theme === "dark" ? "#252424" : "#EDECEC" },
        textColor: theme === "dark" ? "#DDD" : "#000000",
      },
      grid: {
        vertLines: { color: theme === "dark" ? "#444" : "#000000" },
        horzLines: { color: theme === "dark" ? "#444" : "#000000" },
      },

      crosshair: {
        mode: 0,
        vertLine: {
          labelVisible: true,
        },
        horzLine: {
          labelVisible: true,
        },
      },
      timeScale: {
        timeVisible: false,
        visible: showTime,
      },
      priceScale: {
        visible: true,
        autoScale: true,
      },
      rightPriceScale: {
        visible: true,
        mode: percPrice ? 2 : 0,
      },
    });
    setChartGl(chart);
    lineSeriesRef.current = chart.addCandlestickSeries();
    console.log('markers', markers)
    lineSeriesRef.current.setMarkers(markers);
    volumeSeriesRef.current = chart.addHistogramSeries({
      baseLineVisible: false,
      priceLineVisible: false,
      lastValueVisible: false,
      color: "#26a69a",
      lineWidth: 2,
      priceFormat: {
        type: "volume",
      },
      priceScaleId: "",
      overlay: true,
    });
    chart.timeScale().fitContent();

    chart.priceScale("").applyOptions({
      scaleMargins: {
        top: 0.8,
        bottom: 0,
      },
    });
    const decimalPlaces = tradingPairs[currentPair];
    const minMove = 1 / Math.pow(10, decimalPlaces);
    lineSeriesRef.current.applyOptions({
      priceFormat: {
        type: "price",
        precision: tradingPairs[position.coin_pair],
        minMove: minMove,
      },
    });

    const dataSlice = listData;
    lineSeriesRef.current.setData(dataSlice);
    for (let i = 1; i <= 20; i++) {
      dataSlice.push({
        time:
          dataSlice[dataSlice.length - 1].time +
          i * (convertTimeframe(currentTimeframe) * 60),
        open: null,
        high: null,
        low: null,
        close: null,
      });
    }
    chart.applyOptions({
      timeScale: {
        rightOffset: 10,
      },
    });

    const volumeData = dataSlice.map((item) => ({
      time: item.time,
      value: item.volume,
      color: item.close > item.open ? "#26a69a" : "#ef5350",
    }));
    volumeSeriesRef.current.setData(volumeData);
  }, [listData]);

  const handleSave = () => {};

  return (
    <>
      <Modal show={showChart} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: 16 }}>
            Pair: {position.coin_pair} Timeframe:{" "}
            {TIME_CONVERT[position.timeframe]} Side: {position.buy_sell} Profit:
            ${position.profit.toFixed(2)}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div
            style={{ width: "100%", height: "50vh" }}
            ref={chartContainerRef}
          ></div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={saveImage}
            style={{ borderRadius: "50%", margin: "0 auto" }}
          >
            <FontAwesomeIcon icon={faFloppyDisk} />
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>

        <ImageModal
          show={show}
          handleClose={handleCloseImage}
          handleSave={handleSaveImage}
        />
      </Modal>
    </>
  );
};

export default ChartModal;
