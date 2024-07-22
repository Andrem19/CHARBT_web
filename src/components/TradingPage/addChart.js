import React, { useLayoutEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { findClosestTimestampIndex, createCandle } from "../../services/services";
import { convertTimeframe } from "../../services/services";
import { tradingPairs } from "../../config";
import { createChart } from "lightweight-charts";
import { Spinner } from "react-bootstrap";

const AddChart = () => {

    const chartContainerRef = useRef(null);
    const volumeSeriesRef = useRef(null);
    const lineSeriesRef = useRef(null);

    const [hasError, setHasError] = useState(false);
    const add_list = useSelector((state) => state.data.add_list);
    const list = useSelector((state) => state.data.list);
    const cursor = useSelector((state) => state.data.cursor);
    const currentPair = useSelector((state) => state.data.current_pair);
    const theme = useSelector((state) => state.data.theme);
    const showAddData = useSelector(state => state.data.showAddData);
    const percPrice = useSelector((state) => state.data.percPrice);
    const showTime = useSelector((state) => state.data.showTime);
    const currentSession = useSelector(state => state.session.curent_session);

    useLayoutEffect(() => {
      try{
        if (!chartContainerRef.current) {
          return
        }
        lineSeriesRef.current = null
        volumeSeriesRef.current = null
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
              timeVisible: true,
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
          lineSeriesRef.current = chart.addCandlestickSeries();
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
                precision: tradingPairs[currentPair],
                minMove: minMove,
            },
            }
          )
        
        const index_fin = findClosestTimestampIndex(add_list, list[cursor-1].time)
        let index_start = 0
        if (index_fin > 100) {
            index_start = index_fin-100
        }
        
        let dataSlice = add_list.slice(index_start, index_fin);
        console.log('addData', add_list.length, new Date(add_list[0].time*1000), new Date(add_list[add_list.length-1].time*1000))
        console.log('list cursor', list[cursor].time)
        const last_cand = createCandle(list, cursor-1, currentSession.additional_timaframe)

        dataSlice.push(last_cand)
        lineSeriesRef.current.setData(dataSlice);

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

      } catch (error) {
        console.error(error);
        setHasError(true);
    }
      }, [ showAddData ]);
  

      return (
        <div
          style={{ width: "500px", height: "50vh" }}
          ref={chartContainerRef}
        >
          {hasError ? (
            <Spinner animation="border" role="status">
              <span className="sr-only">Loading...</span>
            </Spinner>
          ) : chartContainerRef.current == null ? (
            <Spinner animation="border" role="status">
              <span className="sr-only">Loading...</span>
            </Spinner>
          ) : (
            <div
              style={{ width: "500px", height: "500px" }}
              ref={chartContainerRef}
            ></div>
          )}
        </div>
    );
    
    
}

export default AddChart;