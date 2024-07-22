import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  calculateMA,
  calculateRSI,
  calculateBollingerBands,
} from "../../services/indicators";
import {
  createChart, CrosshairMode, PriceScaleMode, LineStyle
} from "lightweight-charts";
import { v4 as uuidv4 } from 'uuid';
import { Button, Col, OverlayTrigger, Spinner, Image } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPencil,
  faP,
  faTrash,
  faMinus,
  faPenNib,
  faInfoCircle,
  faFloppyDisk,
  faGear,
} from "@fortawesome/free-solid-svg-icons";
import {
  loadList,
  setCursor,
  setPair,
  setTimeframe,
  addScreenshot,
  setNewPair,
  setShowTime,
  setPercPrice,
  clearMarkers,
  setTpSl,
  setMarkersShow,
  setDataWasAdded,
  setShowAddData,
  showPatterns,
} from "../../redux/dataActions";
import { setUuidCode } from "../../redux/sessionActions";
import { COIN_CRYPTO_SET, STOCK, FOREX, TIMEFRAMES, tradingPairs, TIME_CONVERT, TIME_CONVERT_REVERSED } from "../../config";
import { getAvaliblePairs, getAvalibleTimeframes } from "../../services/access";
import { Dropdown } from "react-bootstrap";
import { convertTimeframe } from "../../services/services";
import ImageModal from "./modals/imageModal";
import { uploadScreenshot } from "../../api/data";
import { changeSettings } from "../../api/auth";
import { useNavigate } from "react-router-dom";
import SettingsModal from "./modals/settingsModal";
import AddChart from "./addChart";
import { ErrorBoundary } from "../errors/ErrorBoundary";
import TopMenu from "./topMenu";
import ToolsPanel from "./toolsPanel";

function Chart() {
  // Refs
const isUpdatingRef = useRef(false);
const lineSeriesRef = useRef(null);
const volumeSeriesRef = useRef(null);
const maSeriesRef = useRef(null);
const rsiSeriesRef = useRef(null);
const smaRef = useRef(null);
const upperBandRef = useRef(null);
const lowerBandRef = useRef(null);
const chartContainerRef = useRef(null);
const temporaryLineRef = useRef(null);
const linesRef = useRef([]);
const subscribeClickRef = useRef();
const subscribeMouseMoveRef = useRef();
const temporaryStartTimeRef = useRef(null);
const temporaryFinishTimeRef = useRef(null);
const dropdownRef = useRef(null);
const lineStartRef = useRef(false);
const stopLossLineRef = useRef(null);
const takeProfitLineRef = useRef(null);


// Redux states
const dispatch = useDispatch();
const navigate = useNavigate();
const loading = useSelector((state) => state.data.loading);
const dataWasAdded = useSelector((state) => state.data.dataWasAdded);
const showTime = useSelector((state) => state.data.showTime);
const percPrice = useSelector((state) => state.data.percPrice);
const showTpsl = useSelector((state) => state.data.showTpsl);
const showMarkers = useSelector((state) => state.data.showMarkers);
const patterns = useSelector((state) => state.data.showPatterns);
const list = useSelector((state) => state.data.list);
const user = useSelector((state) => state.user.user);
const cursor = useSelector((state) => state.data.cursor);
const markers = useSelector((state) => state.data.markers);
const takeProfitLine = useSelector((state) => state.data.takeProfitLine);
const stopLossLine = useSelector((state) => state.data.stopLossLine);
const currentSession = useSelector(state => state.session.curent_session);
const currentPosition = useSelector(state => state.session.current_position);
const theme = useSelector((state) => state.data.theme);
const currentPair = useSelector((state) => state.data.current_pair);
const currentTimeframe = useSelector((state) => state.data.timeframe);

// Local states
const [windowSize, setWindowSize] = useState({
  width: window.innerWidth,
  height: window.innerHeight,
});


const [handleShowSettings, setHandleShowSettings] = useState(false)
const [prevCursor, setPrevCursor] = useState(null);
const [lineData, setlineData] = useState([]);
const [temporaryLineData, setTemporaryLineData] = useState(0);
const [update, setUpdate] = useState(0);
const [chartGlobal, setChartGlobal] = useState(null);
const [selectedIndicators, setSelectedIndicators] = useState(
  window.localStorage.getItem("indicators_settings")
    ? JSON.parse(window.localStorage.getItem("indicators_settings"))
    : { MA: true, RSI: false, BOL: false }
);
const [zIndexDrawPanel, setZIndexDrawPanel] = useState(9999);
const [isOpen, setIsOpen] = useState(false);

// Drawing states
const [startPoint, setStartPoint] = useState(null);
const [currentPoint, setCurrentPoint] = useState(null);
const [lines, setLines] = useState([]);
const [removeLines, setRemoveLines] = useState(0);
const [drawLayer, setDrawLayer] = useState(1);
const [drawsSetedUp, setDrawsSetedUp] = useState(false);
const [colorLine, setColorLine] = useState("red");
const [lineWidth, setLineWidth] = useState(2);
const [drawingMode, setDrawingMode] = useState(null);
const [mouseDown, setMouseDown] = useState(false);
const [showTooltip, setShowTooltip] = useState(false);

  //===============Save Image ====================
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSave = async (imageName) => {
    let screenshot = chartGlobal.takeScreenshot(); //lightweight-charts
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
  //===============End Save Image=================
  const handleMouseDown = (e) => {
    setMouseDown(true);
    handleMouseClick(e);
  };

  const handleMouseClick = (e) => {
    if (chartContainerRef.current) {
      const rect = chartContainerRef.current.getBoundingClientRect();
      let x = e.clientX - rect.left;
      let y = e.clientY - rect.top;

      if (x < 0 || y < 0 || x > rect.width || y > rect.height) {
        return;
      }
      if (drawingMode === "free") {
        setLines((lines) => {
          if (lines.length === 0 || lines[lines.length - 1].length >= 2) {
            setStartPoint({ x, y, color: colorLine });
            return [...lines, [{ x, y, color: colorLine }]];
          } else {
            setDrawLayer(1);
            setStartPoint(null);
            setCurrentPoint(null);
            return [
              ...lines.slice(0, -1),
              [...lines[lines.length - 1], { x, y, color: colorLine }],
            ];
          }
        });
      }
    }
  };

  const handleMouseMove = (e) => {
    if (chartContainerRef.current && (mouseDown || drawingMode === "line")) {
      const rect = chartContainerRef.current.getBoundingClientRect();
      let x = e.clientX - rect.left;
      let y = e.clientY - rect.top;

      // Проверка границ
      if (x < 0) x = 0;
      if (y < 0) y = 0;
      if (x > rect.width) x = rect.width;
      if (y > rect.height) y = rect.height;

      if (drawingMode === "line" && startPoint) {
        // setCurrentPoint({ x, y });
      } else if (drawingMode === "free" && startPoint) {
        setLines((lines) => {
          if (lines.length === 0 || !lines[lines.length - 1].length) {
            return [...lines, [{ x, y, color: colorLine }]];
          } else {
            const newLines = [...lines];
            newLines[newLines.length - 1].push({ x, y, color: colorLine });
            return newLines;
          }
        });
      }
    }
  };

  const handleMouseUp = () => {
    setMouseDown(false);
    if (drawingMode === "free") {
      setStartPoint(null);
      setCurrentPoint(null);
      setDrawLayer(1);
    }
  };

  const handleMouseLeave = () => {
    // setStartPoint(null);
    // setCurrentPoint(null);
  };

  const rewriteDraws = () => {
    if (chartGlobal && !drawsSetedUp) {
      setDrawsSetedUp(true);
      const draw_data = JSON.parse(window.localStorage.getItem("draw_lines"));
      if (draw_data) {
        for (let i = 0; i < draw_data.length; i++) {
          let newLayer = chartGlobal.addLineSeries({
            color: draw_data[i].color,
            lineWidth: draw_data[i].lineWidth,
          });
          linesRef.current.push({
            lineWidth: draw_data[i].lineWidth,
            color: draw_data[i].color,
            line: newLayer,
            data: draw_data[i].data,
          });
        }
        linesRef.current.forEach(({ width, color, line, data }) => {
          if (data.length === 2) {
            data.sort((a, b) => a.time - b.time);
            if (data[0].time !== data[1].time) {
              line.setData(data);
            }
          }
        });
      }
    }
  };

  useEffect(() => {
    rewriteDraws();
  }, [chartGlobal]);
  //================End Drawning=====================

  //==================Top Menu==========================


  const rewriteIndicators = () => {
    const dataSlice = list.slice(0, cursor).map((candle) => ({ ...candle }));
    if (selectedIndicators.MA) {
      const maData = calculateMA(dataSlice, 14);
      maSeriesRef.current.setData(
        maData
          .map((value, index) => ({ time: list[index].time, value }))
          .filter(
            (item) =>
              item.value !== null && item.value !== 0 && !isNaN(item.value)
          )
      );
    }
    if (selectedIndicators.RSI) {
      const rsiData = calculateRSI(dataSlice, 14);
      console.log("rsi:", rsiData);
      rsiSeriesRef.current.setData(
        rsiData
          .map((value, index) => ({ time: list[index].time, value }))
          .filter(
            (item) =>
              item.value !== null && item.value !== 0 && !isNaN(item.value)
          )
      );
    }
    if (selectedIndicators.BOL) {
      const bollingerData = calculateBollingerBands(dataSlice);
      const sma = bollingerData.sma;
      const upperBand = bollingerData.upperBand;
      const lowerBand = bollingerData.lowerBand;
      smaRef.current.setData(
        sma
          .map((value, index) => ({ time: list[index].time, value }))
          .filter(
            (item) =>
              item.value !== null && item.value !== 0 && !isNaN(item.value)
          )
      );
      upperBandRef.current.setData(
        upperBand
          .map((value, index) => ({ time: list[index].time, value }))
          .filter(
            (item) =>
              item.value !== null && item.value !== 0 && !isNaN(item.value)
          )
      );
      lowerBandRef.current.setData(
        lowerBand
          .map((value, index) => ({ time: list[index].time, value }))
          .filter(
            (item) =>
              item.value !== null && item.value !== 0 && !isNaN(item.value)
          )
      );
    }
  };
  //==================End Top Menu==========================

  //====================CHART TRADIND DATA==================
  useEffect(() => {
    if (list.length > 0 && chartContainerRef.current && prevCursor !== null) {
      

      let dataSlice = list
        .slice(0, prevCursor)
        .map((candle) => ({ ...candle }));
        console.log('dataSlice', dataSlice)
      const newCandles = list
        .slice(prevCursor, cursor)
        .map((candle) => ({ ...candle }));
        console.log('newCandles', newCandles)

      newCandles.forEach((item) => {
        lineSeriesRef.current.update(item);
      });


      dataSlice = [...dataSlice, ...newCandles];
      for (let i = 1; i <= 10; i++) {
        dataSlice.push({
          time:
            list[cursor-1].time + i * (convertTimeframe(currentTimeframe) * 60),
          open: null,
          high: null,
          low: null,
          close: null,
        });
      }

      chartGlobal.timeScale().setVisibleRange({
        from: new Date(dataSlice[0].time * 1000).getTime() / 1000,
        to: new Date((list[cursor-1].time + TIME_CONVERT_REVERSED[currentTimeframe]*1000) * 1000).getTime() / 1000,
      });

      const volumeData = dataSlice.map((item) => ({
        time: item.time,
        value: item.volume,
        color: item.close > item.open ? "#26a69a" : "#ef5350",
      }));

      volumeSeriesRef.current.setData(volumeData);
      rewriteIndicators();
    }
    console.log('CURSOR', cursor)
    setPrevCursor(cursor);
  }, [cursor]);

  useEffect(() => {
    if (showMarkers && lineSeriesRef.current && markers.length>0){
      lineSeriesRef.current.setMarkers(markers)
    }
  }, [markers]);

  useEffect(() => {
    if (showTpsl && lineSeriesRef.current && takeProfitLine){
      takeProfitLineRef.current = lineSeriesRef.current.createPriceLine(takeProfitLine);
    } else if (!takeProfitLine) {
      if (takeProfitLineRef.current) {
        lineSeriesRef.current.removePriceLine(takeProfitLineRef.current);
        takeProfitLineRef.current = null
      }
    }
  }, [takeProfitLine]);

  useEffect(() => {
    if (showTpsl && lineSeriesRef.current && stopLossLine){
      stopLossLineRef.current = lineSeriesRef.current.createPriceLine(stopLossLine);
    } else if (!stopLossLine) {
      if (stopLossLineRef.current) {
        lineSeriesRef.current.removePriceLine(stopLossLineRef.current);
        stopLossLineRef.current = null
      }
    }
  }, [stopLossLine]);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    
    if (list.length === 0) {
      dispatch(clearMarkers())
      console.log('LOAD LIST')
      window.localStorage.removeItem("draw_lines")
      const coin = user.current_session.coin_pair//localStorage.getItem("coin") || "BTCUSDT";
      const timeframe = user.current_session.timeframe//localStorage.getItem("timeframe") || "1440";
      console.log('init req', coin, timeframe)
      const start_date = 0;
      dispatch(setPair(coin));
      console.log(timeframe)
      dispatch(setTimeframe(TIME_CONVERT[timeframe]));
      dispatch(loadList(coin, timeframe, start_date));
    }
  }, []);


  useEffect(() => {
    if (dataWasAdded) {
      dispatch(setDataWasAdded(false));
    }
    if (!cursor) {
      dispatch(setCursor(100));
    }
    if (list.length > 0 && chartContainerRef.current) {
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
          mode: CrosshairMode.Normal,
          vertLine: {
            labelVisible: true,
          },
          horzLine: {
            labelVisible: true,
          },
        },
        timeScale: {
          timeVisible: true,
          visible: showTime,
        },
        priceScale: {
          visible: true,
          autoScale: true,
      },
        rightPriceScale: {
          visible: true,
          mode: percPrice ? PriceScaleMode.Percentage : PriceScaleMode.Normal,
        },
      });
      
      setChartGlobal(chart);
      lineSeriesRef.current = chart.addCandlestickSeries(

      );
      if (showMarkers){
        lineSeriesRef.current.setMarkers(markers)
      }
      if (showTpsl && takeProfitLine) {
        lineSeriesRef.current.createPriceLine(takeProfitLine);
      }
      if (showTpsl && stopLossLine) {
        lineSeriesRef.current.createPriceLine(stopLossLine);
      }
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
      lineSeriesRef.current.applyOptions(
        {
          priceFormat: {
            type: 'price',
            precision: decimalPlaces,
            minMove: minMove,
        },
        priceLineVisible: true,
        }
      )

      
      const dataSlice = list.slice(0, cursor).map((candle) => ({ ...candle }));
      lineSeriesRef.current.setData(dataSlice);
      for (let i = 1; i <= 10; i++) {
        dataSlice.push({
          time:
            list[cursor-1].time + i * (convertTimeframe(currentTimeframe) * 60),
          open: null,
          high: null,
          low: null,
          close: null,
        });
      }
      chart.timeScale().setVisibleRange({
        from: new Date(dataSlice[0].time * 1000).getTime() / 1000,
        to: new Date((list[cursor-1].time + TIME_CONVERT_REVERSED[currentTimeframe]*1000) * 1000).getTime() / 1000,
      });
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

      maSeriesRef.current = chart.addBaselineSeries({ color: "yellow",
        baseLineVisible: false,
        priceLineVisible: false,
        lastValueVisible: false,
       });
      smaRef.current = chart.addLineSeries({ lineWidth: 2,
        baseLineVisible: false,
        priceLineVisible: false,
        lastValueVisible: false,
       });
      upperBandRef.current = chart.addLineSeries({
        color: "green",
        lineWidth: 2,
        baseLineVisible: false,
        priceLineVisible: false,
        lastValueVisible: false,
      });
      lowerBandRef.current = chart.addLineSeries({
        color: "blue",
        lineWidth: 2,
        baseLineVisible: false,
        priceLineVisible: false,
        lastValueVisible: false,
      });
      const rsiPriceScale = chart.addLineSeries({
        lineWidth: 2,
        priceScaleId: "rsi",
        color: "red",
      });
      chart.priceScale("rsi").applyOptions({
        scaleMargins: {
          top: 0.8,
          bottom: 0,
        },
      });

      rsiSeriesRef.current = rsiPriceScale;
      rewriteIndicators();
    }
  }, [ list, theme, windowSize, selectedIndicators, removeLines, percPrice, showTime ]);

  //====================END CHART TRADIND DATA==================

  return (
    <Col
      style={{
        width: "75%",
        height: "100%",
        margin: "10px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <ImageModal
        show={show}
        handleClose={handleClose}
        handleSave={handleSave}
      />
      <TopMenu setZIndexDrawPanel={setZIndexDrawPanel} selectedIndicators={selectedIndicators} setSelectedIndicators={setSelectedIndicators} />
      <div style={{
          display: "flex",
          gridTemplateColumns: "auto 1fr",
          width: "100%",
          height: "100%",
        }}>
        <ToolsPanel 
        chartContainerRef={chartContainerRef} 
        chartGlobal={chartGlobal} 
        lineSeriesRef={lineSeriesRef} 
        drawLayer={drawLayer} 
        setDrawLayer={setDrawLayer} 
        drawingMode={drawingMode} 
        setDrawingMode={setDrawingMode} 
        lines={lines} 
        setLines={setLines} 
        zIndexDrawPanel={zIndexDrawPanel} 
        lineStartRef={lineStartRef} 
        subscribeMouseMoveRef={subscribeMouseMoveRef}
        temporaryStartTimeRef={temporaryStartTimeRef}
        temporaryFinishTimeRef={temporaryFinishTimeRef}
        temporaryLineRef={temporaryLineRef}
        isUpdatingRef={isUpdatingRef}
        linesRef={linesRef}
        subscribeClickRef={subscribeClickRef}
        setRemoveLines={setRemoveLines}
        />
      <div
        style={{
          display: "flex",
          gridTemplateColumns: "auto 1fr",
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        
        {loading ? 

         <Spinner animation="border" role="status">
           <span className="sr-only">Loading...</span>
         </Spinner> :
        <div style={{ position: "relative", width: "100%", height: "100%" }}>
          <div
            style={{ width: "100%", height: "100%" }}
            ref={chartContainerRef}
          ></div>
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              pointerEvents: drawLayer ? "auto" : "none",
              zIndex: drawLayer,
              cursor: drawingMode === "free" ? "crosshair" : "default",
            }}
            onPointerDown={handleMouseDown}
            onPointerMove={handleMouseMove}
            onPointerUp={handleMouseUp}
            onPointerLeave={handleMouseLeave}
          >
            <svg
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
              }}
            >
              {lines.map((line, i) => (
                <polyline
                  key={i}
                  points={line.map((p) => `${p.x},${p.y}`).join(" ")}
                  fill="none"
                  stroke={line[0].color}
                  strokeWidth="2"
                />
              ))}
              {drawingMode === "line" && startPoint && currentPoint && (
                <line
                  x1={startPoint.x}
                  y1={startPoint.y}
                  x2={currentPoint.x}
                  y2={currentPoint.y}
                  stroke={startPoint.color}
                  strokeWidth="2"
                />
              )}
            </svg>
          </div>
        </div>
}
      </div>
      </div>
    </Col>
  );
}

export default Chart;
