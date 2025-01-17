import { MDBTable, MDBTableBody, MDBTableHead } from "mdbreact";
import React from "react";
import { withTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import {deleteBroker, getBrokers, postLogin} from "../api/api";
import NavBarPage from "./NavBarPage";

class Brokers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rows: [],
    };
  }

  componentDidMount() {
    if (!localStorage.getItem("token")) {
      this.props.history.push("/login");
    }
    this.updateBrokers();
  }

  updateBrokers(){
    getBrokers()
        .then((taxes) => {
          console.log(taxes);
          this.setState({ rows: taxes });
        })
        .catch(() => this.setState({ error: this.props.t("genericError") }));
  }

  handleSubmit = (event) => {
    event.preventDefault();
    deleteBroker(event.target.id)
        .then((response) => {
            this.updateBrokers();
        })
        .catch((responseError) => this.handleAPIError(responseError));
  };

  render() {
    const { t } = this.props;
    const dataSet = this.state.rows.map((item) => {
      return {
        id: item.id,
        name: item.name,
        url: <a href={"/broker/edit/" + item.id}>{t("edit")}</a>,
        del: <a href={"#"} onClick={this.handleSubmit} id={item.id}>{t("remove")}</a>,
        calc: <a href={"/maincalc/" + item.id}>{t("calculate")}</a>,
      };
    });
    const columns = [
      {
        label: t("brokerId"),
        field: "id",
      },
      {
        label: t("brokerName"),
        field: "name",
      },
      {
        label: t("actionCol"),
        field: "url",
      },
      {
        label: "",
        field: "del",
      },
      {
        label: "",
        field: "calc",
      },
    ];

    return (
      <div>
        <NavBarPage />
        <div className="container-fluid">
          <h1 className="card-header">{t("brokers")}</h1>
          <br />
          <NavLink to="/broker/edit">
            <i class="fas fa-plus-square fa-5x" title={t("brokerNew")}></i>
          </NavLink>
          <br />

          <br />
          <div className="form-content" align="center">
            <div className="row">
              <div id={"contenedor"}>
                <MDBTable className="table-secondary table-hover" responsive>
                  <MDBTableHead columns={columns} />
                  <MDBTableBody rows={dataSet} />
                </MDBTable>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withTranslation()(Brokers);
