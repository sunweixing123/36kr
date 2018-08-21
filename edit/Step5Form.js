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
      model: this.props.modelCell || {},
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
    this.accountTypeArrr = initState.getDictionary('goods_account_type');
  }

  shouldComponentUpdate() {
    return true;
  }

  componentWillReceiveProps(nextProps) {
    const { modelCell } = this.props;
    if (!lodash.isEqual(modelCell, nextProps.modelCell) && nextProps.modelCell) {
      this.setForm(nextProps.modelCell);
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
      receiver_name: model.receiver_name || '',
      account: model.account || '',
      account_description: model.account_description || '',
      account_type: model.account_type || this.accountTypeArrr[0].value,
      scale: model.scale || '',
	    receiver: model.receiver || '',
      user_id_producer: model.user_id_producer || '',
    });
  }

  handleSubmit(e) {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const data = {
          ...values,
        };
        this.doSubmit(data);
      }
    });
  }

  doSubmit(values) {
    const { sending, id } = this.state;
    const { id: userAllocationId } = this.props.modelCell || {};
    const { changeStep } = this.props;
    if (sending) {
      return true;
    }
    let success = false;
    const cbs = {
      success: (res, data) => {
        success = true;
        this.state.userAllocationId = userAllocationId || data.userAllocationId;
        this.props.refresh(!userAllocationId);
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
    api[userAllocationId ? 'put' : 'post']('goods-sharer', { id: userAllocationId }, values, cbs);
  }

  renderForm() {
    const { getFieldDecorator, getFieldValue } = this.props.form;

    const { model } = this.state;
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 18 },
    };
    return (
      <Form>
        <FormItem label="单人占比:" {...formItemLayout}>
          {getFieldDecorator('scale', {
            initialValue: this.state.model.scale || '',
            rules: [{ required: true, message: '数值填写不正确，请输入大于0小于1 的有理数' }, { pattern: /^(0\.\d{1,2}|1(\.0{1,2})?)$/, message: '数值填写不正确，请输入大于0小于1 的有理数' }],
          })(<Input placeholder="收款人所占有的商品分成比例，例如：0.3" />)}
        </FormItem>
        <FormItem label="子讲师姓名:" {...formItemLayout}>
          {getFieldDecorator('receiver', {
            initialValue: this.state.model.receiver || '',
            rules: [{ required: true, message: '请填写姓名' }],
          })(<Input placeholder="" />)}
        </FormItem>
        <FormItem label="子讲师Id:" {...formItemLayout}>
          {getFieldDecorator('user_id_producer', {
            initialValue: this.state.model.user_id_producer || '',
            rules: [{ required: true, message: '请填写Id' }],
          })(<Input placeholder="" />)}
        </FormItem>
        <FormItem label=" " {...formItemLayout} className="no-label">
          {getFieldDecorator('account_type', {
            initialValue: this.accountTypeArrr[0].value,
          })(<RadioGroup>
            {this.accountTypeArrr.map((cell, index) =>
              <RadioButton key={index} value={cell.value}>{cell.label}</RadioButton>)}
          </RadioGroup>)}
        </FormItem>
        <FormItem label="账号:" {...formItemLayout}>
          {getFieldDecorator('account', {
            initialValue: this.state.model.bank_account,
            rules: [{ required: true, message: '请输入正确无误的账号信息' }],
          })(<Input />)}

        </FormItem>
        <FormItem label="开户行:" {...formItemLayout}>
          {getFieldDecorator('account_description', {
            initialValue: this.state.model.bank_account,
            rules: [{ required: true, message: '请填写描述' }],
          })(<Input placeholder="如果是银行, 开户行信息精确到支行" />)}
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
      receiver: '',
      account: '',
      scale: '',
      account_description: '',
      account_type: this.accountTypeArrr[0].value,
      user_id_producer: '',
    });
    this.showModal();
  }

  render() {
    return (
      <div>
        <div className="clearfix"
          style={{
          marginBottom: '50px',
        }}
        >
          <div className="fr">
            <Button type="primary" onClick={this.newPrice}><Icon type="plus" />新建子讲师</Button>
          </div>
        </div>
        <Modal
          visible={this.props.modalVisible}
          title="新建子讲师利润比"
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

