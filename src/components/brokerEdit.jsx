import React from "react";
import { withTranslation } from "react-i18next";
import {deleteTax, getBroker, putBrokerEdit} from "../api/api";
import NavBarPage from "./NavBarPage";
import {Card, Row, Form, Button, Col} from "react-bootstrap";
import {NavLink} from "react-router-dom";
import ListGroup from "react-bootstrap/ListGroup";

class BrokerEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id:0,
      name: "",
      taxes:[],
      broker:null,
    };


    this.handleChangeName = this.handleChangeName.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

  }
  cancelAction=(event)=>{
    this.props.history.push("/broker");

  }

  componentDidMount() {
    if (!localStorage.getItem("token")) {
      this.props.history.push("/login");
    }

    this.state.id= this.props.match.params.id;
    this.updateBroker();
  }

  handleChangeName = (event) => {
    this.setState({ name: event.target.value });
  };

  handleAPIError(responseError) {
    let errorToDisplay = this.props.t("genericError");

    if (responseError.request && responseError.request.status === 0) {
      errorToDisplay = this.props.t("comError");
    }
    this.setState({ error: errorToDisplay });

  }

  handleSubmit = (event) => {
    event.preventDefault();
    putBrokerEdit(this.state.id,{
      name: this.state.name,
    })
        .then((response) => {
          this.props.history.push("/broker");
        })
        .catch((responseError) => this.handleAPIError(responseError));
  };


  generate() {
    return this.state.taxes.map((each) =>
        <ListGroup.Item action >
          <a href={"/tax/edit/"+each.id}>{each.name}</a><a href={"#"} id={each.id} onClick={this.removeTax}>DEL</a>
        </ListGroup.Item>
    );
  }

  removeTax=(event) =>{
    event.preventDefault();
    deleteTax(event.target.id)
        .then(() => {
          this.updateBroker();
        })
        .catch((responseError) => this.handleAPIError(responseError));
  }

  updateBroker = ()=>{
    getBroker(this.state.id)
        .then(aBroker => {
          this.setState({name: aBroker.name,taxes:aBroker.taxes});
        })
        .catch(() => this.setState({ error: this.props.t("genericError") }));
  }

  render() {
    const { t } = this.props;
    const { id } = this.props.match.params;

      return (

      <div>
        <NavBarPage />
        <div className="container-fluid">

          <Card>
            <Card.Header as="h5">{t("brokerEdit")}</Card.Header>
            <Card.Body>


              <Form onSubmit={this.handleSubmit}>
                <Row>
                <Col lg="7" xs="7" md="7">
                  <Row>
                    <Row className="mb-3">
                      <Form.Group className="mb-3" controlId="idValue">
                        <Form.Label>{t("id")}</Form.Label>
                        <Form.Control value={id}/>
                      </Form.Group>
                    </Row>

                      <Row className="mb-3">
                        <Form.Group className="mb-3" controlId="nameValue">
                          <Form.Label>{t("name")}</Form.Label>
                          <Form.Control
                            onChange={this.handleChangeName}
                            value={this.state.name}
                          />
                        </Form.Group>
                      </Row>
                    </Row>
                  </Col>

                  <Col lg="4" xs="4" md="4">
                    <Row>
                      <NavLink to={"/broker/edit/" + this.state.id + "/tax"}>
                        <Button variant="primary"  class={"w-100"}>
                          <i className="fa fa-plus">{t("brokerAddTax")}</i>
                        </Button>
                      </NavLink>
                    </Row>
                    <Row>
                      <ListGroup defaultActiveKey="#link1">
                        {" "}
                        {this.generate()}{" "}
                      </ListGroup>
                    </Row>
                  </Col>
                </Row>

                <Row>
                  <Button variant="primary" type="submit">
                    {t("update")}
                  </Button>

                  <Button
                    variant="outline-primary"
                    type="cancel"
                    onClick={this.cancelAction}
                  >
                    {t("back")}
                  </Button>
                </Row>

              </Form>
            </Card.Body>
          </Card>

        </div>
      </div>
    );
  }


}

export default withTranslation()(BrokerEdit);
