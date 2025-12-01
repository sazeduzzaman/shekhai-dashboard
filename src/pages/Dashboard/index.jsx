import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  CardBody,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Table,
} from "reactstrap";
import { Link } from "react-router-dom";
import classNames from "classnames";

// Charts
import StackedColumnChart from "./StackedColumnChart";

// Redux actions
import { getChartsData as fetchChartsData } from "/src/store/actions";

// Pages Components
import WelcomeComp from "./WelcomeComp";
import MonthlyEarning from "./MonthlyEarning";
import LatestTransactions from "./LatestTranaction";

// Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

// i18n
import { withTranslation } from "react-i18next";

// Redux
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "reselect";

// Modal Images
import modalImage1 from "../../assets/images/product/img-7.png";
import modalImage2 from "../../assets/images/product/img-4.png";

const Dashboard = ({ t }) => {
  const dispatch = useDispatch();

  // State
  const [orderModal, setOrderModal] = useState(false);
  const [periodType, setPeriodType] = useState("Year");

  // Redux selector
  const { chartsData } = useSelector(
    createSelector(
      (state) => state.Dashboard,
      (dashboard) => ({
        chartsData: dashboard.chartsData,
      })
    )
  );

  // Reports data
  const reports = [
    { title: "Orders", iconClass: "bx-copy-alt", description: "1,235" },
    { title: "Revenue", iconClass: "bx-archive-in", description: "$35,723" },
    {
      title: "Average Price",
      iconClass: "bx-purchase-tag-alt",
      description: "$16.2",
    },
  ];
  // Change chart period
  const onChangeChartPeriod = (type) => {
    setPeriodType(type);
    dispatch(fetchChartsData(type));
  };

  // Meta title
  useEffect(() => {
    document.title = `Dashboard | Skote - Vite React Admin & Dashboard Template`;
  }, []);

  return (
    <div className="page-content">
      <Container fluid>
        <Breadcrumbs title={t("Dashboards")} breadcrumbItem={t("Dashboard")} />

        <Row>
          <Col xl="4">
            <WelcomeComp />
            <MonthlyEarning />
          </Col>

          <Col xl="8">
            <Row>
              {reports.map((report, idx) => (
                <Col md="4" key={idx}>
                  <Card className="mini-stats-wid">
                    <CardBody>
                      <div className="d-flex">
                        <div className="flex-grow-1">
                          <p className="text-muted fw-medium">{report.title}</p>
                          <h4 className="mb-0">{report.description}</h4>
                        </div>
                        <div className="avatar-sm rounded-circle bg-primary align-self-center mini-stat-icon">
                          <span className="avatar-title rounded-circle bg-primary">
                            <i
                              className={`bx ${report.iconClass} font-size-24`}
                            ></i>
                          </span>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
              ))}
            </Row>

            <Card>
              <CardBody>
                <div className="d-sm-flex flex-wrap align-items-center mb-3">
                  <h4 className="card-title mb-0">Email Sent</h4>
                  <div className="ms-auto">
                    <ul className="nav nav-pills">
                      {["Week", "Month", "Year"].map((type) => (
                        <li className="nav-item" key={type}>
                          <Link
                            to="#"
                            className={classNames(
                              { active: periodType === type },
                              "nav-link"
                            )}
                            onClick={() => onChangeChartPeriod(type)}
                          >
                            {type}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <StackedColumnChart
                  periodData={chartsData}
                  dataColors='["--bs-primary", "--bs-warning", "--bs-success"]'
                />
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col lg="12">
            <LatestTransactions />
          </Col>
        </Row>
      </Container>

      {/* Order Modal */}
      <Modal
        isOpen={orderModal}
        centered
        toggle={() => setOrderModal(!orderModal)}
      >
        <ModalHeader toggle={() => setOrderModal(!orderModal)}>
          Order Details
        </ModalHeader>
        <ModalBody>
          <p>
            Product id: <span className="text-primary">#SK2540</span>
          </p>
          <p>
            Billing Name: <span className="text-primary">Neal Matthews</span>
          </p>

          <div className="table-responsive">
            <Table className="table table-centered table-nowrap">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Product Name</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    img: modalImage1,
                    name: "Wireless Headphone (Black)",
                    qty: 1,
                    price: 225,
                  },
                  {
                    img: modalImage2,
                    name: "Hoodie (Blue)",
                    qty: 1,
                    price: 145,
                  },
                ].map((item, idx) => (
                  <tr key={idx}>
                    <th scope="row">
                      <img src={item.img} alt="" className="avatar-sm" />
                    </th>
                    <td>
                      <h5 className="text-truncate font-size-14">
                        {item.name}
                      </h5>
                      <p className="text-muted mb-0">
                        $ {item.price} x {item.qty}
                      </p>
                    </td>
                    <td>${item.price}</td>
                  </tr>
                ))}
                <tr>
                  <td colSpan="2" className="text-end">
                    Sub Total:
                  </td>
                  <td>$400</td>
                </tr>
                <tr>
                  <td colSpan="2" className="text-end">
                    Shipping:
                  </td>
                  <td>Free</td>
                </tr>
                <tr>
                  <td colSpan="2" className="text-end">
                    Total:
                  </td>
                  <td>$400</td>
                </tr>
              </tbody>
            </Table>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setOrderModal(!orderModal)}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

Dashboard.propTypes = {
  t: PropTypes.any.isRequired,
};

export default withTranslation()(Dashboard);
