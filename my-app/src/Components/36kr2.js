/**
 * Created by banqi on 17/3/24.
 */
import React, { Component } from 'react';
import { withRouter, browserHistory } from 'react-router';
import moment from 'moment';
import { Row, Col, Button, Form, Input, Select, DatePicker, Modal } from 'antd';
import { get, isEmpty, find } from 'lodash';

import FormCtrl from '../../../components/common/utils/FormCtrl';
import UploadFileNew from '../../../components/common/utils/UploadFileNew';
import api from '../../../../app-common/api';
import willLeave from '../../../components/common/utils/WillLeave';
import UploadImageList from '../../../components/common/utils/UploadImageList';
import bucket from '../../../../app-common/config/upyun';

import './Detail.less';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;


const emptyTemplate = {
  goods_list: [],
};

class BatchDetail extends Component {
  constructor(props) {
    super(props);
    this.formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 12 },
    };

    this.state = {
      success: false,
      goods: [],
      enableClose: false,
      start_time: '',
      end_time: '',
      showExampleImg: false, //显示示例图
      model: {
        title: '',
        home_btn: '',
        ticket_ok: '',
        ticket_no: '',
        notice_info: '',
        posters: [],
      },
    };
    this.state.model = this.props.model || this.state.model;

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.getGoods = this.getGoods.bind(this);
    this.handleValues = this.handleValues.bind(this);
    this.showExpImg = this.handleShowExampleImg.bind(this);
    this.closeImg = this.handleCloseImg.bind(this);
    this.changeInputLength = this.handleChangeInputLength.bind(this);
  }

  componentWillUpdate(nextProps) {
    const detailChanged = nextProps.detail
      && this.props.detail !== nextProps.detail;
    const isnew = !nextProps.detail && this.props.detail;
    if (detailChanged) {
      const detail = { ...nextProps.detail };
      const goodsList = [];
      if (detail.goods) {
        detail.goods.forEach((e) => {
          goodsList.push(e.id);
        });
      }
      detail.goods_list = goodsList;
      // 设置分享信息
      detail.share_title = get(detail, 'attributes.share_title');
      detail.share_description = get(detail, 'attributes.share_description');
      detail.share_cover = get(detail, 'attributes.share_cover');
      // 首页图片
      detail.posters = get(detail, 'attributes.posters');
      // 首页底部按钮文案
      detail.home_btn = get(detail, 'attributes.configs.home_btn.goods_confg') || '立即购买';
      // 底部支付按钮文案-有库存
      detail.ticket_ok = get(detail, 'attributes.ticket_ok') || '去支付';
      // 底部支付按钮文案-无库存
      detail.ticket_no = get(detail, 'attributes.ticket_no') || '名额已订完';
      // 售票提醒
      detail.notice_info = get(detail, 'attributes.notice_info') || '*课程售出后不可退、不可换';

      delete detail.goods_id;
      delete detail.attributes;
      this._setFormFields(detail);
    }

    if (isnew) {
      this._setFormFields(emptyTemplate);
    }
  }

  componentWillReceiveProps() {
    const { getFieldsValue } = this.props.form;
    const formValue = getFieldsValue();
    let { model } = this.state;
    model = { ...model, ...formValue };
    this.state.model = model;
  }

  componentDidMount() {
    this._setFormFields(emptyTemplate);
    this.getGoods();
  }

  getGoods() {
    const cbs = {
      success: (res, data) => {
        const goods = data.data;
        this.setState({ goods });
      },
      complete: () => {

      },
    };
    api.get('goods', {}, {
      per_page: 10000,
      is_free: 0,
      state: 'shelved',
      type: 'pay_column',
    }, cbs);
  }

  handleValues(value) { //发送前处理数据
    // goods_relations 接收一个数组
    value.goods_relations = value.goods_list;
    value.start_time = this.state.start_time || this.props.start_time;
    value.end_time = this.state.end_time || this.props.end_time;
    // 将按钮文案放到configs中
    value.extension.content.goods_configs = {
      home_btn: value.home_btn,
      ticket_ok: value.ticket_ok,
      ticket_no: value.ticket_no,
      notice_info: value.notice_info,
    };

    const posters = get(value, 'posters');
    const tempPosters = [];
    if (posters && posters.length > 0) {
      for (let i = 0; i < posters.length; i++) {
        let temp = {};
        if (get(posters[i], 'response')) {
          temp = {
            uid: get(posters[i], 'uid'),
            url: `${bucket.url}${get(posters[i], 'response.url')}`,
          };
        } else {
          temp = posters[i];
        }
        tempPosters.push(temp);
      }
    }
    value.posters = JSON.stringify(tempPosters);

    delete value.goods_list;
    delete value.date_data;
    delete value.home_btn;
    delete value.ticket_ok;
    delete value.ticket_no;
    delete value.notice_info;
    console.log(JSON.stringify(value));
    return value;
  }

  handleSubmit(e) {
    const _this = this;
    const { id } = this.props.params;
    const { sending } = this.state;
    e.preventDefault();
    if (sending) return;
    _this.props.form.validateFieldsAndScroll((errors, values) => {
      let formValues = { ...values };
      formValues = this.handleValues(formValues);
      const cbs = {
        success: () => {
          this.state.success = true;
          this.props.setLeave();
        },
        complete: () => {
          this.setState({
            sending: false,
          });
        },
      };

      if (errors) {
        console.log('Errors in form!!!', errors);
        return;
      }

      function postData() {
        _this.setState({
          sending: true,
        });
        if (!_this.props.isCreate && id !== -1) { //编辑
          api.put('campaigns', {
            id,
          }, formValues, cbs);
        } else { //新增
          api.post('campaigns', {}, formValues, cbs);
        }
      }
      postData();
    });
  }

  _setFormFields(data) {
    const { setFieldsValue } = this.props.form;
    if (data.start_time && data.end_time) {
      data.date_data = [moment(data.start_time), moment(data.end_time)];
    }
    setFieldsValue(data);
  }

  handleCancel() {
    browserHistory.push('/activity');
  }

  handleOFF = () => {
    const _this = this;
    Modal.confirm({
      title: '确认下线吗?',
      content: '确认后，线上活动会立即结束，是否线下活动',
      okText: '确认',
      cancelText: '取消',
      onCancel() {
      },
      onOk() {
        const { id } = _this.props.params;
        const cbs = {
          success: () => {
            _this.state.success = true;
            _this.props.setLeave();
          },
          complete: () => {
            _this.setState({
              sending: false,
            });
          },
        };
        api.put(`campaigns/${id}/finish`, {}, {}, cbs);
      },
    });
  }

  handleChangeInputLength(e, len) {
    const val = e.target.value;
    if (val.length > len) {
      e.target.value = val.substring(0, len);
    }
  }

  renderCtrl() {
    const { isCreate } = this.props;
    let button = '';
    // 下线的规则不可以修改任何字段
    if (get(this.props, 'detail.state') === 'finished') {
      button = (
        <div>
          <Button
            type="primary"
            onClick={this.handleCancel}
          >
            {'返回'}
          </Button>
        </div>
      );
    } else {
      button = (
        <div>
          <Button
            type="primary"
            loading={this.state.sending}
            onClick={this.handleSubmit}
          >
            {isCreate ? '新建' : '修改'}
          </Button>
          {
            !isCreate
            ? <Button
              type="primary"
              onClick={this.handleOFF}
            >
              {'下线'}
            </Button>
            : null
          }
          <Button
            type="primary"
            onClick={this.handleCancel}
          >
            {'返回'}
          </Button>
        </div>
      );
    }
    return (
      <Row>
        <Col span={6} />
        <Col span={12}>
          <FormCtrl
            redirect="/activity?clear=true"
            success={this.state.success}
            buttonArr={[button]}
          />
        </Col>
      </Row>
    );
  }

  handleShowExampleImg() {
    this.setState({
      showExampleImg: true,
    });
  }

  handleCloseImg() {
    this.setState({
      showExampleImg: false,
    });
    document.getElementsByClassName('exampleImgs')[0].style.display = 'none';
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { formItemLayout } = this;
    const {
      goods, enableClose, showExampleImg, model,
    } = this.state;

    const smallInfo = UploadFileNew.getPicInfo({
      size: [300, 300],
    });
    const bigInfo = UploadFileNew.getPicInfo({
      size: [750, 3200],
    });
    const titleLen = (get(model, 'title') && get(model, 'title').length) || 0;
    const homeBtnLen = (get(model, 'home_btn') && get(model, 'home_btn').length) || 0;
    const noticeInfoLen = (get(model, 'notice_info') && get(model, 'notice_info').length) || 0;
    const tickectOkLen = (get(model, 'ticket_ok') && get(model, 'ticket_ok').length) || 0;
    const tickectNoLen = (get(model, 'ticket_no') && get(model, 'ticket_no').length) || 0;

    return (
      <div>
        <Form horizontal>
          <FormItem label="活动Topbar:" {...formItemLayout}>
            <Row>
              <Col span={18}>{getFieldDecorator('title', {
                initialValue: '',
                rules: [{ required: true, message: '请填写活动门票Topbar' }],
              })(<Input placeholder="门票主页页面Topbar"
                onChange={e => this.handleChangeInputLength(e, 15)}
              />)}
              </Col>
              <Col span={1} />
              <Col span={2}><span style={titleLen > 15 ? { color: '#f00' } : {}}>{titleLen}</span>/15</Col>
            </Row>
          </FormItem>

          <FormItem label="上传首页图片:" {...formItemLayout} help={`${bigInfo.text},可上传多张图片无缝拼接`}>
            {getFieldDecorator('posters', {
              initialValue: '',
              rules: [{ required: true, message: '至少上传一张首页图片' }],
            })(<UploadImageList picInfo={bigInfo} />)}
          </FormItem>

          <FormItem label="首页底部按钮文案:" {...formItemLayout}>
            <Row>
              <Col span={18}>{getFieldDecorator('home_btn', {
                initialValue: '立即抢购',
                rules: [{ required: true, message: '请填写首页底部按钮文案' }],
              })(<Input onChange={e => this.handleChangeInputLength(e, 15)} />)}
              </Col>
              <Col span={1} />
              <Col span={2}><span style={homeBtnLen > 15 ? { color: '#f00' } : {}}>{homeBtnLen}</span>/15</Col>
            </Row>
          </FormItem>

          <FormItem label="售票提醒:" {...formItemLayout}>
            <Row>
              <Col span={18}>{getFieldDecorator('notice_info', {
                initialValue: '*课程售出后不可退、不可换',
              })(<Input type="textarea" onChange={e => this.handleChangeInputLength(e, 50)} />)}
              </Col>
              <Col span={1} />
              <Col span={2}><span style={noticeInfoLen > 50 ? { color: '#f00' } : {}}>{noticeInfoLen}</span>/50</Col>
            </Row>
          </FormItem>

          {/* <FormItem label="预定说明:" {...formItemLayout}>
            <Row>
              <Col span={18}>{getFieldDecorator('description', {
              initialValue: '',
            })(<Input type="textarea" rows={4} />)}
              </Col>
              <Col span={1} />
              <Col span={2}><span style={descriptionLen > 300 ? { color: '#f00' } : {}}>{descriptionLen}</span>/300</Col>
            </Row>
          </FormItem> */}

          <FormItem label="底部支付按钮文案-有库存:" {...formItemLayout}>
            <Row>
              <Col span={18}>{getFieldDecorator('ticket_ok', {
                initialValue: '去支付',
                rules: [{ required: true, message: '请填写底部支付按钮文案' }],
              })(<Input onChange={e => this.handleChangeInputLength(e, 15)} />)}
              </Col>
              <Col span={1} />
              <Col span={2}><span style={tickectOkLen > 15 ? { color: '#f00' } : {}}>{tickectOkLen}</span>/15</Col>
            </Row>
          </FormItem>

          <FormItem label="底部支付按钮文案-无库存:" {...formItemLayout}>
            <Row>
              <Col span={18}>{getFieldDecorator('ticket_no', {
                initialValue: '名额已订完',
                rules: [{ required: true, message: '请填写底部支付按钮文案' }],
              })(<Input onChange={e => this.handleChangeInputLength(e, 15)} />)}
              </Col>
              <Col span={1} />
              <Col span={2}><span style={tickectNoLen > 15 ? { color: '#f00' } : {}}>{tickectNoLen}</span>/15</Col>
            </Row>
          </FormItem>

          {/* <FormItem label="使用说明:" {...formItemLayout}>
            <Row>
              <Col span={18}>{getFieldDecorator('description', {
              initialValue:
`1. 请勿外传二维码，以免被他人盗用
2. 微信搜索[开氪]关注服务号，在［我的－我的报名］中查看入场二维码
3. 如需开具发票，请关注微信服务号［开氪］，点击［我的－开发票］，按提示操作即可`,
              rules: [{ required: true, message: '请填写使用说明' }],
            })(<Input type="textarea" rows={4} />)}
              </Col>
              <Col span={1} />
              <Col span={2}><span style={descriptionLen > 300 ? { color: '#f00' } : {}}>{descriptionLen}</span>/300</Col>
            </Row>
          </FormItem> */}

          <FormItem {...formItemLayout} label="关联商品：">
            {getFieldDecorator('reminder', {
              rules: [{ required: true, message: '请选择关联商品' }],
            })(<Select
              mode="multiple"
              placeholder="请选择关联商品"
            >
              { goods.map(cell =>
                <Option key={cell.id} value={cell.id}>{get(cell, 'name_mobile')}</Option>)}
            </Select>)}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="活动时间:"
          >
            {getFieldDecorator('date_data', {
              initialValue: null,
              rules: [{ required: true, message: '请选择活动时间' }],
            })(<RangePicker
              showTime={{
                defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
              }}
              format="YYYY-MM-DD HH:mm:ss"
              onChange={(values, labels) => {
                this.state.start_time = labels[0]; // eslint-disable-line
                this.state.end_time = labels[1]; // eslint-disable-line
              }}
            />)}
          </FormItem>

          <FormItem label="分享小图:" {...this.formItemLayout} help={smallInfo.text}>
            {getFieldDecorator('share_cover', {
              initialValue: '',
              normalize: UploadFileNew.normFile,
              rules: [{ required: true, message: '分享小图为必填项' }],
            })(<UploadFileNew picInfo={smallInfo} url="" enableClick={enableClose} />)}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="分享主标题："
          >
            {getFieldDecorator(
              'share_title',
              {
                initialValue: '',
                rules: [{ required: true, message: '请填写分享主标题' }],
              },
            )(<Input placeholder="分享主标题" disabled={enableClose} />)}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="分享副标题："
          >
            {getFieldDecorator(
              'share_description',
              {
                initialValue: '',
                rules: [{ required: true, message: '请填写分享副标题' }],
              },
            )(<Input placeholder="分享副标题" disabled={enableClose} />)}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="创建时间："
          >
            {getFieldDecorator(
              'created_at',
              {
                initialValue: '',
              },
            )(<Input disabled placeholder="保存后生成" />)}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label="示例图："
          >
            <a href="javascript:void(0);" onClick={this.showExpImg}>【活动】示例图，点击查看&gt;&gt;</a>
          </FormItem>
        </Form>
        {showExampleImg
          ?
            <div className="exampleImgs">
              <div>
                <img src="https://pic.36krcnd.com/201807/18104333/asmpwlvfnlqc8c3q.png" alt="logo" />
                <img src="https://pic.36krcnd.com/201807/18104333/5l8nhy7oyq27ejjw.png" alt="logo" />
                <img src="https://pic.36krcnd.com/201807/18104333/qbab6234hf4hzcpq.png" alt="logo" />
              </div>
              <Button type="primary" onClick={this.closeImg}>关闭</Button>
            </div>
          : null
        }

        {this.renderCtrl()}
      </div>);
  }
}

export default withRouter(willLeave()(Form.create({})(BatchDetail)));

