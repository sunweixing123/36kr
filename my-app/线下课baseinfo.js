import React, { Component } from 'react';
import { Form, Button, Row, Col, Input, DatePicker, Radio, message, Checkbox } from 'antd';
import { get, toString } from 'lodash';
import moment from 'moment';

import api from '../../../../app-common/api';
import initState from '../../../../app-common/dataResource/initState';
import UploadFileNew from '../../../components/common/utils/UploadFileNew';
import bucket from '../../../../app-common/config/upyun';
import './BaseInfo.less';


const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const { RangePicker } = DatePicker;
const emptyTemplate = {
};
let isOnComposition = false;
class RoleDetail extends Component {
  constructor(props) {
    super(props);
    this.typeList = initState.getDictionary('goods_type');

    this.state = {
      id: this.props.id || '',
      sending: false,
      ifInput: true,
      value: '微信搜索[开氪]关注服务号，在［我的－我的报名］中查看入场二维码，还能领取免费在线课程',
      showExampleImg: false,
      model: {
        summary_cover: '',
        name: '',
        type: 'ticket',
        valid_at: '',
        sms: '', //短信
        unvalid_at: '',
        chapters: '',
        weight: '',
        stock: '', //库存
        start_number: '',
        buy_limit: '',
        origin_stock: '',
        posters: [],
        reminder: '',
        instruction: '',
        session: '',
        address: '',
        start_time: '',
      },
    };
    this.state.model = this.props.model || this.state.model;

    this.formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 12 },
    };
    this.formItemLayout2 = {
      labelCol: { span: 1 },
      wrapperCol: { span: 12 },
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.CheckboxChange = this.CheckboxChange.bind(this);
    this.handleChangeInputLength = this.handleChangeInputLength.bind(this);
    this.showExpImg = this.showExpImg.bind(this);
    this.closeImg = this.closeImg.bind(this);
    this.composition = this.handleComposition.bind(this);
  }
  componentWillUpdate(nextProps) {
    const detailChanged = nextProps.detail
    && this.props.detail !== nextProps.detail;
    const isnew = !nextProps.detail && this.props.detail;
    const { model } = this.state;
    if (detailChanged) {
      const detail = { ...nextProps.detail };
      model.reminder = get(JSON.parse(get(model, 'extension.content')).goods_config, 'reminder');
      model.instruction = get(JSON.parse(get(model, 'extension.content')).goods_config, 'instruction');
      model.session = get(JSON.parse(get(model, 'extension.content')).goods_config, 'session');
      model.address = get(JSON.parse(get(model, 'extension.content')).goods_config, 'address');
      model.start_time = get(JSON.parse(get(model, 'extension.content')).goods_config, 'start_time');
      model.introInfo = get(JSON.parse(get(model, 'extension.content')).goods_config, 'introInfo');
      model.sms = get(model, 'extension.sms');
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
    this.getGoods();
  }

  getGoods() {
    const { id } = this.state;
    if (!id) {
      return;
    }
    const cbs = {
      success: (res, data) => {
        const model = data;
        const posters = get(model, 'posters');
        let buyLimt = true;
        // 设置限购的状态
        if (get(model, 'buy_limit') && parseInt(get(model, 'buy_limit'), 10) !== 0) {
          buyLimt = false;
        }
        if (posters) {
          model.posters = JSON.parse(posters);
        }
        if (get(model, 'extension.content')) {
          model.reminder = get(JSON.parse(get(model, 'extension.content')).goods_config, 'reminder');
          model.instruction = get(JSON.parse(get(model, 'extension.content')).goods_config, 'instruction');
          model.session = get(JSON.parse(get(model, 'extension.content')).goods_config, 'session');
          model.address = get(JSON.parse(get(model, 'extension.content')).goods_config, 'address');
          model.start_time = get(JSON.parse(get(model, 'extension.content')).goods_config, 'start_time');
          model.introInfo = get(JSON.parse(get(model, 'extension.content')).goods_config, 'introInfo');
        }
        model.sms = get(model, 'extension.sms');
        this.setState({
          model,
          ifInput: buyLimt,
        });
      },
      complete: () => {
      },
    };
    api.get(`goods-tickets/${id}`, {}, {}, cbs);
  }

  handleSubmit() {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (err) return message.error('表单错误');

      const data = {
        ...values,
        valid_at: values['range-time-picker'][0].format('YYYY-MM-DD HH:mm:ss'),
        unvalid_at: values['range-time-picker'][1].format('YYYY-MM-DD HH:mm:ss'),
      };
      data.type = data.type || this.state.model.type;
      delete data['range-time-picker'];


      const posters = get(data, 'posters');
      const tempPosters = [];
      const content = JSON.stringify({
        goods_config: {
          reminder: data.reminder,
          instruction: data.instruction,
          session: data.session,
          address: data.address,
          introInfo: data.introInfo,
          start_time: data.start_time,
        },
      });
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
      data.posters = JSON.stringify(tempPosters);
      data.content = content;
      this.doSubmit(data);
      return false;
    });
  }

  doSubmit(values) {
    const { id, sending } = this.state;
    if (sending) {
      return true;
    }
    let success = false;
    const cbs = {
      success: (res, data) => {
        success = true;
        this.state.id = id || data.id;
        this.getGoods();
      },
      complete: () => {
        this.setState({
          sending: false,
        }, () => {
          if (success) {
            this.state.model = { ...this.state.model, ...values };
            this.props.router.replace(`/goods/${this.state.id}/editunderline?step=1`);
          }
        });
      },
    };

    this.setState({
      sending: true,
    });
    api[id ? 'put' : 'post']('goods-tickets', { id }, values, cbs);
    return false;
  }
  handleComposition = (e: KeyboardEvent) => {
    if (e.type === 'compositionend') {
      // composition is end
      isOnComposition = false;
    } else {
      // in composition
      isOnComposition = true;
    }
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

  renderType() {
    const { id, model } = this.state;
    const { getFieldDecorator } = this.props.form;
    if (id) {
      return <RadioGroup><RadioButton value="">{initState.getDictionaryDes('goods_type', model.type)}</RadioButton></RadioGroup>;
    }
    return getFieldDecorator('type', {
      initialValue: model.type,
      rules: [{ required: true }],
    })(<RadioGroup disabled>
      {this.typeList.map((cell, index) =>
        <RadioButton key={index} value={cell.value}>{cell.label}</RadioButton>)}
    </RadioGroup>);
  }
  CheckboxChange() {
    this.setState({
      ifInput: !this.state.ifInput,
    });
  }
  handleChangeInputLength(e, len) {
    const val = e.target.value;
    if (!isOnComposition) {
      if (val.length > len) {
        e.target.value = val.substring(0, len);
      }
    }
  }
  showExpImg() {
    this.setState({
      showExampleImg: true,
    });
  }

  closeImg() {
    this.setState({
      showExampleImg: false,
    });
    document.getElementsByClassName('exampleImgs')[0].style.display = 'none';
  }

  render() {
    const { formItemLayout, formItemLayout2 } = this;
    const { getFieldDecorator } = this.props.form;
    const {
      model, value, ifInput, showExampleImg,
    } = this.state;
    const nameLen = toString(model.name).length;
    const smsLen = toString(model.sms).length;
    const reminderLen = toString(model.reminder).length;
    const introInfoLen = toString(model.introInfo).length;
    const sessionLen = toString(model.session).length;
    const addressLen = toString(model.address).length;
    const startTimeLen = toString(model.start_time).length;
    const smallInfo = UploadFileNew.getPicInfo({
      size: [300, 375],
    });
    
    return (
      <div className="baseinfo-wrapper">
        <Form>
          <FormItem label="上传课程封面图:" {...formItemLayout} help={smallInfo.text}>
            {getFieldDecorator('summary_cover', {
              initialValue: model.summary_cover,
              normalize: UploadFileNew.normFile,
              rules: [{ required: true, message: '请上传课程封面图' }],
            })(<UploadFileNew picInfo={smallInfo} url={model.summary_cover} />)}
          </FormItem>
          <FormItem label="课程名称:" {...formItemLayout}>
            <Row>
              <Col span={18}>{getFieldDecorator('name', {
              initialValue: model.name,
              rules: [{ required: true, message: '请填写课程名称' }],
            })(<Input
              onChange={e => this.handleChangeInputLength(e, 20)}
              onCompositionStart={e => this.handleComposition(e)}
              onCompositionUpdate={e => this.handleComposition(e)}
              onCompositionEnd={e => this.handleComposition(e)}
            />)}
              </Col>
              <Col span={1} />
              <Col span={2}><span style={nameLen > 20 ? { color: '#f00' } : {}}>{nameLen}</span>/20</Col>
            </Row>
          </FormItem>
          <FormItem label="课程开始时间:" {...formItemLayout}>
            <Row>
              <Col span={18}>{getFieldDecorator('start_time', {
              initialValue: model.start_time,
              rules: [{ required: true, message: '请填写课程开始时间' }],
            })(<Input placeholder="对用户展示的时间文本信息，与课程上线下线时间无关，例：2018年7月28日"
              onChange={e => this.handleChangeInputLength(e, 50)}
              onCompositionStart={e => this.handleComposition(e)}
              onCompositionUpdate={e => this.handleComposition(e)}
              onCompositionEnd={e => this.handleComposition(e)}
            />)}
              </Col>
              <Col span={1} />
              <Col span={2}><span style={startTimeLen > 50 ? { color: '#f00' } : {}}>{startTimeLen}</span>/50</Col>
            </Row>
          </FormItem>
          <FormItem label="课程地址:" {...formItemLayout}>
            <Row>
              <Col span={18}>{getFieldDecorator('address', {
              initialValue: model.address,
              rules: [{ required: true, message: '请填写课程地址' }],
            })(<Input type="textarea"
              onChange={e => this.handleChangeInputLength(e, 44)}
              onCompositionStart={e => this.handleComposition(e)}
              onCompositionUpdate={e => this.handleComposition(e)}
              onCompositionEnd={e => this.handleComposition(e)}
            />)}
              </Col>
              <Col span={1} />
              <Col span={2}><span style={addressLen > 44 ? { color: '#f00' } : {}}>{addressLen}</span>/44</Col>
            </Row>
          </FormItem>
          <FormItem label="购买后短信文案:" {...formItemLayout}>
            <Row>
              <span>恭喜您预订成功[课程名]！名额[数量]位，活动当天凭二维码入场。</span>
              <Col span={18}>{getFieldDecorator('sms', {
              initialValue: model.sms || value,
              rules: [{ required: true, message: '请填写购票后短信文案' }],
            })(<Input type="textarea"
              onChange={e => this.handleChangeInputLength(e, 50)}
              onCompositionStart={e => this.handleComposition(e)}
              onCompositionUpdate={e => this.handleComposition(e)}
              onCompositionEnd={e => this.handleComposition(e)}
            />)}
              </Col>
              <Col span={1} />
              <Col span={2}><span style={smsLen > 50 ? { color: '#f00' } : {}}>{smsLen || value.length}</span>/50</Col>
            </Row>
          </FormItem>
          <FormItem label="创建时间：" {...formItemLayout}>
            <Row>
              <Col span={18}>{getFieldDecorator('created_at', {
                initialValue: '',
              })(<Input disabled placeholder="保存后生成" />)}
              </Col>
            </Row>
          </FormItem>
          <FormItem label="档位名称:" {...formItemLayout}>
            <Row>
              <Col span={18}>{getFieldDecorator('session', {
              initialValue: model.session,
              rules: [{ required: true, message: '请填写档位名称' }],
            })(<Input
              onCompositionStart={e => this.handleComposition(e)}
              onCompositionUpdate={e => this.handleComposition(e)}
              onCompositionEnd={e => this.handleComposition(e)}
              onChange={e => this.handleChangeInputLength(e, 5)}
            />)}
              </Col>
              <Col span={1} />
              <Col span={2}><span style={sessionLen > 5 ? { color: '#f00' } : {}}>{sessionLen}</span>/5</Col>
            </Row>
          </FormItem>
          <FormItem label="该档位对应库存:" {...formItemLayout}>
            <Row>
              <Col span={18}>{getFieldDecorator('origin_stock', {
                  initialValue: model.origin_stock,
                  rules: [{ required: true, message: '请填写整数' }, { pattern: /^[0-9][0-9]*$/, message: '请填写整数' }],
                  validateTrigger: 'onBlur',
                   })(<Input placeholder="请填写整数" />)}
              </Col>
            </Row>
          </FormItem>
          <FormItem label="座位编号:" {...formItemLayout}>
            <Row>
              <Col span={4}>{getFieldDecorator('start_number', {
                  initialValue: model.start_number,
                  rules: [{ required: true, message: '请填写整数' }, { pattern: /^[0-9][0-9]*$/, message: '请填写整数' }],
                  validateTrigger: 'onBlur',
                   })(<Input placeholder="请填写整数" />)}
              </Col>
            </Row>
          </FormItem>
          <FormItem label="课程有效期配置:" {...formItemLayout}>
            {getFieldDecorator('range-time-picker', {
              initialValue: model.valid_at && model.unvalid_at ? [moment(model.valid_at), moment(model.unvalid_at)] : null,
              rules: [{ required: true, message: '请选择开始时间', type: 'array' }],
            })(<RangePicker showTime format="YYYY-MM-DD HH:mm:ss" />)}
          </FormItem>
          <FormItem label="预定说明:" {...formItemLayout}>
            <Row>
              <Col span={18}>{getFieldDecorator('introInfo', {
              initialValue: model.introInfo,
              })(<Input type="textarea"
                rows={4}
                onChange={e => this.handleChangeInputLength(e, 300)}
                onCompositionStart={e => this.handleComposition(e)}
                onCompositionUpdate={e => this.handleComposition(e)}
                onCompositionEnd={e => this.handleComposition(e)}
              />)}
              </Col>
              <Col span={1} />
              <Col span={2}><span style={introInfoLen > 300 ? { color: '#f00' } : {}}>{introInfoLen}</span>/300</Col>
            </Row>
          </FormItem>
          <FormItem label="使用说明:" {...formItemLayout}>
            <Row>
              <Col span={18}>{getFieldDecorator('reminder', {
                initialValue: model.reminder ||
`1. 请勿外传二维码，以免被他人盗用
2. 微信搜索[开氪]关注服务号，在［我的－我的报名］中查看入场二维码
3. 如需开具发票，请关注微信服务号［开氪］，点击［我的－开发票］，按提示操作即可`,
                rules: [{ required: true, message: '请填写使用说明' }],
              })(<Input type="textarea"
                rows={4}
                onChange={e => this.handleChangeInputLength(e, 300)}
                onCompositionStart={e => this.handleComposition(e)}
                onCompositionUpdate={e => this.handleComposition(e)}
                onCompositionEnd={e => this.handleComposition(e)}
              />)}
              </Col>
              <Col span={1} />
              <Col span={2}><span style={reminderLen > 300 ? { color: '#f00' } : {}}>{reminderLen}</span>/300</Col>
            </Row>
          </FormItem>
          <div className="underLine-buy-container">
            <Col span={5} className="underLine-checkbox">
              <Checkbox onChange={this.CheckboxChange} checked={!ifInput} />
            </Col>
            <FormItem label="限购:" {...formItemLayout2}>
              <Row>
                <Col span={4}>{getFieldDecorator('buy_limit', {
                    initialValue: (ifInput === false) ? model.buy_limit : '',
                    rules: (ifInput === false) ? [{ required: true, message: '请填写单个用户限制份数' }, { pattern: /^[1-9][0-9]*$/, message: '请填写整数' }] : '',
                    validateTrigger: 'onBlur',
                    })(<Input disabled={ifInput} />)}
                </Col>
              </Row>
            </FormItem>
          </div>
          <FormItem
            {...formItemLayout}
            label="示例图："
          >
            <a href="javascript:void(0);" onClick={this.showExpImg}>【活动】示例图，点击查看&gt;&gt;</a>
          </FormItem>
          {this.renderCtrl()}
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
      </div>
    );
  }
}

export default Form.create()(RoleDetail);

