import React, { Component } from 'react';
import connect from '../../connect';
import BreadcrumbNav from '../../../components/common/BreadcrumbNav';
import Detail from './Detail';

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
    return (
      <div className="main-con">
        <BreadcrumbNav />
        <div>
          <Detail {...this.props} isNew />
        </div>
      </div>
    );
  }
}

export default connect(RoleEdit);

