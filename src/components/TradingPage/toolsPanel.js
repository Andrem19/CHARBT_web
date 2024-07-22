import React, { useEffect, useState } from 'react';
import { Button, Col, Dropdown } from "react-bootstrap";
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faPencil,
    faTrash,
    faMinus,
    faPenNib,
    faFloppyDisk,
  } from "@fortawesome/free-solid-svg-icons";
  import { addScreenshot } from "../../redux/dataActions";
import ImageModal from "./modals/imageModal";
import { uploadScreenshot } from "../../api/data";

function ToolsPanel({
    chartGlobal, 
    lineSeriesRef, 
    drawLayer, 
    setDrawLayer, 
    drawingMode, 
    setDrawingMode, 
    setLines, 
    zIndexDrawPanel, 
    lineStartRef, 
    subscribeMouseMoveRef, 
    temporaryStartTimeRef,
    temporaryFinishTimeRef,
    temporaryLineRef,
    isUpdatingRef,
    linesRef,
    subscribeClickRef,
    setRemoveLines,
}) {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const list = useSelector((state) => state.data.list);
    const cursor = useSelector((state) => state.data.cursor);


    const [drawsSetedUp, setDrawsSetedUp] = useState(false);
    const [colorLine, setColorLine] = useState("red");
    const [lineWidth, setLineWidth] = useState(2);
    const [lineData, setlineData] = useState([]);
    const [temporaryLineData, setTemporaryLineData] = useState(0);
    const [update, setUpdate] = useState(0);
    

    const colors = ["blue", "red", "green", "orange"];
    const lineThicknesses = [1, 2, 3, 4, 5];


      //================Drawning=====================
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const saveImage = () => {
    handleShow();
  };
  const setLineThickness = (selectedThickness) => {
    setLineWidth(selectedThickness);
  };
  const handleLineDrawClick = () => {
    setDrawingMode("line");
    handleDrawClick();
  };
  const handleFreeDrawClick = () => {
    setDrawingMode("free");
    setDrawLayer(999);
  };

  const handleSave = async (imageName) => {
    let screenshot = chartGlobal.takeScreenshot();
    const screenshot_url = await uploadScreenshot(
      navigate,
      screenshot,
      imageName
    );
    dispatch(addScreenshot(screenshot_url));
    handleClose();
  };

  const clearDraws = () => {
    window.localStorage.removeItem("draw_lines");
    linesRef.current.forEach(({ width, color, line, data }) => {
      line.setData([]);
    });
    setRemoveLines((upd) => upd + 1);
    setLines([]);
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

  const handleDrawClick = () => {
    temporaryStartTimeRef.current = null;
    temporaryFinishTimeRef.current = null;
    subscribeClickRef.current = (param) => {
      if (param.point) {
        let price = lineSeriesRef.current.coordinateToPrice(param.point.y);
        const t = param.time ? param.time : list[cursor].time;
        const newValue = {
          time: t,
          value: price,
        };
        console.log("newValue", newValue);
        if (lineData.length === 0) {
          lineStartRef.current = true;
          temporaryStartTimeRef.current = newValue;
        }

        setlineData((oldLineData) => [...oldLineData, newValue]);
      }
    };

    subscribeMouseMoveRef.current = (param) => {
      if (param.point) {
        let price = lineSeriesRef.current.coordinateToPrice(param.point.y);
        const t = param.time ? param.time : list[cursor].time;
        const newValue = {
          time: t,
          value: price,
        };
        if (
          temporaryStartTimeRef.current.time &&
          param.time &&
          !isUpdatingRef.current
        ) {
          if (
            lineStartRef.current &&
            newValue.time !== temporaryStartTimeRef.current.time
          ) {
            setTimeout(() => {
              if (!temporaryStartTimeRef.current) {
                temporaryStartTimeRef.current = newValue;
              } else {
                temporaryFinishTimeRef.current = newValue;
              }
              setTemporaryLineData((update) => update + 1);
            }, 100);
          }
        }
      }
    };

    chartGlobal.subscribeClick(subscribeClickRef.current);
  };

  useEffect(() => {
    if (lineData.length === 2) {
      let newLayer = chartGlobal.addLineSeries({
        color: colorLine,
        lineWidth: lineWidth,
      });
      linesRef.current.push({
        lineWidth: lineWidth,
        color: colorLine,
        line: newLayer,
        data: lineData,
      });
      setlineData([]);
      setUpdate((update) => update + 1);
    } else if (lineData.length === 1 && lineStartRef.current) {
      chartGlobal.subscribeCrosshairMove(subscribeMouseMoveRef.current);
      temporaryLineRef.current = chartGlobal.addLineSeries({
        color: colorLine,
        lineWidth: lineWidth,
      });
    }
  }, [lineData]);

  useEffect(() => {
    if (temporaryFinishTimeRef.current === temporaryStartTimeRef.current) {
      return;
    }
    if (
      temporaryFinishTimeRef.current != null &&
      temporaryStartTimeRef.current != null
    ) {
      isUpdatingRef.current = true;
      let data = [
        JSON.parse(JSON.stringify(temporaryStartTimeRef.current)),
        JSON.parse(JSON.stringify(temporaryFinishTimeRef.current)),
      ];
      data.sort((a, b) => a.time - b.time);
      console.log("data", data);
      if (data[0].time !== data[1].time) {
        try {
          temporaryLineRef.current.setData(data);
        } catch (error) {
          console.log("error", error, "data", data);
        } finally {
          isUpdatingRef.current = false;
        }
      }
      isUpdatingRef.current = false;
    }
  }, [temporaryLineData]);

  useEffect(() => {
    lineStartRef.current = false;
    temporaryFinishTimeRef.current = null;
    temporaryFinishTimeRef.current = null;
    setDrawingMode(null);
    if (temporaryLineRef.current) {
      temporaryLineRef.current.setData([]);
    }
    if (chartGlobal) {
      chartGlobal.unsubscribeClick(subscribeClickRef.current);
      chartGlobal.unsubscribeCrosshairMove(subscribeMouseMoveRef.current);
    }

    linesRef.current.forEach(({ width, color, line, data }) => {
      const copiedData = JSON.parse(JSON.stringify(data));

      if (copiedData.length === 2) {
        copiedData.sort((a, b) => a.time - b.time);
        if (copiedData[0].time !== copiedData[1].time) {
          line.setData(copiedData);
        }
      }
    });
    if (linesRef.current.length > 0) {
      const linesToSave = linesRef.current.map(
        ({ width, color, line, data }) => ({
          lineWidth,
          color,
          data,
        })
      );
      window.localStorage.setItem("draw_lines", JSON.stringify(linesToSave));
    }
  }, [update]);

  //================End Drawning=====================


    return (
        
        <Col style={{ zIndex: zIndexDrawPanel, maxWidth: '60px' }}>
            <ImageModal
        show={show}
        handleClose={handleClose}
        handleSave={handleSave}
      />
          <Button
            style={{ width: "90%", height: "40px", marginTop: 10 }}
            variant="outline-success"
            onClick={saveImage}
          >
            <FontAwesomeIcon
              icon={faFloppyDisk}
              style={{ color: "var(--navbar-text-color)" }}
            />
          </Button>
          <Button
            style={{ width: "90%", height: "40px", marginTop: 10 }}
            variant={drawingMode === "line" ? "success" : "outline-success"}
            onClick={handleLineDrawClick}
          >
            <FontAwesomeIcon
              icon={faPenNib}
              style={{ color: "var(--navbar-text-color)" }}
            />
          </Button>
          <Button
            style={{ width: "90%", height: "40px", marginTop: 10 }}
            variant={
              drawLayer > 900 && drawingMode === "free"
                ? "success"
                : "outline-success"
            }
            onClick={handleFreeDrawClick}
          >
            <FontAwesomeIcon
              icon={faPencil}
              style={{ color: "var(--navbar-text-color)" }}
            />
          </Button>

          <Dropdown
            onSelect={(selectedThickness) =>
              setLineThickness(selectedThickness)
            }
          >
            <Dropdown.Toggle
              variant="outline-success"
              id="dropdown-basic"
              style={{
                width: "90%",
                height: "40px",
                marginTop: 10,
                display: "flex",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  marginBottom: 5,
                  width: "70%",
                  height: lineWidth * 1,
                  backgroundColor: "black",
                }}
              ></div>
            </Dropdown.Toggle>
            <Dropdown.Menu style={{ background: "grey" }}>
              {lineThicknesses.map((thickness, index) => (
                <Dropdown.Item key={index} eventKey={thickness}>
                  <div
                    style={{
                      marginBottom: 5,
                      width: "100%",
                      height: thickness,
                      backgroundColor: "black",
                    }}
                  ></div>
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>

          <Dropdown onSelect={(selectedColor) => setColorLine(selectedColor)}>
            <Dropdown.Toggle
              variant="outline-success"
              id="dropdown-basic"
              style={{ width: "90%", height: "40px", marginTop: 10 }}
            >
              <FontAwesomeIcon icon={faMinus} style={{ color: colorLine }} />
            </Dropdown.Toggle>
            <Dropdown.Menu style={{ background: "grey" }}>
              {colors.map((color, index) => (
                <Dropdown.Item key={index} eventKey={color}>
                  <div
                    style={{
                      marginBottom: 5,
                      width: "100%",
                      height: "4px",
                      backgroundColor: color,
                    }}
                  ></div>
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>

          <Button
            style={{ width: "90%", height: "40px", marginTop: 10 }}
            variant="outline-success"
            onClick={clearDraws}
          >
            <FontAwesomeIcon
              icon={faTrash}
              style={{ color: "var(--navbar-text-color)" }}
            />
          </Button>
        </Col>
    )
}

export default ToolsPanel;