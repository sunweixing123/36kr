import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Form, Select, Button, Row, Col, Input, Steps } from 'antd';
import BaseInfo from './BaseInfo';
import Step1 from './Step1';
import Step2 from './Step2-new';
import Step3List from './Step3List';
import Step4List from './Step4List';
import Step5 from './Step5';
import Step6 from './Step6';


import api from '../../../../app-common/api';

const Step = Steps.Step;
class GoodsDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      success: false,
      id: this.props.params.id || '',
      current: this.props.location.query.step || 0,
    };
    this.changeStep = this.changeStep.bind(this);
  }

  shouldComponentUpdate() {
    return true;
  }

  componentWillReceiveProps(nextProps) {
    this.state.current = nextProps.location.query.step || this.state.current;
  }

  componentWillMount() {
  }

  componentDidMount() {
  }


  changeStep(skip, saveId, values, saveKey) {
    const { current, id } = this.state;

    if (skip - 0 > 0 && !id) {
      return false;
    }

    // if (skip === 4) {
    //   return false;
    // }

    if (values) {
      this.state[`stepModel${saveKey}`] = values;
    }
    if (saveId) {
      this.state.id = saveId;
    }
    let pathname = this.props.location.pathname;
    pathname = `/${pathname.replace(/^\//, '')}`;
    this.props.router.replace(`${pathname}?step=${skip}`);
  }
  renderStep() {
    let { current, id } = this.state;
    current = parseInt(current, 10);
    const model = this.state[`stepModel${current}`] || null;
    switch (current) {
      case 0: return <BaseInfo {...this.props} changeStep={this.changeStep} id={id} model={model} />;
      case 1: return <Step1 {...this.props} changeStep={this.changeStep} id={id} model={model} />;
      case 2: return <Step2 {...this.props} changeStep={this.changeStep} id={id} model={model} />;
      case 3: return <Step3List {...this.props} changeStep={this.changeStep} id={id} model={model} />;
      case 4: return <Step4List {...this.props} changeStep={this.changeStep} id={id} model={model} />;
      case 5: return <Step5 {...this.props} changeStep={this.changeStep} id={id} model={model} />;
      case 6: return <Step6 {...this.props} changeStep={this.changeStep} id={id} model={model} />;
      default: return null;
    }
  }
  render() {
    let { current } = this.state;
    current = parseInt(current, 10);
    return (
      <div className="mt-20">
        <Steps size="small" current={current}>
          <Step title="基本属性" onClick={() => this.changeStep(0)} />
          <Step title="作者关联" onClick={() => this.changeStep(1)} />
          <Step title="内容配置" onClick={() => this.changeStep(2)} />
          <Step title="初始定价" onClick={() => this.changeStep(3)} />
          <Step title="临时价格" onClick={() => this.changeStep(4)} />
          <Step title="分成配置" onClick={() => this.changeStep(5)} />
          <Step title="上线与下线" onClick={() => this.changeStep(6)} />
        </Steps>
        <div className="mt-20">
          {this.renderStep()}
        </div>
      </div>
    );
  }
}

export default withRouter(GoodsDetail);

