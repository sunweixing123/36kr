import React, { Component } from 'react';
import { Form, Select, Button, Row, Col, Input, DatePicker, Radio, Card, Icon, Modal } from 'antd';
import api from '../../../../app-common/api';
import action from '../../../../app-common/action';
import lodash from 'lodash';
import initState from '../../../../app-common/dataResource/initState';


const FormItem = Form.Item;
const Option = Select.Option;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const RangePicker = DatePicker.RangePicker;

class RoleDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sending: false,
      loading: false,
      modelList: {
        external_scale: '',
        platform_fee_type: '',
        distribution_scale: '',
        distribute_fee_type: '',
        is_distribute: '0',
      },
    };
    this.getGoods = this.getGoods.bind(this);
    this.renderForm = this.renderForm.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.getGoods();
  }

  shouldComponentUpdate() {
    return true;
  }

  getGoods(force) {
    const { loading } = this.state;
    const { id } = this.props;
    if (!id || loading) {
      return false;
    }
    const cbs = {
      success: (res, data) => {
        const modelList = data;
        const posters = lodash.get(modelList, 'posters');
        if (posters) {
          modelList.posters = JSON.parse(posters);
        }

        if (!(modelList.distribution_scale.replace(/(\.)?0*$/, '') * 100)) {
          modelList.is_distribute = '0';
        } else {
          modelList.is_distribute = '1';
        }

        this.setState({
          modelList,
        });
      },
      complete: () => {
        this.setState({
          loading: false,
        });
      },
    };
    this.setState({
      loading: !force,
    });
    action.getStateById(id, 'goods', {}, force ? {} : cbs, force);
  }

  handleSubmit(e) {
    const { getFieldsValue } = this.props.form;
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (err) return message.error('表单错误');

      const data = {
        ...values,
      };

      this.doSubmit(data);
    });
  }

  doSubmit(values) {
    const { sending } = this.state;
    const { changeStep, id } = this.props;
    if (sending) {
      return true;
    }
    let success = false;
    const cbs = {
      success: (res, data) => {
        success = true;
        this.state.id = id || data.id;
        // this.getGoods(true);
      },
      complete: () => {
        this.setState({
          sending: false,
        }, () => {
          if (success) {
            this.props.changeStep(6);
          }
        });
      },
    };

    this.setState({
      sending: true,
    });
    api[id ? 'put' : 'post']('goods', { id }, values, cbs);
  }

  renderForm() {
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 12 },
    };
    const { modelList } = this.state;
    const { getFieldDecorator, getFieldsValue, getFieldValue } = this.props.form;
    const platform_fee_type = initState.getDictionary('platform_fee_type');
    const is_distribute = getFieldValue('is_distribute');
    if (!modelList) {
      return null;
    }
    return (
      <Form>
        <FormItem label="讲师利润比:" {...formItemLayout}>
          {getFieldDecorator('external_scale', {
            initialValue: modelList.external_scale.replace(/(\.)?0*$/, ''),
            rules: [{ required: true, message: '请填写正确的数值' }, { pattern: /^0(\.\d*[1-9]\d*)?$/, message: '请填写正确的数值' }],
            validateTrigger: 'onBlur',
          })(<Input placeholder="范例：若分成为3成，填写0.3" />)}
        </FormItem>
        <FormItem label="手续费:" {...formItemLayout}>
          {getFieldDecorator('platform_fee_type', {
            initialValue: modelList.platform_fee_type,
            rules: [{ required: true, message: '请选择承担方' }],
            validateTrigger: 'onBlur',
          })(<Select
            size="default"
          >
            {platform_fee_type.map((cell, index) =>
              <Option key={index} value={`${cell.value}`}>{cell.label}</Option>)}
          </Select>)}
        </FormItem>
        <FormItem label="启用分销:" {...formItemLayout}>
          {getFieldDecorator('is_distribute', {
            initialValue: modelList.is_distribute,
          })(<RadioGroup>
            <Radio value="1">启用</Radio>
            <Radio value="0">禁用</Radio>
             </RadioGroup>)}
        </FormItem>
        <FormItem label="分销比:" {...formItemLayout}>
          {getFieldDecorator('distribution_scale', {
            initialValue: modelList.distribution_scale.replace(/(\.)?0*$/, '') * 100,
            rules: [{ required: true, message: '请填写正确的数值' }, { pattern: /[1-50]/, message: '请填写正确的数值' }],
            validateTrigger: 'onBlur',
          })(<Input placeholder="范例：若分成为3成，填写30" disabled={is_distribute === '0'} />)}
        </FormItem>
        <FormItem label="分销/推广费:" {...formItemLayout}>
          {getFieldDecorator('distribute_fee_type', {
            initialValue: modelList.distribute_fee_type,
            rules: [{ required: true, message: '请选择分销/推广费' }],
            validateTrigger: 'onBlur',
          })(<Select
            size="default"
            disabled={is_distribute === '0'}
          >
            {platform_fee_type.map((cell, index) =>
              <Option key={index} value={`${cell.value}`}>{cell.label}</Option>)}
             </Select>)}
        </FormItem>
      </Form>
    );
  }

  render() {
    return (
      <div>
        {this.renderForm()}
        <div className="clearfix"
          style={{
          marginBottom: '50px',
        }}
        >
          <div className="fr">
            <Button type="primary" onClick={this.handleSubmit}><Icon type="plus" />下一步</Button>
          </div>
        </div>
      </div>
    );
  }
}

export default Form.create()(RoleDetail);

