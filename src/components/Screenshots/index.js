import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { SCREENSHOT_COLLECTION } from "../../config";
import {
  Container,
  Row,
  Col,
  Image,
  Modal,
  Button,
  Pagination,
  Spinner,
  InputGroup,
  FormControl
} from "react-bootstrap";
import { setScreenshots, setFiltred } from "../../redux/dataActions";
import { getScreenshots, deleteScreenshot } from "../../api/data";
import ImageWithDelete from "./Image";
import { loadingStart } from "../../redux/dataActions"
import { useNavigate } from "react-router-dom";
import { filterFiles } from "../../services/services";

function MyScreenshots() {

  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState('');

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const itemsPerPage = 12; // 4x3 grid

  const handlePageChange = (eventKey) => {
    setCurrentPage(eventKey);
  };

  const screenshot_urls = useSelector((state) => state.data.screenshots);
  const filtred_screenshots = useSelector((state) => state.data.filttred_screenshots);
  const themeState = useSelector((state) => state.data.theme);
  const loading = useSelector((state) => state.data.loading);
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [deletionComplete, setDeletionComplete] = useState(false);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filtred_screenshots.slice(indexOfFirstItem, indexOfLastItem);

  const pageNumbers = [];
  for (
    let number = 1;
    number <= Math.ceil(filtred_screenshots.length / itemsPerPage);
    number++
  ) {
    pageNumbers.push(
      <Pagination.Item
        key={number}
        active={number === currentPage}
        onClick={() => handlePageChange(number)}
      >
        {number}
      </Pagination.Item>
    );
  }

  const handleClose = () => setShow(false);
  const handleShow = (url) => {
    setSelectedImage(url);
    setShow(true);
  };

  useEffect(() => {
    const fetchScreenshots = async () => {
      dispatch(loadingStart)
      const screenshots = await getScreenshots(navigate);
      dispatch(setScreenshots(screenshots));
    };

    if (deletionComplete) {
      fetchScreenshots();
      setDeletionComplete(false); // Reset for next deletion
    }
  }, [deletionComplete]);

  useEffect(() => {
    const fetchScreenshots = async () => {
      dispatch(loadingStart)
      const screenshots = await getScreenshots(navigate);
      dispatch(setScreenshots(screenshots));
      
    };
    fetchScreenshots();
    setDeletionComplete(false); // Reset for next deletion
  }, []);

  useEffect(() => {
    if (screenshot_urls) {
      const filtred = filterFiles(screenshot_urls, filter)
      dispatch(setFiltred(filtred))
    }
  }, [screenshot_urls, filter]);

  const handleDelete = (url) => {
    const deleteScreenshots = async () => {
      setDeletionComplete(false);
      await deleteScreenshot(navigate, `${url}`);
      setDeletionComplete(true); // Set deletionComplete to true after deletion
    };
    deleteScreenshots();
    handleClose();
    if (currentItems.length === 1 && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (screenshot_urls.length === 0) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: "2em",
          backgroundColor: "var(--bg-color)",
          color: "var(--text-color)",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        You don't have any screenshots yet.
      </div>
    );
  }

  return (
    
    <Container className={themeState} style={{ minHeight: "100vh" }}>

    <Row >
        <Col style={{ marginTop: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <InputGroup style={{ width: '200px' }}>
              <FormControl
                placeholder="Filter"
                value={filter}
                onChange={handleFilterChange}
              />
            </InputGroup>
          </div>
        </Col>
      </Row>

      <Pagination
        className="justify-content-center"
      >
        {pageNumbers}
      </Pagination>

      {loading ? 
        <Spinner animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner> :
      <Row style={{ marginTop: 10 }}>
        {currentItems.map((url, index) => {
          const fileName = url.substring(
            url.lastIndexOf("/") + 1,
            url.lastIndexOf(".")
          );
          return (
            <Col xs={6} md={4} lg={3} key={index} style={{ marginTop: 10 }}>
              <ImageWithDelete
                url={`${SCREENSHOT_COLLECTION}${url}`}
                handleShow={handleShow}
                handleDelete={handleDelete}
              />
            </Col>
          );
        })}
      </Row>
}

      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Image Preview</Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            src={`${selectedImage}`}
            style={{ maxWidth: "100%", maxHeight: "100%" }}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="danger" onClick={() => handleDelete(selectedImage)}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default MyScreenshots;
