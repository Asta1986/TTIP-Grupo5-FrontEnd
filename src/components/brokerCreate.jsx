import React from "react";
import { withTranslation } from "react-i18next";
import {postBrokerCreate} from "../api/api";
import NavBarPage from "./NavBarPage";
import {Card,Row,Form,Button} from "react-bootstrap";

class BrokerCreate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rows: [],
      taxName: "",
    };


    this.handleChangeName = this.handleChangeName.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

  }

  componentDidMount() {
    if (!localStorage.getItem("token")) {
      this.props.history.push("/login");
    }
  }
  cancelAction=(event)=>{
    this.props.history.push("/broker");

  }

  handleChangeName = (event) => {
    this.setState({ taxName: event.target.value });
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
    postBrokerCreate({
      name: this.state.taxName,
    })
        .then((response) => {
          this.props.history.push("/broker/edit/"+response.id);
        })
        .catch((responseError) => this.handleAPIError(responseError));
  };

  render() {
    const { t } = this.props;


    return (
      <div>
        <NavBarPage />
        <div className="container-fluid">

          <Card>
            <Card.Header as="h5">{t("brokerNew")}</Card.Header>
            <Card.Body>
              <Form onSubmit={this.handleSubmit}>
                <Row className="mb-3">
                  <Form.Group className="mb-3" controlId="nameValue">
                    <Form.Label>{t("name")}</Form.Label>
                    <Form.Control  onChange={this.handleChangeName} value={this.state.taxName}/>
                  </Form.Group>
                </Row>



                <Row>
                  <Button variant="primary" type="submit">
                    {t("save")}
                  </Button>

                  <Button variant="outline-primary" type="cancel" onClick={this.cancelAction}>
                    {t("cancel")}
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

export default withTranslation()(BrokerCreate);
