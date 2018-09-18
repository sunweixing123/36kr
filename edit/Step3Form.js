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
    this.goodsSaleTypeArr = initState.getDictionary('goods_sale_type');
    this.saleUnitArr = initState.getDictionary('goods_sale_unit');
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
    setFieldsValue({
      description: model.description || '',
      amount: model.amount || '',
      sale_number: model.sale_number || '',
      sale_unit: model.sale_unit || '',
      sale_type: model.sale_type || this.goodsSaleTypeArr[0].value,
    });
  }

  handleSubmit(e) {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.doSubmit(values);
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
      type: 'origin',
    };
    api[priceId ? 'put' : 'post']('goods-price', { id: priceId }, values, cbs);
  }

  renderForm() {
    const { getFieldDecorator } = this.props.form;
    const { model } = this.state;
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 18 },
    };
    const goodsSaleTypeArr = initState.getDictionary('goods_sale_type');
    return (
      <Form>
        <FormItem label="用户拥有权:" {...formItemLayout}>
          {getFieldDecorator('sale_type', {
            initialValue: model.sale_type || goodsSaleTypeArr[0].value,
            rules: [{ required: true }],
          })(<RadioGroup>
            
            {goodsSaleTypeArr.map((cell, index) =>
              <RadioButton key={index} value={cell.value}>{cell.label}</RadioButton>)}
             </RadioGroup>)}
        </FormItem>
        <FormItem label="售价:" {...formItemLayout}>
          {getFieldDecorator('amount', {
            initialValue: model.amount || '',
            rules: [{ required: true, message: '请填写整数' }, { pattern: /(^0\.\d*[1-9]\d*$)|(^[1-9]\d*(\.\d+)?$)/, message: '请输入数字' }],
            validateTrigger: 'onBlur',
          })(<Input placeholder="请填写整数" />)}
        </FormItem>
        <FormItem label="单次售卖基数:" {...formItemLayout}>
          {getFieldDecorator('sale_number', {
            initialValue: model.sale_number || '',
            rules: [{ pattern: /[1-9]\d*/, message: '请输入数字' }],
          })(<Input placeholder="请填写数字" />)}
        </FormItem>
        <FormItem label="售卖单位:" {...formItemLayout}>
          {getFieldDecorator('sale_unit', {
            initialValue: model.sale_unit || '',
            rules: [],
          })(<Select>
            <Option value="" />
            {this.saleUnitArr.map((cell, index) =>
              <Option value={cell.value} key={index}>{cell.label}</Option>)}
          </Select>)}
        </FormItem>
        <FormItem label="售价描述:" {...formItemLayout}>
          {getFieldDecorator('description', {
            initialValue: model.description || '',
            rules: [{ required: true, message: '建议最多输入两位数字+单位，如10月' }],
          })(<Input placeholder="建议最多输入两位数字+单位，如10月" />)}
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
      description: '',
      amount: '',
      sale_type: this.goodsSaleTypeArr[0].value,
    });
    this.showModal();
  }
  nextStep() {
    this.props.changeStep(4);
  }

  render() {
    return (
      <div>
        <div className="clearfix">
          <Button type="primary" onClick={this.newPrice}><Icon type="plus" />新建售价</Button>
          <span className="fr">
            <Button type="primary" onClick={() => this.nextStep()}><Icon type="plus" />下一步</Button>
          </span>
        </div>
        <Modal
          visible={this.props.modalVisible}
          title="初始定价"
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

