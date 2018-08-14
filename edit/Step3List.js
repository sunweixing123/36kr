import React, { Component } from 'react';
import { Link } from 'react-router';
import { Form, Select, Button, Row, Col, Input, DatePicker, Radio, Card, Icon, Modal, Table } from 'antd';
import lodash from 'lodash';

import FormCtrl from '../../../components/common/utils/FormCtrl';
import api from '../../../../app-common/api';
import action from '../../../../app-common/action';
import UploadFileNew from '../../../components/common/utils/UploadFileNew';
import initState from '../../../../app-common/dataResource/initState';
import Step3Form from './Step3Form';

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
      list: [],
      sending: false,
      loading: false,
      model: {
      },
      currentPage: 1,
      pageSize: 10,
      pagination: {
        total: 0,
        defaultPageSize: 10,
        pageSizeOptions: ['10', '30', '50', '100'],
        showSizeChanger: true,
        onShowSizeChange: (current, pageSize) => {
          this.state.currentPage = 1;
          this.state.pagination.current = 1;
          this.state.pageSize = pageSize;
          this.getList();
        },
        onChange: (current) => {
          this.state.currentPage = current;
          this.state.pagination.current = current;
          this.getList();
        },
      },
    };
    this.getList = this.getList.bind(this);
    this.showModal = this.showModal.bind(this);
  }

  shouldComponentUpdate() {
    return true;
  }

  componentWillReceiveProps() {
  }

  componentWillMount() {
  }

  componentDidMount() {
    this.getList();
  }

  getList(fresh) {
    if (fresh) {
      this.state.currentPage = 1;
      this.state.pagination.current = 1;
    }
    const { id, currentPage, pageSize } = this.state;

    let success = false;
    const cbs = {
      success: (res, data) => {
        success = true;
        this.state.pagination.total = data.total - 0;
        this.state.list = data.data || [];
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
    api.get('goods-price', null, {
      goods_id: id, is_origin: 1, page: currentPage, per_page: pageSize,
    }, cbs);
  }

  renderList() {
    const { list, loading, pagination } = this.state;

    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        width: 80,
      },
      {
        title: '用户拥有权',
        width: 100,
        dataIndex: 'sale_type',
        render(cell) {
          return initState.getDictionaryDes('goods_sale_type', cell);
        },
      },
      {
        title: '售价',
        width: 100,
        dataIndex: 'amount',
      },
      {
        title: '售价描述',
        width: 200,
        dataIndex: 'description',
      },
      {
        title: '单次售卖基数',
        width: 200,
        dataIndex: 'sale_number',
      },
      {
        title: '售卖单位',
        width: 200,
        dataIndex: 'sale_unit',
        render(cell) {
          return initState.getDictionaryDes('goods_sale_unit', cell);
        },
      },
      {
        title: '操作',
        width: 50,
        render: (el, cell) => (
          <span>
            <a onClick={() => this.showModal(true, cell)}>修改</a>
          </span>
        ),
      },
    ];
    return (
      <div>
        <Table
          columns={columns}
          dataSource={list}
          pagination={pagination}
          bordered
          size="middle"
          loading={loading}
          className="step3-list-table"
        />
      </div>
    );
  }

  showModal(show, model) {
    this.setState({
      modalVisible: show,
      model,
    });
  }


  render() {
    const { modalVisible, model } = this.state;
    return (
      <div>
        {this.renderList()}
        <Step3Form showModal={this.showModal} modalVisible={modalVisible} {...this.props} model={model} refresh={this.getList} />
      </div>
    );
  }
}

export default RoleDetail;

