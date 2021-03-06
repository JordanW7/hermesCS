import React, { Component } from "react";
import { Row, Col, Form, Button, Select, message } from "antd";
import apiBackEnd from "../../../api/api";

const FormItem = Form.Item;
const Option = Select.Option;

class UserSettingsModify extends Component {
  constructor() {
    super();
    this.state = {
      userSettingsModName: "",
      userSettingsModAccess: "",
      userSettingsModTeam: "",
      userSettingsUserList: "",
      userSettingsUserData: {},
      userSettingsTeamList: "",
      userSettingsSelectionStatus: ""
    };
  }
  componentDidMount() {
    this.loadUserSettingsModData();
  }
  loadUserSettingsModData = async () => {
    const { account } = this.props.user.user;
    const teamdata = await apiBackEnd(`teams/${account}`, "get");
    if (!teamdata || teamdata.errors) {
      return message.error("Oops! There was a problem loading the team data.");
    }
    const userSettingsTeamList = [];
    for (let i = 0; i < teamdata.length; i++) {
      let { team } = teamdata[i];
      userSettingsTeamList.push([team]);
    }
    this.setState({ userSettingsTeamList });
    const userdata = await apiBackEnd(`users/${account}`, "get");
    if (!userdata || userdata.errors) {
      return message.error("Oops! There was a problem loading the user data.");
    }
    const userSettingsUserList = [];
    const userSettingsUserData = {};
    for (let i = 0; i < userdata.length; i++) {
      let user = `${userdata[i].firstname} ${userdata[i].lastname}`;
      userSettingsUserData[user] = userdata[i];
      userSettingsUserList.push([user]);
    }
    this.setState({ userSettingsUserList });
    this.setState({ userSettingsUserData });
  };
  onModUserNameChange = value => {
    this.setState({ userSettingsModName: value });
    this.setState({
      userSettingsSelectionStatus: this.state.userSettingsUserData[value].status
    });
  };
  onModUserTeamChange = value => {
    this.setState({ userSettingsModTeam: value });
  };
  onModUserSubmit = async () => {
    const { userSettingsModName, userSettingsModTeam } = this.state;
    if (!userSettingsModName || !userSettingsModTeam) {
      return message.error("Please complete both fields");
    }
    const { account, email } = this.props.user.user;
    const modifyuser = this.state.userSettingsUserData[userSettingsModName]
      .email;
    const response = await apiBackEnd("settings/modifyuser", "post", {
      account,
      fullname: userSettingsModName,
      user: email,
      modifyuser,
      newteam: userSettingsModTeam
    });
    if (response.errors) {
      return message.error(
        "Oops! Please check the fields have been completed correctly and try again."
      );
    }
    if (response === "user updated") {
      return message.success("User has been updated");
    }
    if (response === "user is teamleader") {
      return message.success(
        "User has been updated. Warning: User was team leader of previous team, please remember to assign someone new."
      );
    }
    return message.error(
      "Oops! Something unexpected happened. Please try again."
    );
  };
  onModUserStatusChange = async () => {
    const {
      userSettingsModName,
      userSettingsSelectionStatus,
      userSettingsModTeam
    } = this.state;
    if (!userSettingsModName || !userSettingsSelectionStatus) {
      return message.error("Please select a user");
    }
    if (userSettingsSelectionStatus !== "active" && !userSettingsModTeam) {
      return message.error("Please select a team to reactivate the user");
    }
    const { account, email } = this.props.user.user;
    const modifyuser = this.state.userSettingsUserData[userSettingsModName]
      .email;
    const response = await apiBackEnd("settings/modifyuser", "post", {
      account,
      user: email,
      modifyuser,
      newteam:
        userSettingsSelectionStatus !== "active"
          ? userSettingsModTeam
          : "inactive",
      status: userSettingsSelectionStatus !== "active" ? "active" : "inactive"
    });
    if (response === "user updated") {
      this.setState({
        userSettingsSelectionStatus:
          userSettingsSelectionStatus !== "active" ? "active" : "inactive"
      });
      return message.success("User has been updated");
    }
    if (response === "unable to change") {
      return message.error("Oops! You cannot disable the account owner");
    }
    return message.error(
      "Oops! Something happened. Please try again or contact support."
    );
  };
  render() {
    const status = this.state.userSettingsSelectionStatus;
    return (
      <Form layout="inline">
        <Row>
          <Col span={24} className="settings-content-title">
            Modify User
          </Col>
          <Col
            xs={24}
            sm={24}
            md={24}
            lg={12}
            xl={12}
            style={{ textAlign: "right" }}
          >
            <FormItem label="User:">
              <Select
                defaultValue="Please select"
                onChange={this.onModUserNameChange}
              >
                {this.state.userSettingsUserList &&
                  this.state.userSettingsUserList.map((user, i) => {
                    return (
                      <Option key={`${i}_user`} value={`${user}`}>
                        {user}
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
            lg={12}
            xl={12}
            style={{ textAlign: "right" }}
          >
            <FormItem label="New Team:">
              <Select
                defaultValue="Please select"
                onChange={this.onModUserTeamChange}
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
            {status === "" || status === "active" ? (
              <Button type="primary" onClick={this.onModUserSubmit}>
                Update
              </Button>
            ) : (
              ""
            )}
            <Button
              type={status !== "active" && status !== "" ? "primary" : "danger"}
              onClick={this.onModUserStatusChange}
            >
              {status !== "active" && status !== ""
                ? "Enable Account"
                : "Disable Account"}
            </Button>
          </Col>
        </Row>
      </Form>
    );
  }
}

export default UserSettingsModify;
