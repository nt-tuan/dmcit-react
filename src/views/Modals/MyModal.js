import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Modal, Button, Icon, Label, Rail } from 'semantic-ui-react';

class MyModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openDetails: this.props.open ? this.props.open : false
    };
  }

  componentWillReceiveProps(props) {
    this.setState({ openDetails: props.open });
  }

  open = () => {
    if (this.props.onOpen)
      this.props.onOpen();
    else
      this.setState({ openDetails: true });
  }
  close = () => {
    this.setState({ openDetails: false });
    if (this.props.onClose)
      this.props.onClose();
  }

  render() {
    return (
      <div>
        <Modal open={this.state.openDetails} onOpen={this.open} onClose={this.close} centered>
          <Modal.Header>
            {this.props.header}
            {this.props.expandable &&
              <Link to={this.props.expandable}>
                <Icon className="float-right" name="expand" />               
              </Link>}
          </Modal.Header>
          <Modal.Content scrolling>
            <Modal.Description>
              {this.props.component}
            </Modal.Description>
          </Modal.Content>
          <Modal.Actions>
            <Button color='green' onClick={this.close}>
              CLOSE
      </Button>
          </Modal.Actions>
        </Modal></div>);
  }
}

export default MyModal;
