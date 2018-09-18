import React, {Component} from 'react';
import { Form, Row, Col, Button, Cascader, Divider, Input, message, Select } from 'antd';
// import Position from '../static/cityData'
import 'antd/lib/date-picker/style/css';      
const FormItem = Form.Item;
const Option = Select.Option;
function handleChange(value) {
    console.log(`selected ${value}`);
  }
class antdForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            province: null,
            city: null,
            county: null,
        };
    }
    render() {
        const Position = [{
            value: '北京市',
            label: '北京市',
        },{
            value: '黑龙江',
            label: '黑龙江',
        },{
            value: '吉林',
            label: '吉林',
        }]
        console.log(Position);
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {span: 5},
            wrapperCol: {span: 20},
        };
        return (
            // <div>
            //     <FormItem
            //       {...formItemLayout}
            //       label='标题'
            //     >
            //     {getFieldDecorator('location', {
            //         rules: [{
            //           message: '该字段是必输的',
            //         }],
            //       })(
            //         <Input />,
            //       )}

            //     </FormItem>
            // </div>
            <div>
                 <Select defaultValue="lucy" style={{ width: 120 }} onChange={handleChange}>
      <Option value="jack">Jack</Option>
      <Option value="lucy">Lucy</Option>
      <Option value="disabled" disabled>Disabled</Option>
      <Option value="Yiminghe">yiminghe</Option>
    </Select>
                <Select
                        size="default"
                      >
                        <Option key='233'>111</Option>
                        {Position.map((cell, index) =>
                          <Option key={index} value={cell.value}>{cell.label}</Option>)}
                      </Select>
                <FormItem label="对应价格:" {...formItemLayout}>
                    {getFieldDecorator('amount', {
                        rules: [{ required: true, message: '请输入数字' }, { pattern: /(^0\.\d*[1-9]\d*$)|(^[1-9]\d*(\.\d+)?$)/, message: '请输入数字' }],
                        validateTrigger: 'onBlur',
                    })(<Select
                        size="default"
                      >
                        <Option key='233'>111</Option>
                        {Position.map((cell, index) =>
                          <Option key={index} value={cell.value}>{cell.label}</Option>)}
                      </Select>)}
                </FormItem>
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
                      <Input />,
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
                    >
                    test
                    </Button>
                  </Col>
                  <Col span={2} offset={1}>
                    <Button
                      size="large"
                      htmlType="reset"
                      className="login-form-button"
                    >
                    test
                    </Button>
                  </Col>
                </Row>
              </FormItem>
            </Row>
            </div>
        )
    }
}
export default Form.create()(antdForm);
