import React, { Component } from 'react';
import { Link } from 'react-router';
import { Form, Select, Button, Row, Col, Input, DatePicker, Radio, Card, Icon, Modal, Table, message } from 'antd';
import FormCtrl from '../../../components/common/utils/FormCtrl';
import api from '../../../../app-common/api';
import action from '../../../../app-common/action';
import lodash from 'lodash';
import UploadFileNew from '../../../components/common/utils/UploadFileNew';
import initState from '../../../../app-common/dataResource/initState';
import Step4Form from './Step4Form';

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
    this.getOriginList = this.getOriginList.bind(this);
    this.showModal = this.showModal.bind(this);
    this.doDel = this.doDel.bind(this);
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
    this.getOriginList();
  }

  getList(fresh) {
    if (fresh) {
      this.state.currentPage = 1;
      this.state.pagination.current = 1;
    }
    const {
      id, currentPage, pageSize, priceState,
    } = this.state;

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
    // price_state: priceState
    api.get('goods-price', null, {
      goods_id: id, is_origin: 0, page: currentPage, per_page: pageSize, price_state: priceState,
    }, cbs);
  }

  getOriginList() {
    const { id } = this.state;

    let success = false;
    const cbs = {
      success: (res, data) => {
        success = true;
        this.state.originList = data.data || [];
      },
    };
    api.get('goods-price', null, {
      goods_id: id, is_origin: 1, page: 1, per_page: 50,
    }, cbs);
  }

  handleDel(cell, index) {
    const { model } = this.state;
    Modal.confirm({
      title: '删除确认',
      content: '你确定要删除吗？',
      onOk: () => {
        this.doDel(cell, index);
      },
    });
  }

  doDel(cell, index) {
    const _this = this;
    let success = false;
    const cbs = {
      success: (res, data) => {
        success = true;
        message.success('删除成功');
        _this.getList();
      },
      complete: () => {

      },
    };
    api.del('goods-price', { id: cell.id }, null, cbs);
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
        title: '对应原价id',
        width: 100,
        dataIndex: 'parent_id',
      },
      {
        title: '降价类型',
        width: 100,
        dataIndex: 'type',
      },
      {
        title: '价格',
        width: 100,
        dataIndex: 'amount',
      },
      {
        title: '价格名称',
        width: 100,
        dataIndex: 'description',
      },
      {
        title: '开始时间',
        width: 150,
        colSpan: 2,
        dataIndex: 'started_at',
      },
      {
        title: '结束时间',
        colSpan: 0,
        width: 150,
        dataIndex: 'finished_at',
      },
      {
        title: '操作',
        width: 100,
        render: (el, cell) => (
          <span>
            <a onClick={() => this.showModal(true, cell)}>修改</a>
            <span className="ant-divider" />
            <a onClick={() => this.handleDel(cell)}>删除</a>
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
    const { modalVisible, model, originList } = this.state;
    return (
      <div>
        {this.renderList()}
        <Step4Form showModal={this.showModal}
          modalVisible={modalVisible}
          {...this.props}
          model={model}
          refresh={this.getList}
          originList={originList}
        />
      </div>
    );
  }
}

export default RoleDetail;

