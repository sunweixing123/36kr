import React, { Component } from 'react';
import { Link } from 'react-router';
import { Form, Select, Button, Row, Col, Input, DatePicker, Radio, Card, Icon, Modal, Table, message } from 'antd';
import FormCtrl from '../../../components/common/utils/FormCtrl';
import api from '../../../../app-common/api';
import action from '../../../../app-common/action';
import lodash from 'lodash';
import UploadFileNew from '../../../components/common/utils/UploadFileNew';
import initState from '../../../../app-common/dataResource/initState';
import Step5Form from './Step5Form';
import Step5Form2 from './Step5Form2';

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
    this.handleDel = this.handleDel.bind(this);
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
    api.get('goods-sharer', null, { goods_id: id, page: currentPage, per_page: pageSize }, cbs);
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
        title: '单人占比',
        width: 100,
        dataIndex: 'scale',
      },
      {
        title: '子讲师姓名',
        width: 100,
        dataIndex: 'receiver',
      },
      {
        title: '账号类型',
        width: 150,
        dataIndex: 'account_type',
        render: el => initState.getDictionaryDes('goods_account_type', el),
      },
      {
        title: '账号',
        width: 100,
        dataIndex: 'account',
      },
      {
        title: '开户行',
        width: 100,
        dataIndex: 'account_description',
      },
      {
        title: '更新时间',
        width: 150,
        dataIndex: 'updated_at',
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

  showModal(show, modelCell) {
    this.setState({
      modalVisible: show,
      modelCell,
    });
  }

  handleDel(cell, index) {
    const { modelCell } = this.state;
    Modal.confirm({
      title: '删除确认',
      content: '你确定要删除吗？',
      onOk: () => {
        this.doDel(cell, index);
      },
    });
  }

  doDel(cell, index) {
    let success = false;
    const cbs = {
      success: (res, data) => {
        success = true;
        message.success('删除成功');
        this.getList();
      },
      complete: () => {

      },
    };
    api.del('goods-sharer', { id: cell.id }, null, cbs);
  }

  render() {
    const { modelCell, modalVisible } = this.state;
    return (
      <div>
        {this.renderList()}
        <Step5Form modalVisible={modalVisible} showModal={this.showModal} {...this.props} modelCell={modelCell} refresh={this.getList} />
        <Step5Form2 id={this.state.id} changeStep={this.props.changeStep} />
      </div>
    );
  }
}

export default Form.create()(RoleDetail);

