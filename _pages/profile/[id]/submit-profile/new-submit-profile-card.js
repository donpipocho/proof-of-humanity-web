import React from "react";
import { Row, Col } from 'antd';

import NewSubmitProfileForm from "./new-submit-profile-form";


export default class NewSubmitProfileCard extends React.Component {
  constructor(props) {
    super(props);

    // contract,
    // submission,
    // reapply,
    // afterSend = () => {},
    // afterSendError = () => {},

    console.log('newSubmitProfileCard props=', props);
  }

  render() {
    return (
      <Row justify='center'>
        <NewSubmitProfileForm />
      </Row>
    );
  }
}