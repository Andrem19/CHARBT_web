import React, { useState, useEffect } from "react";
import { Modal, Tab, Tabs, Button, Dropdown, Container } from "react-bootstrap";
import BalanceChart from "../charts_stat/BalanceChart";
import { useSelector } from "react-redux";
import ProfitBarChart from "../charts_stat/ProfitBarChart";
import CloseTypePieChart from "../charts_stat/CloseTypePieChart";
import StatisticPage from "../charts_stat/Statisctic";
import SellBuyChart from "../charts_stat/SellBuyChart";
import ScatterChart from "../charts_stat/ScatterChart";

function StatisticModal({ showModal, setShowModal }) {
  const positions = useSelector(
    (state) => state.session.curent_session.positions
  );
  const fees = Array.from({ length: 25 }, (_, i) => i / 100);
  const [fee, setFee] = useState(0);
  const [pos, setPos] = useState(positions);
  const theme = useSelector((state) => state.data.theme);
  const isMobile = useSelector(state => state.user.isMobile);

  const handleModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    setPos([]);
    let NewPositions = [];
    for (let i = 0; i < positions.length; i++) {
      let position = { ...positions[i] };
      let inFee = (position.amount / 100) * fee;
      position.profit -= inFee;
      NewPositions.push(position);
    }
    setPos(NewPositions);
  }, [fee, showModal]);

  return (
    <>
      <Modal show={showModal} onHide={handleModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            <span>Detailed statistics</span>
            <Dropdown onSelect={(key) => setFee(parseFloat(key))}>
              <Dropdown.Toggle variant="success" id="dropdown-basic">
                Fee: {fee.toFixed(2)}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                {fees.map((fee, index) => (
                  <Dropdown.Item key={fee.toFixed(2)} eventKey={fee.toFixed(2)}>
                    {fee.toFixed(2)}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Tabs defaultActiveKey="home" id="uncontrolled-tab-example" className={isMobile ? "mobile-tabs" : ""}>
            <Tab eventKey="home" title={<span style={{ fontSize: isMobile ? '12px' : 'inherit' }}>Visual 1</span>}>
              Profit 1:
              <BalanceChart positions={pos} />
              Profit 2:
              <ProfitBarChart positions={pos} />
            </Tab>
            <Tab eventKey="profile" title={<span style={{ fontSize: isMobile ? '12px' : 'inherit' }}>Visual 2</span>}>
              Close types:
              <CloseTypePieChart positions={pos} />
              Buy/Sell:
              <SellBuyChart positions={pos} />
            </Tab>
            <Tab eventKey="stat" title={<span style={{ fontSize: isMobile ? '12px' : 'inherit' }}>Visual 3</span>}>
              Duration types:
              <ScatterChart positions={pos} />
            </Tab>
            <Tab eventKey="contact" title={<span style={{ fontSize: isMobile ? '12px' : 'inherit' }}>Statistics</span>}>
              <StatisticPage positions={pos} />
            </Tab>
          </Tabs>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default StatisticModal;
