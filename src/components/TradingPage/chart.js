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
import { Col, Spinner } from "react-bootstrap";
import {
  loadList,
  setCursor,
  setPrevCursor,
  setPair,
  setTimeframe,
  addScreenshot,
  clearMarkers,
  setDataWasAdded,
  setSelfData,
  setWaitingCursor
} from "../../redux/dataActions";
import { tradingPairs, TIME_CONVERT, TIME_CONVERT_REVERSED } from "../../config";
import { convertTimeframe } from "../../services/services";
import ImageModal from "./modals/imageModal";
import { uploadScreenshot } from "../../api/data";
import { useNavigate } from "react-router-dom";
import TopMenu from "./topMenu";
import ToolsPanel from "./toolsPanel";
import { setMsg } from "../../redux/userActions";
import { faTemperature0 } from "@fortawesome/free-solid-svg-icons";

function Chart({ isMobile }) {
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
const lineStartRef = useRef(false);
const stopLossLineRef = useRef(null);
const takeProfitLineRef = useRef(null);


// Redux states
const dispatch = useDispatch();
const navigate = useNavigate();
const showTools = useSelector(state => state.data.showTools);
const loading = useSelector((state) => state.data.loading);
const dataWasAdded = useSelector((state) => state.data.dataWasAdded);
const showTime = useSelector((state) => state.data.showTime);
const percPrice = useSelector((state) => state.data.percPrice);
const showTpsl = useSelector((state) => state.data.showTpsl);
const showMarkers = useSelector((state) => state.data.showMarkers);
const list = useSelector((state) => state.data.list);
const user = useSelector((state) => state.user.user);
const cursor = useSelector((state) => state.data.cursor);
const prevCursor = useSelector((state) => state.data.prevCursor);
const waitingCursor = useSelector((state) => state.data.waitingCursor);
const markers = useSelector((state) => state.data.markers);
const takeProfitLine = useSelector((state) => state.data.takeProfitLine);
const stopLossLine = useSelector((state) => state.data.stopLossLine);
const theme = useSelector((state) => state.data.theme);
const currentSession = useSelector((state) => state.session.curent_session);
const isSelfData = useSelector((state) => state.session.isSelfData);
const currentPair = useSelector((state) => state.data.current_pair);
const currentTimeframe = useSelector((state) => state.data.timeframe);

// Local states
const [windowSize, setWindowSize] = useState({
  width: window.innerWidth,
  height: window.innerHeight,
});


const [handleShowSettings, setHandleShowSettings] = useState(false)
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
    console.log(cursor, list.length, chartGlobal, chartContainerRef.current, prevCursor)
    if (!cursor || cursor == 100 || cursor === currentSession.cursor) {
      return
    }

    if (list.length > 0 && chartGlobal && chartContainerRef.current) {
      
    if (list.length-3 < cursor && user.payment_status === 'default') {
      dispatch(setMsg('To get more data, upgrade your account to one of our subscription packages.'))
      return
    }
      let pCur = prevCursor? prevCursor : cursor-1
      let dataSlice = list
        .slice(0, pCur)
        .map((candle) => ({ ...candle }));
      const newCandles = list
        .slice(pCur, cursor)
        .map((candle) => ({ ...candle }));
      
      if (newCandles.length === 0) {
        return
      }
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

      // chartGlobal.timeScale().setVisibleRange({
      //   from: new Date(dataSlice[0].time * 1000).getTime() / 1000,
      //   to: new Date((list[cursor-1].time + TIME_CONVERT_REVERSED[currentTimeframe]*1000) * 1000).getTime() / 1000,
      // });
      let lastBarIndex = cursor - 1; // индекс последней свечи
      let rangeStartIndex = cursor > 100 ? cursor-100 : 0; // индекс начала диапазона

      if (isMobile) {
          rangeStartIndex = Math.max(0, lastBarIndex - 30 + 1); // для мобильного режима показываем последние 30 свечей
      } else {
          rangeStartIndex = Math.max(0, lastBarIndex - 100 + 1); // для обычного режима показываем последние 100 свечей
      }

      chartGlobal.timeScale().setVisibleLogicalRange({ from: rangeStartIndex, to: lastBarIndex });
      chartGlobal.applyOptions({
        timeScale: {
          rightOffset: isMobile ? 3 : 10,
        },
      });

      const volumeData = dataSlice.map((item) => ({
        time: item.time,
        value: item.volume,
        color: item.close > item.open ? "#26a69a" : "#ef5350",
      }));

      volumeSeriesRef.current.setData(volumeData);
      rewriteIndicators();
    }
    dispatch(setPrevCursor(cursor));
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
      window.localStorage.removeItem("draw_lines")
      const coin = user.current_session.coin_pair//localStorage.getItem("coin") || "BTCUSDT";
      const timeframe = user.current_session.timeframe//localStorage.getItem("timeframe") || "1440";
      const start_date = 0;
      dispatch(setPair(coin));
      dispatch(setTimeframe(TIME_CONVERT[timeframe]));
      if (isSelfData) {
        dispatch(setSelfData(navigate, currentSession.selfDataId, user.current_session.cursor))
      } else {
        dispatch(loadList(coin, timeframe, start_date, 100));
      }
      
    }
  }, []);
  // useEffect(() => {
  //   console.log('chartGlobal', chartGlobal)
  // }, [chartGlobal]);

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
      const decimalPlaces = isSelfData? currentSession.decimal_places : tradingPairs[currentPair];
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
      // chart.timeScale().setVisibleRange({
      //   from: new Date(dataSlice[0].time * 1000).getTime() / 1000,
      //   to: new Date((list[cursor-1].time + TIME_CONVERT_REVERSED[currentTimeframe]*1000) * 1000).getTime() / 1000,
      // });
      

      let lastBarIndex = cursor - 1; // индекс последней свечи
      let rangeStartIndex = cursor > 100 ? cursor-100 : 0; // индекс начала диапазона

      if (isMobile) {
          rangeStartIndex = Math.max(0, lastBarIndex - 30 + 1); // для мобильного режима показываем последние 30 свечей
      } else {
          rangeStartIndex = Math.max(0, lastBarIndex - 100 + 1); // для обычного режима показываем последние 100 свечей
      }

      chart.timeScale().setVisibleLogicalRange({ from: rangeStartIndex, to: lastBarIndex });
      chart.applyOptions({
        timeScale: {
          rightOffset: isMobile ? 3 : 10,
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
        {!isMobile && showTools && <ToolsPanel 
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
        />}
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
