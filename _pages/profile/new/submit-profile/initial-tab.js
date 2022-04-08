import {
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  Row,
  Space,
  Typography,
} from "antd";
import React from "react";

const { Link, Paragraph, Title } = Typography;

export default class InitialTab extends React.Component {
  constructor(props) {
    super(props);
    // console.log('InitialTab props=', props);
    this.state = {
      currentStep: "address",
      checked: false,
    };
  }

  handleAdvance = () => {
    this.props.next();
  };

  render() {
    const { t } = this.props.i18n;

    return (
      <>
        {this.state.currentStep === "address" && (
          <Row>
            <Space direction="vertical" size={1}>
              <Title level={2} style={{ fontWeight: "bold" }}>
                {t("submit_profile_initial_title")}
              </Title>
              <Paragraph>{t("submit_profile_initial_description")}</Paragraph>

              {/* Add links or example how a profile gets registered? Register -> Vouch -> Pending (3.5 days) -> Start accruing UBI */}

              <Paragraph>{t("submit_profile_your_wallet")}</Paragraph>
              <Paragraph
                style={{
                  wordWrap: "break-word",
                  fontWeight: "bold",
                  border: "2px solid #ffb978",
                  borderRadius: "15px",
                  textAlign: "center",
                  margin: "0 auto",
                  padding: "5px",
                }}
              >
                {this.props.account}
              </Paragraph>
              <Link href="https://tornado.cash" target="_blank" rel="noopener" style={{ fontWeight: "bold" }}>
                {t("submit_profile_tornado_cash")}
              </Link>
              <Checkbox
                style={{ fontWeight: "bold" }}
                onChange={(event) => {
                  this.setState({ checked: event.target.checked });
                }}
              >
                {t("submit_profile_sensitive_info")}
                </Checkbox>

              <Button disabled={!this.state.checked} type="primary" htmlType="submit" shape="round" className="button-orange" onClick={() => this.setState({ currentStep: "name" })}>
                {t("submit_profile_next")}
              </Button>
            </Space>
          </Row>
        )}
        {this.state.currentStep === "name" && (
          <Row>
            <Space direction="vertical" size={1}>
              <Title level={2} style={{ fontWeight: "bold" }}>
                {t("submit_profile_info_title")}
              </Title>
              <Paragraph>
                {t("submit_profile_info_description")}
              </Paragraph>

              <Form
                name="basicform"
                onValuesChange={(values) =>
                  this.props.stateHandler({ ...values })
                }
                initialValues={{ remember: true }}
              >
                {/* <Alert type="info"
           message={
           <>
           <Title level={5}>Public address</Title><EthereumAccount address={this.props.account} diameter={24} sx={{ maxWidth: 388, color: "text", fontWeight: "bold" }} />
            <Paragraph>
              To improve your privacy, we recommend using an address which is
              already public or a new one-seeded through{" "}
              <Link
                href="https://tornado.cash"
                target="_blank"
                rel="noreferrer noopener"
              >
                tornado.cash
              </Link>
              .
            </Paragrapharagraph>
            </>
          } style={{ marginBottom: "15px" }} showIcon>
            
        </Alert>
          <Alert type={"info"} message={
            <>
            <Title level={5}>Advice</Title>
            <Paragraph>
              Submissions are final and cannot be edited. Be sure to follow
              all submission rules to not lose your deposit.
            </Paragrapharagraph>
            </>
          } style={{ marginBottom: "15px" }} closable showIcon>
            
          </Alert>*/}
                <Title level={5}>{t("submit_profile_info_name_title")}</Title>
                <Form.Item
                  label=""
                  name="name"
                  rules={[
                    { required: true, message: t("submit_profile_info_name_error_help") },
                  ]}
                >
                  <Input
                    placeholder={t("submit_profile_info_name_placeholder")}
                    style={{ fontWeight: "bold" }}
                  />
                </Form.Item>
                <Title level={5}>{t("submit_profile_info_bio_title")}</Title>
                <Form.Item label="" name="bio">
                  <Input.TextArea
                    placeholder={t("submit_profile_info_bio_placeholder")}
                    style={{ fontWeight: "bold" }}
                  />
                </Form.Item>

                <Form.Item>
                  <Row>
                    <Col span={12} style={{ margin: "0 auto" }}>
                      <Button type="primary" shape="round" className="button-grey" onClick={() => this.setState({ currentStep: "address" }) }>
                        {t("submit_profile_previous")}
                      </Button>
                    </Col>
                    <Col span={12}>
                      <Button disabled={this.props.state.name === ""} htmlType="submit" shape="round" className="button-orange" onClick={this.handleAdvance}>
                        {t("submit_profile_next")}
                      </Button>
                    </Col>
                  </Row>
                </Form.Item>
              </Form>
            </Space>
          </Row>
        )}
      </>
    );
  }
}