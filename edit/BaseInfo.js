import React, { Component } from 'react';
import { Form, Select, Button, Row, Col, Input, DatePicker, Radio, InputNumber, message } from 'antd';
import { get, toString } from 'lodash';
import moment from 'moment';

import FormCtrl from '../../../components/common/utils/FormCtrl';
import api from '../../../../app-common/api';
import initState from '../../../../app-common/dataResource/initState';
import action from '../../../../app-common/action';
import UploadFileNew from '../../../components/common/utils/UploadFileNew';
import UploadImageList from '../../../components/common/utils/UploadImageList';
import bucket from '../../../../app-common/config/upyun';
import './BaseInfo.less';


const FormItem = Form.Item;
const Option = Select.Option;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const RangePicker = DatePicker.RangePicker;
let HasTags = false;
class RoleDetail extends Component {
  constructor(props) {
    super(props);
    // name	true	varchar	课程名称
    // type	true	varchar	类型post/magazine
    // description	false	varchar	课程描述
    // key	true	varchar	课程key
    // external_scale	true	float	外部分成比
    // valid_at	true	float	有效期开始时间
    // unvalid_at	true	float	有效期结束时间
    this.typeList = initState.getDictionary('goods_type');

    this.state = {
      success: false,
      id: this.props.id || '',
      sending: false,
      model: {
        type: this.typeList[0].value,
        key: '',
        valid_at: '',
        unvalid_at: '',
        summary_cover: '',
        chapters: '',
	      weight: '',
        qrcode_url: '',
        posters: [],
      },
      tagsChildren: [],
    };
    this.state.model = this.props.model || this.state.model;

    this.formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 12 },
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.tagsChildren = this.tagsChildren.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { getFieldsValue } = this.props.form;
    const formValue = getFieldsValue();
    let { model } = this.state;
    model = { ...model, ...formValue };
    this.state.model = model;
  }

  componentDidMount() {
    this.getGoods();
    this.tagsChildren();
    HasTags = false;
  }

  componentWillUpdate() {
    const { isEdit } = this.props;
    if (isEdit) {
      this._setFormFields();
    }
  }

  _setFormFields() {
    const { setFieldsValue } = this.props.form;
    const formValue = this.props.form.getFieldsValue();
    if (!HasTags && get(this.state.model, 'tag_ids') && get(this.state.model, 'tag_ids.0') !== '0') {
      HasTags = true;
      const ids = [];
      get(this.state.model, 'tag_ids').map(cell =>
        ids.push(get(cell, 'id')));
      formValue.tag_ids = ids;

      setFieldsValue(formValue);
    }
  }

  getGoods(force) {
    const { id, loading } = this.state;
    if (!id || loading) {
      return false;
    }
    const cbs = {
      success: (res, data) => {
        const model = data;
        const posters = get(model, 'posters');
        if (posters) {
          model.posters = JSON.parse(posters);
        }
	      this.setState({
		      model,
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


  tagsChildren() {
    const cbs = {
      success: (res, data) => {
        this.setState({ tagsChildren: data });
      },
      error: () => {
        console.log('error');
      },
    };
    api.get('goods-tags/index', {}, { per_page: 10000 }, cbs);
  }

  handleSubmit(e) {
    const { getFieldsValue } = this.props.form;
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

      this.doSubmit(data);
    });
  }

  doSubmit(values) {
    const { id, sending } = this.state;
    const { changeStep } = this.props;
    if (sending) {
      return true;
    }
    let success = false;
    const cbs = {
      success: (res, data) => {
        success = true;
        this.state.id = id || data.id;
        this.getGoods(true);
      },
      complete: () => {
        this.setState({
          sending: false,
        }, () => {
          if (success) {
            this.state.model = { ...this.state.model, ...values };
            this.props.router.replace(`/goods/${this.state.id}/edit?step=1`);
          }
        });
      },
    };

    this.setState({
      sending: true,
    });
    api[id ? 'put' : 'post']('goods', { id }, values, cbs);
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

  render() {
    const { formItemLayout } = this;
    const { getFieldDecorator } = this.props.form;
    const { model, tagsChildren } = this.state;
    const goods_classification = initState.getDictionary('goods_classification');

	  const nameLen = toString(model.name).length;
	  const nameMobileLen = toString(model.name_mobile).length;
    const briefIntroLen = toString(model.brief_intro).length;
	  const producerIntroLen = toString(model.producer_intro).length;
    const descriptionLen = toString(model.description).length;

	  const coverInfo = UploadFileNew.getPicInfo({
      size: [1005, 1080],
    });
    const smallInfo = UploadFileNew.getPicInfo({
      size: [300, 375],
    });
    const summaryCoverInfo = UploadFileNew.getPicInfo({
      size: [1125, 600],
    });

    return (
      <div className="baseinfo-wrapper">
        <Form>
          <FormItem label="课程种类:" {...formItemLayout} >
            {this.renderType()}
          </FormItem>
          <FormItem label="课程分类:" {...formItemLayout}>
            {getFieldDecorator('classification', {
              initialValue: model.classification || '',
              rules: [{ required: true, message: '请选择课程分类' }],
            })(<Select
              size="default"
            >
              {goods_classification.map((cell, index) =>
                <Option key={index} value={cell.value}>{cell.label}</Option>)}
               </Select>)}
          </FormItem>
          <FormItem label="课程标签" {...formItemLayout}>
            {
              getFieldDecorator('tag_ids', {
              })(<Select
                mode="multiple"
                placeholder="请选择课程标签"
              >
                {
                  tagsChildren.map(cell =>
                    <Option key={`${cell.id}tags`} value={cell.id}>{cell.name}</Option>)
                }
              </Select>)
            }
          </FormItem>
          <FormItem label="课程简称:" {...formItemLayout}>
            <Row>
              <Col span={18}>{getFieldDecorator('name', {
	              initialValue: model.name,
                rules: [{ required: true, message: '请填写课程简称，建议在16字以内' }],
              })(<Input placeholder="不在客户端显示，16字以内" />)}
              </Col>
              <Col span={1} />
              <Col span={2}><span style={nameLen > 16 ? { color: '#f00' } : {}}>{nameLen}</span>/16</Col>
            </Row>

          </FormItem>

          <FormItem label="课程拼音:" {...formItemLayout}>
            {getFieldDecorator('key', {
              initialValue: model.key,
              rules: [{ required: true, message: '英文字母以及英文符号命名' },
              { pattern: /[_a-zA-Z0-9-]/, message: '请使用英文字母以及英文符号命名' }],
            })(<Input placeholder="英文字母以及英文符号命名" />)}
          </FormItem>
          <FormItem label="课程章节:" {...formItemLayout}>
            {getFieldDecorator('chapters', {
              initialValue: model.chapters,
            })(<Input placeholder="章节与时长" />)}
          </FormItem>
          <FormItem label="课程权重:" {...formItemLayout}>
            <Row>
              <Col span={3}>
                {getFieldDecorator('weight', {
			        initialValue: model.weight || 0,
			        rules: [
                { required: true, message: '请填写整数，数值越大越靠前' },
                { pattern: /^[1-9][0-9]*$/, message: '请填写整数，数值越大越靠前' },
              ],
			        validateTrigger: 'onBlur',
		        })(<InputNumber min={0} step={100} />)}
              </Col>
              <Col span={1} />
              <Col span={18}><span>注意，若点击上下按钮，每次增加数值为100</span></Col>
            </Row>
          </FormItem>


          <FormItem label="课程名称:" {...formItemLayout}>
            <Row>
              <Col span={18}>{getFieldDecorator('name_mobile', {
              initialValue: model.name_mobile,
              rules: [{ required: true, message: '请填写课程列表名称，字数建议在16字以内' }],
            })(<Input placeholder="客户端显示，16字以内" />)}
              </Col>
              <Col span={1} />
              <Col span={2}><span style={nameMobileLen > 16 ? { color: '#f00' } : {}}>{nameMobileLen}</span>/16</Col>
            </Row>
          </FormItem>

          <FormItem label="课程简介:" {...formItemLayout}>
            <Row>
              <Col span={18}>{getFieldDecorator('brief_intro', {
              initialValue: model.brief_intro,
              rules: [{ required: true, message: '请填写课程一句话简介,字数建议在15字以内' }],
            })(<Input placeholder="客户端显示，20字以内" />)}
              </Col>
              <Col span={1} />
              <Col span={2}><span style={briefIntroLen > 15 ? { color: '#f00' } : {}}>{briefIntroLen}</span>/15</Col>
            </Row>
          </FormItem>

          <FormItem label="课程更新:" {...formItemLayout}>
            <Row>
              <Col span={18}>{getFieldDecorator('producer_intro', {
              initialValue: model.producer_intro,
                rules: [{ required: true, message: '请填写课程更新,字数建议在15字以内' }],
            })(<Input placeholder="客户端显示，不填自动取最新文章标题, 字数建议在15字以内" />)}
              </Col>
              <Col span={1} />
              <Col span={2}><span style={producerIntroLen > 15 ? { color: '#f00' } : {}}>{producerIntroLen}</span>/15</Col>

            </Row>
          </FormItem>

          <FormItem label="课程详情简介:" {...formItemLayout}>
            <Row>
              <Col span={18}>{getFieldDecorator('description', {
              initialValue: model.description,
              rules: [{ required: true, message: '请填写课程详情简介,字数建议在36字以内' }],
            })(<Input type="textarea" placeholder="客户端显示，36字以内" />)}
              </Col>
              <Col span={1} />
              <Col span={2}><span style={descriptionLen > 36 ? { color: '#f00' } : {}}>{descriptionLen}</span>/36</Col>
            </Row>
          </FormItem>
          <FormItem label="课程列表小图:" {...formItemLayout} help={smallInfo.text}>
            {getFieldDecorator('list_cover', {
              initialValue: model.list_cover,
              normalize: UploadFileNew.normFile,
              rules: [{ required: true, message: '课程列表小图为必填项' }],
            })(<UploadFileNew picInfo={smallInfo} url={model.list_cover} />)}
          </FormItem>
          <FormItem label="课程详情大图:" {...formItemLayout} help={coverInfo.text}>
            {getFieldDecorator('detail_cover', {
              initialValue: model.detail_cover,
              normalize: UploadFileNew.normFile,
              rules: [{ required: true, message: '课程详情大图为必填项' }],
            })(<UploadFileNew picInfo={coverInfo} url={model.detail_cover} />)}

          </FormItem>
          <FormItem label="课程简介头图:" {...formItemLayout} help={summaryCoverInfo.text}>
            {getFieldDecorator('summary_cover', {
              initialValue: model.summary_cover,
              normalize: UploadFileNew.normFile,
              rules: [{ required: true, message: '课程简介头图为必填项' }],
            })(<UploadFileNew picInfo={summaryCoverInfo} url={model.summary_cover} />)}
          </FormItem>
          <FormItem label="分享二维码:" {...formItemLayout}>
            {getFieldDecorator('qrcode_url', {
              initialValue: model.qrcode_url,
              rules: [{ required: true, message: '分享二维码为必填项' }],
            })(<Input placeholder="" />)}
          </FormItem>


          <FormItem label="课程有效期配置:" {...formItemLayout}>
            {getFieldDecorator('range-time-picker', {
              initialValue: model.valid_at && model.unvalid_at ? [moment(model.valid_at), moment(model.unvalid_at)] : null,
              rules: [{ required: true, message: '请选择开始时间', type: 'array' }],
            })(<RangePicker showTime format="YYYY-MM-DD HH:mm:ss" />)}
          </FormItem>

          <FormItem
            label="推广海报模板:"
            extra="请上传 1242 × 2208 的图片"
            {...formItemLayout}
          >
            {getFieldDecorator('posters', {
              initialValue: model.posters || [],
            })(<UploadImageList />)}
          </FormItem>
          {this.renderCtrl()}
        </Form>
      </div>
    );
  }
}

export default Form.create()(RoleDetail);

