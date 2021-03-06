import React, { Component } from "react";
import { Row, Col, Form, Button, Input, Select, message } from "antd";
import apiBackEnd from "../../../api/api";

const FormItem = Form.Item;
const Option = Select.Option;

class UserSettingsAdd extends Component {
  constructor() {
    super();
    this.state = {
      userSettingsAddFirstName: "",
      userSettingsAddLastName: "",
      userSettingsAddEmail: "",
      userSettingsAddPassword: "",
      userSettingsAddAccess: "agent",
      userSettingsAddTeam: "",
      userSettingsTeamList: ""
    };
  }
  componentDidMount() {
    this.loadUserSettingsData();
  }
  loadUserSettingsData = async () => {
    const { account } = this.props.user.user;
    const request = await apiBackEnd(`teams/${account}`, "get");
    if (!request || request.errors) {
      return message.error("Oops! There was a problem loading the team data.");
    }
    const userSettingsTeamList = [];
    for (let i = 0; i < request.length; i++) {
      let { team } = request[i];
      userSettingsTeamList.push([team]);
    }
    this.setState({ userSettingsTeamList });
  };
  onNewUserFirstNameChange = event => {
    this.setState({ userSettingsAddFirstName: event.target.value });
  };
  onNewUserLastNameChange = event => {
    this.setState({ userSettingsAddLastName: event.target.value });
  };
  onNewUserEmailChange = event => {
    this.setState({ userSettingsAddEmail: event.target.value });
  };
  onNewUserPasswordChange = event => {
    this.setState({ userSettingsAddPassword: event.target.value });
  };
  onNewUserTeamChange = value => {
    this.setState({ userSettingsAddTeam: value });
  };
  onAddUserSubmit = async () => {
    const {
      userSettingsAddTeam,
      userSettingsAddFirstName,
      userSettingsAddLastName,
      userSettingsAddEmail,
      userSettingsAddPassword,
      userSettingsAddAccess
    } = this.state;
    if (
      !userSettingsAddFirstName ||
      !userSettingsAddLastName ||
      !userSettingsAddEmail ||
      !userSettingsAddPassword ||
      !userSettingsAddAccess
    ) {
      return message.error("Please complete all fields");
    }
    const { email, account } = this.props.user.user;
    const response = await apiBackEnd("settings/adduser", "post", {
      account,
      user: email,
      newuserfirstname: userSettingsAddFirstName,
      newuserlastname: userSettingsAddLastName,
      team: userSettingsAddTeam,
      email: userSettingsAddEmail,
      password: userSettingsAddPassword,
      access: userSettingsAddAccess
    });
    if (response.errors) {
      return message.error(
        "Oops! Please check the fields have been completed correctly and try again. The password must be at least 8 characters and contain at least one letter and one number."
      );
    }
    if (response === "already exists") {
      return message.error("Oops! A user with this name already exists.");
    }
    if (response === "email already exists") {
      return message.error(
        "Oops! A user with this email address already exists."
      );
    }
    if (response === "user added") {
      return message.success("The new user has been added");
    }
    return message.error(
      "Oops! Something unexpected happened. Please try again."
    );
  };
  render() {
    return (
      <Form layout="inline">
        <Row>
          <Col span={24} className="settings-content-title">
            Add New User
          </Col>
          <Col
            xs={24}
            sm={24}
            md={24}
            lg={12}
            xl={12}
            style={{ textAlign: "right" }}
          >
            <FormItem label="First Name:">
              <Input onChange={this.onNewUserFirstNameChange} />
            </FormItem>
          </Col>
          <Col
            xs={24}
            sm={24}
            md={24}
            lg={12}
            xl={12}
            style={{ textAlign: "right" }}
          >
            <FormItem label="Last Name:">
              <Input onChange={this.onNewUserLastNameChange} />
            </FormItem>
          </Col>
          <Col
            xs={24}
            sm={24}
            md={24}
            lg={12}
            xl={12}
            style={{ textAlign: "right" }}
          >
            <FormItem label="Email:">
              <Input onChange={this.onNewUserEmailChange} />
            </FormItem>
          </Col>
          <Col
            xs={24}
            sm={24}
            md={24}
            lg={12}
            xl={12}
            style={{ textAlign: "right" }}
          >
            <FormItem label="Password:">
              <Input type="password" onChange={this.onNewUserPasswordChange} />
            </FormItem>
          </Col>
          <Col
            xs={24}
            sm={24}
            md={24}
            lg={12}
            xl={12}
            style={{ textAlign: "right" }}
          >
            <FormItem label="Team:">
              <Select
                defaultValue="Please select"
                onChange={this.onNewUserTeamChange}
              >
                {this.state.userSettingsTeamList &&
                  this.state.userSettingsTeamList.map((team, i) => {
                    return (
                      <Option key={`${i}_team`} value={`${team}`}>
                        {team}
                      </Option>
                    );
                  })}
              </Select>
            </FormItem>
          </Col>
          <Col
            xs={24}
            sm={24}
            md={24}
            lg={24}
            xl={24}
            style={{ textAlign: "center" }}
          >
            <Button type="primary" onClick={this.onAddUserSubmit}>
              Add
            </Button>
          </Col>
        </Row>
      </Form>
    );
  }
}

export default UserSettingsAdd;
