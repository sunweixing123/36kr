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
      success: false,
      id: this.props.params.id || '',
      sending: false,
      loading: false,
      model: this.props.model || {},
      modalVisible: false,
    };
    this.formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 12 },
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.newPrice = this.newPrice.bind(this);
    this.showModal = this.showModal.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  shouldComponentUpdate() {
    return true;
  }

  componentWillReceiveProps(nextProps) {
    const { model } = this.props;
    if (!lodash.isEqual(model, nextProps.model) && nextProps.model) {
      this.setForm(nextProps.model);
    }
  }

  componentWillMount() {
  }

  componentDidMount() {

  }

  setForm(model) {
    const { setFieldsValue } = this.props.form;
    this.state.model = model;
    setFieldsValue({
      description: model.description || '',
      amount: model.amount || '',
      type: model.type || '',
      parent_id: model.parent_id || '',
      sale_limit: model.sale_limit || '',
      started_at: model.started_at || '',
      finished_at: model.finished_at || '',
    });
  }

  handleSubmit(e) {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const data = {
          ...values,
          started_at: values['range-time-picker'][0].format('YYYY-MM-DD HH:mm:ss'),
          finished_at: values['range-time-picker'][1].format('YYYY-MM-DD HH:mm:ss'),
        };
        delete data['range-time-picker'];
        this.doSubmit(data);
      }
    });
  }

  doSubmit(values) {
    const { sending, id } = this.state;
    const { id: priceId } = this.props.model || {};
    const { changeStep } = this.props;
    if (sending) {
      return true;
    }
    let success = false;
    const cbs = {
      success: (res, data) => {
        success = true;
        this.state.priceId = priceId || data.priceId;
        this.props.refresh(!priceId);
        // this.getGoods(true)
      },
      complete: () => {
        this.setState({
          sending: false,
        }, () => {
          if (success) {
            this.handleCancel();
          }
        });
      },
    };

    this.setState({
      sending: true,
    });

    values = {
      ...values,
      goods_id: id,
    };
    api[priceId ? 'put' : 'post']('goods-price', { id: priceId }, values, cbs);
  }

  renderForm() {
    const { getFieldDecorator } = this.props.form;
    const { model } = this.state;
    const { originList } = this.props;
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 18 },
    };
    return (
      <Form>
        <FormItem label="降价类型:" {...formItemLayout}>
          {getFieldDecorator('type', {
            initialValue: model.type || '',
            rules: [{ required: true, message: '请输入降价名称' }],
          })(<Input placeholder="请输入降价名称" />)}
        </FormItem>
        <FormItem label="对应原价id:" {...formItemLayout}>
          {getFieldDecorator('parent_id', {
            rules: [{ required: true, message: '请选择对应原价' }],
          })(<Select>
            {_.map(originList, (el, index) => <Option value={el.id} key={index}>{el.id}</Option>)}
          </Select>)}
        </FormItem>
        <FormItem label="价格:" {...formItemLayout}>
          {getFieldDecorator('amount', {
            initialValue: model.amount || '',
            rules: [{ required: true, message: '请输入数字' }, { pattern: /(^0\.\d*[1-9]\d*$)|(^[1-9]\d*(\.\d+)?$)/, message: '请输入数字' }],
            validateTrigger: 'onBlur',
          })(<Input placeholder="请输入数字" />)}
        </FormItem>
        <FormItem label="价格描述:" {...formItemLayout}>
          {getFieldDecorator('description', {
            initialValue: model.description || '',
            rules: [{ required: true, message: '请输入数字+文字描述' }],
          })(<Input placeholder="请输入数字+文字描述" />)}
        </FormItem>
        <FormItem label="数量限制:" {...formItemLayout}>
          {getFieldDecorator('sale_limit', {
            initialValue: model.sale_limit || '',
            rules: [{ pattern: /[1-9]\d*/, message: '请输入数字' }],
          })(<Input placeholder="请填写数字" />)}
        </FormItem>
        <FormItem label="开始结束时间:" {...formItemLayout}>
          {getFieldDecorator('range-time-picker', {
            initialValue: model.started_at && model.finished_at ? [moment(model.started_at), moment(model.finished_at)] : null,
            rules: [{ required: true, message: '请选择开始结束时间', type: 'array' }],
          })(<RangePicker showTime format="YYYY-MM-DD HH:mm:ss" />)}
        </FormItem>
      </Form>
    );
  }
  handleCancel() {
    this.props.showModal(false, null);
  }
  showModal() {
    this.props.showModal(true, null);
  }
  newPrice() {
    const { setFieldsValue } = this.props.form;
    setFieldsValue({
      type: '',
      sale_limit: '',
      description: '',
      amount: '',
      sale_limit: '',
      parent_id: '',
      'range-time-picker': null,
    });
    this.showModal();
  }
  nextStep() {
    this.props.changeStep(5);
  }

  render() {
    return (
      <div>
        <div className="clearfix">
          <Button type="primary" onClick={this.newPrice}><Icon type="plus" />新建价格</Button>
          <span className="fr">
            <Button type="primary" onClick={() => this.nextStep()}><Icon type="plus" />下一步</Button>
          </span>
        </div>
        <Modal
          visible={this.props.modalVisible}
          title="临时价格"
          onCancel={this.handleCancel}
          footer={[
            <Button key="back" type="ghost" size="large" onClick={this.handleCancel}>取消</Button>,
            <Button key="submit" type="primary" size="large" loading={this.state.sending} onClick={this.handleSubmit}>
              确认
            </Button>,
          ]}
        >
          {this.renderForm()}
        </Modal>
      </div>
    );
  }
}

export default Form.create()(RoleDetail);

