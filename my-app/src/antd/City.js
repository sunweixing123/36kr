import React, {Component} from 'react';
import { Form, Row, Col, Button, Cascader } from 'antd';
import Position from '../static/cityData'
const FormItem = Form.Item;
class City extends Component {
    constructor(props) {
        super(props);
        this.state = {
            province: null,
            city: null,
            county: null,
        };
    }
    //取消创建
    handleCancel = () => {
        this.props.form.resetFields();
    }
    //创建
    handleSave = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if(!err) {
                let location = '';
            }
        })
    }
    handleSelectedPosition = (value) => {
        this.setState({
            province: value[0],
            city: value[1],
            county: value[2],
        })
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {span: 5},
            wrapperCol: {span: 19},
        };
        return (
            <div>
        <div>
          <Form>
              <Row>
              <Col span={8} offset={1}>
                <FormItem
                  {...formItemLayout}
                  label='家电位置'
                >
                  {getFieldDecorator('location', {
                    rules: [{
                      type: 'array',
                      required: true,
                      message: '该字段是必输的',
                    }],
                  })(
                    <Cascader
                      options={Position}
                      onChange={this.handleSelectedPosition.bind(this)}
                      placeholder="请选家电位置"
                    />,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
            <FormItem>
                <Row>
                  <Col span={2} offset={6}>
                    <Button
                      size="large"
                      type="primary"
                      htmlType="submit"
                      className="login-form-button"
                      onClick={this.handleSave}
                    >
                    </Button>
                  </Col>
                  <Col span={2} offset={1}>
                    <Button
                      size="large"
                      htmlType="reset"
                      className="login-form-button"
                      onClick={this.handleCancel}
                    >
                    </Button>
                  </Col>
                </Row>
              </FormItem>
            </Row>
          </Form>
        </div>
      </div>
        )
    }
}
export default Form.create()(City);
