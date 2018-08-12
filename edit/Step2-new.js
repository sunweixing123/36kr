import React, { Component } from 'react';
import { Form, Select, Button, Row, Col, Input, DatePicker, Radio, Card } from 'antd';
import FormCtrl from '../../../components/common/utils/FormCtrl';
import api from '../../../../app-common/api';
import action from '../../../../app-common/action';
import lodash from 'lodash';
import './step2.less';
import UploadFileNew from '../../../components/common/utils/UploadFileNew';
import Ueditor from '../../../components/common/utils/Ueditor';
import config from '../../../../app-common/config/config';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const RangePicker = DatePicker.RangePicker;

let tempData = {};

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
    this.state.model = {};
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillReceiveProps() {
    this.state.model = this.getExtension() || this.state.model;
  }

  componentDidMount() {
    const ext = this.getExtension();
    if (!ext) {
      this.getData();
    }
  }

  getExtension() {
    const { id } = this.state;
    const { setFieldsValue } = this.props.form;
    let data = action.getStateByName(`goods-extension-${id}`, 'goods-extension');
    if (data && data.content) {
      this.state.configId = data.id;
      data = JSON.parse(data.content).goods_config;
      if (!this.inited) {
        this.inited = true;
        tempData = data;
        setFieldsValue({ ...data });
      }
      return data;
    }
    return null;
  }

  handleSubmit(flag) {
    const { getFieldsValue } = this.props.form;
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.doSubmit(values, flag);
      }
    });
  }

  doSubmit(values, flag) {
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
          if (success && flag !== false) {
            this.props.router.replace(`${this.props.location.pathname}?step=3`);
          }
        });
      },
    };

    this.setState({
      sending: true,
    });
    const configId = this.state.configId;
    const content = JSON.stringify({ goods_config: { ...tempData, ...values } });

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
    const { isEdit, params } = this.props;
    const url = `${config.index.indexUrl}/goods/${params.id}/preview`;
    return (
      <Row className="mb-10">
        <Col span={6} />
        <Col span={18}>
          <Button
            type="primary"
            className="mr-20"
            loading={this.state.sending}
            onClick={this.handleSubmit}
          >
            {isEdit ? '修改并下一步' : '保存并下一步'}
          </Button>
          <Button
            type="primary"
            loading={this.state.sending}
            className="mr-20"
            onClick={() => this.handleSubmit(false)}
          >
            保存
          </Button>
          <a className="mr-20" href={url} target="_blank"> 预览</a>
          <span className="" style={{ color: 'red' }}>预览前请先保存</span>
        </Col>
      </Row>
    );
  }

  handlEditorChange(content) {
    const { setFieldsValue } = this.props.form;
    setFieldsValue({ rich_text: content });
  }

  render() {
    const { formItemLayout } = this;
    const { getFieldDecorator } = this.props.form;
    const coverInfo = UploadFileNew.getPicInfo({
      size: [1242, 530],
    });

    const { model } = this.state;

    return (
      <div>
        <Form>
          <div className="config-box">
            <div style={{ width: '480px', margin: '0 auto' }}>
              {
                getFieldDecorator('rich_text')(<Ueditor id="writerEditor" ref={(input) => { this.writerEditor = input; }} onChange={con => this.handlEditorChange(con)} />)
              }
            </div>
          </div>
          {this.renderCtrl()}
        </Form>
      </div>
    );
  }
}

export default Form.create()(RoleDetail);

