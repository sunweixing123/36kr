import React, { Component } from 'react';
import { Form, Select, Button, Row, Col, Input, DatePicker, Radio } from 'antd';
import FormCtrl from '../../../components/common/utils/FormCtrl';
import api from '../../../../app-common/api';
import action from '../../../../app-common/action';
import lodash from 'lodash';
import './step1.less';

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
        producer_ids: '',
      },
      names: [],
    };
    this.formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 12 },
    };
    this.state.model.producer_ids = this.getIds();
    this.handleSubmit = this.handleSubmit.bind(this);
    this.checkId = this.checkId.bind(this);
    this.checkName = this.checkName.bind(this);
  }

  shouldComponentUpdate() {
    return true;
  }

  componentWillReceiveProps() {
    this.state.model.producer_ids = this.getIds();
  }

  componentWillMount() {
  }

  componentDidMount() {
    const ids = this.getIds();
    if (!this.state.model.producer_ids) {
      this.state.model.producer_ids = ids;
      this.getData();
    }
  }

  getIds() {
    const { id } = this.state;
    const data = action.getStateByName(`goods-producer-${id}`, 'goods-producer', 'array');
    const ids = [];
    lodash.each(data, (cell, index) => {
      ids.push(cell.user_id);
    });
    return ids.join('\n');
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
            this.props.router.replace(`${this.props.location.pathname}?step=2`);
          }
        });
      },
    };

    this.setState({
      sending: true,
    });
    const ids = values.producer_ids.split(/\s+/).join(',').replace(/,$/, '');

    api.put('goods-producer', null, { producer_ids: ids, goods_id: id }, cbs);
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
      loading: !clear,
    });
    action.doActionByName('goods-producer', { api: 'goods-producer', data: { goods_id: id, per_page: 99 } }, {
      reResultName: `goods-producer-${id}`,
      clear,
    }, clear ? {} : cbs);
  }

  checkId(rule, value, callback) {
    const reg = /^[1-9][0-9]*$/;
    value = value || '';
    const arr = value.trim().split(/\s+/);
    let flag = true;
    let index = 0;
    const map = {};
    let repeat = false;

    arr.forEach((cell, dex) => {
      if (!reg.test(cell)) {
        index = dex;
        flag = false;
      }
      if (map[cell]) {
        repeat = true;
      }
      map[cell] = true;
    });

    if (repeat) {
      callback('有重复的id');
      return false;
    }
    if (flag || value === '') {
      callback();
    } else {
      callback(`第${index + 1}个id不正确,请检查!`);
    }
  }

  checkName() {
    let { names } = this.state;
	  const { getFieldValue } = this.props.form;
	  const stringIds = getFieldValue('producer_ids').trim().split(/\s+/).join(',');
	  if (!stringIds) {
	    return;
    }
	  const _this = this;
	  const cbs = {
	  success(res, result) {
		  names = [];
		  lodash.each(result.data || [], (el) => {
				  names.push(el.name);
			  });
		  names = names.join('<br /><br />');
        _this.setState({ names });
		  },
	  };
	  api.get('user', null, { ids: stringIds, per_page: stringIds.length }, cbs);
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
    const { names } = this.state;
    const { formItemLayout } = this;
    const { getFieldDecorator } = this.props.form;
    // name	true	varchar	商品名称
    // type	true	varchar	类型post/magazine
    // description	false	varchar	商品描述
    // key	true	varchar	商品key
    // external_scale	true	float	外部分成比
    // valid_at	true	float	有效期开始时间
    // unvalid_at	true	float	有效期结束时间
    return (
      <div className="step-1">
        <Form>
          <FormItem label="作者ID:" {...formItemLayout}>
            {getFieldDecorator('producer_ids', {
              initialValue: this.state.model.producer_ids,
              rules: [{ required: true, message: '每一行一个ID' }, { validator: this.checkId }],
            })(<Input type="textarea" placeholder="每一行一个ID" autosize={{ minRows: 10, maxRows: 50 }} />)}
          </FormItem>

          <div>
            <Row className="mb-20">
              <Col span="6" />
              <Col span="12">
                <div>
                  <a className="mr-10" onClick={() => this.checkName()}>检查用户名</a>
                </div>
              </Col>
            </Row>
            <Row className="mb-20">
              <Col span="6" />
              <Col span="12">
                {names.length == 0 ?
                  null :
                  <div className="display-names" dangerouslySetInnerHTML={{ __html: names }} />}
              </Col>
            </Row>
          </div>

          {this.renderCtrl()}
        </Form>
      </div>
    );
  }
}

export default Form.create()(RoleDetail);

