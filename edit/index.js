import React, { Component } from 'react';
import connect from '../../connect';
import BreadcrumbNav from '../../../components/common/BreadcrumbNav';
import Detail from './Detail';
import './index.less';

class RoleEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  shouldComponentUpdate() {
    return true;
  }

  componentWillReceiveProps() {
  }

  componentWillMount() {
  }

  componentDidMount() {
  }

  render() {
    const { location, params } = this.props;
    return (
      <div className="main-con">
        <BreadcrumbNav />
        <div>
          <Detail isEdit />
        </div>
      </div>
    );
  }
}

export default connect(RoleEdit);

