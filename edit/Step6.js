import React, { Component } from 'react';
import { Form, Select, Button, Row, Col, Input, DatePicker, Radio, Alert, Modal, message } from 'antd';
import FormCtrl from '../../../components/common/utils/FormCtrl';
import api from '../../../../app-common/api';
import action from '../../../../app-common/action';
import lodash from 'lodash';
import initState from '../../../../app-common/dataResource/initState';
import moment from 'moment';


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
      model: {
      },
    };
    this.formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 12 },
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getGoods = this.getGoods.bind(this);
    this.shelveText = '请再次『确认』是否将商品『上架』，一旦『上架』即开始线上售卖';
    this.unShelveText = '请再次『确认』是否将商品『下架』，一旦『下架』即商品不继续在线上售卖';
  }

  shouldComponentUpdate() {
    return true;
  }

  componentWillReceiveProps() {
  }

  componentWillMount() {
  }

  componentDidMount() {
    this.getGoods();
  }

  handleSubmit(e) {
    const { getFieldsValue } = this.props.form;
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (values.shelved_at) {
          values.shelved_at = moment(values.shelved_at).format('YYYY-MM-DD HH:mm:ss');
        }
        this.doSubmit(values);
      }
    });
  }
  doSubmit(values, action) {
    const { id, sending } = this.state;
    if (sending) {
      return true;
    }
    let success = false;
    let tid = '';
    const cbs = {
      success: (res, data) => {
        tid = data.id;
        success = true;
        this.getGoods(true);
        message.success('操作成功');
      },
      complete: () => {
        this.setState({
          sending: false,
        }, () => {
          if (success) {
            this.props.router.push('/goods');
          }
        });
      },
    };

    this.setState({
      sending: true,
    });
    api.put('goods', { id, action: action || 'shelve' }, values, cbs);
  }

  getGoods(force) {
    console.log('getGoods');
    const _this = this;
    const { id, loading } = this.state;
    if (!id || loading) {
      return false;
    }

    const cbs = {
      success: (res, data) => {
        console.log('data', data);
        _this.setState({
          model: data,
        });
      },
      complete: () => {
        console.log('complete');
        _this.setState({
          loading: false,
        });
      },
    };
    _this.setState({
      loading: !force,
    });
    action.getStateById(id, 'goods', {}, force ? {} : cbs, force);
  }


  renderCtrl() {
    const { isEdit } = this.props;
    return (
      <Row>
        <Col span={6} />
        <Col span={6}>
          <Button
            type="primary"
            loading={this.state.sending}
            onClick={() => this.doConfirm()}
          >
            确认上架
          </Button>
        </Col>
      </Row>
    );
  }
  changeShelve(e) {
    const { getFieldValue, resetFields } = this.props.form;
    // name	true	varchar	商品名称
    // type	true	varchar	类型post/magazine
    // description	false	varchar	商品描述
    // key	true	varchar	商品key
    // external_scale	true	float	外部分成比
    // valid_at	true	float	有效期开始时间
    // unvalid_at	true	float	有效期结束时间
    if (e.target.value - 0 === 1) {
      resetFields(['shelved_at']);
    }
  }

  renderUnshelve() {
    return (
      <div style={{ marginTop: '100px' }}>
        <Form>
          <Row>
            <Col span={6} />
            <Col span={12}>
              <Alert
                message="Warning"
                description={this.unShelveText}
                type="warning"
                showIcon
              />
            </Col>
          </Row>
          <Row>
            <Col span={6} />
            <Col span={6}>
              <Button
                type="primary"
                loading={this.state.sending}
                size="large"
                onClick={() => this.doConfirm()}
              >
                立即下架
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }

  doConfirm() {
    const { model } = this.state;
    Modal.confirm({
      title: model.state === 'shelved' ? '确认下架' : '确认上架',
      content: model.state === 'shelved' ? this.unShelveText : this.shelveText,
      onOk: () => {
        if (model.state === 'shelved') {
          this.doSubmit(null, 'unshelve');
        } else {
          this.handleSubmit();
        }
      },
    });
  }

  render() {
    const { formItemLayout } = this;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    // name	true	varchar	商品名称
    // type	true	varchar	类型post/magazine
    // description	false	varchar	商品描述
    // key	true	varchar	商品key
    // external_scale	true	float	外部分成比
    // valid_at	true	float	有效期开始时间
    // unvalid_at	true	float	有效期结束时间
    const shelve_now = getFieldValue('shelve_now');
    const { model } = this.state;
    console.log('model', model);
    if (model && model.state === 'shelved') {
      return this.renderUnshelve();
    }
    const state = initState.getDictionaryDes('goods_state', model.state);
    const dis = model && model.state === 'unshelved';
    console.log(model.state);
    console.log(dis);
    return (
      <div>
        <Form>
          <FormItem label="目前状态:" {...formItemLayout}>
            <span>{state}</span>
          </FormItem>
          <FormItem label="上架设置:" {...formItemLayout}>
            {getFieldDecorator('is_set', {
              rules: [{ required: true }],
              initialValue: '1',
            })(<RadioGroup>
              <RadioButton key="bank" value="1">确认</RadioButton>
              {model.state === 'pre_shelve' ? <RadioButton key="zhifubao" value="0">取消</RadioButton> : null}
               </RadioGroup>)}
          </FormItem>
          <FormItem label="上架类型:" {...formItemLayout}>
            {getFieldDecorator('shelve_now', {
              rules: [{ required: true }],
              initialValue: '0',
            })(<RadioGroup onChange={e => this.changeShelve(e)}>
              <RadioButton key="bank" value="1">立即上架</RadioButton>
              {dis ? null : <RadioButton key="zhifubao" value="0">定时上架</RadioButton>
                }
               </RadioGroup>)}
          </FormItem>
          { dis ? null : (shelve_now - 0 === 0 ?
            <FormItem label="定时时间:" {...formItemLayout}>
              {getFieldDecorator('shelved_at', {
                initialValue: model.shelved_at ? moment(model.shelved_at) : null,
                rules: [{ type: 'object', required: shelve_now - 0 === 0, message: '请选择时间' }],
              })(<DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />) }
            </FormItem>
            :
            null)
          }
          <Row>
            <Col span={6} />
            <Col span={12}>
              <Alert
                message="Warning"
                description={this.shelveText}
                type="warning"
                showIcon
              />
            </Col>
          </Row>
          {this.renderCtrl()}
        </Form>
      </div>
    );
  }
}

export default Form.create()(RoleDetail);

