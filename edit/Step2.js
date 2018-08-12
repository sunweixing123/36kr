import React, { Component } from 'react';
import { Form, Select, Button, Row, Col, Input, DatePicker, Radio, Card } from 'antd';
import FormCtrl from '../../../components/common/utils/FormCtrl';
import api from '../../../../app-common/api';
import action from '../../../../app-common/action';
import lodash from 'lodash';
import './step2.less';
import UploadFileNew from '../../../components/common/utils/UploadFileNew';

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
      model: {},
    };
    this.formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 12 },
    };
    this.state.model = this.getExtension() || {};
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  shouldComponentUpdate() {
    return true;
  }

  componentWillReceiveProps() {
    this.state.model = this.getExtension() || this.state.model;
    console.log(this.state.model);
  }

  componentWillMount() {
  }

  componentDidMount() {
    const ext = this.getExtension();
    if (!ext) {
      this.getData();
    }
  }

  getExtension() {
    const { id } = this.state;
    let data = action.getStateByName(`goods-extension-${id}`, 'goods-extension');
    if (data && data.content) {
      this.state.configId = data.id;
      console.log(data, data.id);
      data = JSON.parse(data.content).goods_config;
      return data;
    }
    return null;
  }

  handleRoleChange() {

  }

  handleSubmit(e) {
    const { getFieldsValue } = this.props.form;
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.doSubmit(values);
      }
    });
  }

  doSubmit(values) {
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
        this.getData(true);
      },
      complete: () => {
        this.setState({
          sending: false,
        }, () => {
          if (success) {
            this.props.router.replace(`${this.props.location.pathname}?step=3`);
          }
        });
      },
    };

    this.setState({
      sending: true,
    });
    const configId = this.state.configId;
    const content = JSON.stringify({ goods_config: values });

    api[configId ? 'put' : 'post']('goods-extension', { id: configId }, { goods_id: id, content }, cbs);
  }

  getData(clear) {
    const { id, loading } = this.state;
    if (!id) {
      this.props.router.replace('/goods/new');
    }
    if (!id || loading) {
      return false;
    }
    const cbs = {
      success: (res, data) => {
      },
      complete: () => {
        this.setState({
          loading: false,
        });
      },
    };
    this.setState({
      loading: true,
    });
    action.doActionByName('goods-extension', { api: 'goods-extension', params: { id } }, {
      reResultName: `goods-extension-${id}`,
      clear,
    }, clear ? {} : cbs);
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
            onClick={this.handleSubmit}
          >
            {isEdit ? '修改并下一步' : '保存并下一步'}
          </Button>
        </Col>
      </Row>
    );
  }

  render() {
    const { formItemLayout } = this;
    const { getFieldDecorator } = this.props.form;


    const { model } = this.state;
    return (
      <div>
        <Form>
          <div className="config-box">
            <h2>商品详情页配置</h2>


          </div>
          {this.renderCtrl()}
        </Form>
      </div>
    );
  }
}

export default Form.create()(RoleDetail);

