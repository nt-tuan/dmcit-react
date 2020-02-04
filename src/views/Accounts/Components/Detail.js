import React from 'react';
import { Segment, Message, Divider, Label, List } from 'semantic-ui-react';
import { userService } from '../../../_services';
import { PersonDetail } from '../../Base/Person';
import { DetailValue } from '../../Base';
import { UserRoles } from './UserRoles';
export class AccountDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      data: null
    };
  }

  componentDidMount() {
    this.loadAccount();
  }

  loadAccount() {
    const id = this.props.match && this.props.match.param && this.props.match.param.id ? this.props.match.param.id : this.props.id;
    userService.getById(id)
      .then(result => {
        if (result && result.data) {
          this.setState({
            isLoading: false,
            data: result.data
          });
        }
      })
      .catch(error => this.setState({ message: error.message }));
  }

  render() {
    return (
      <Segment loading={this.state.isLoading}>
        {this.state.message && <Message error>{this.state.message}</Message>}
        {this.state.data && <div>
          <h4>ACCOUNT INFO</h4>
          <List divided>
            <DetailValue title="ACCOUNT NAME" value={this.state.data.username} />
            <DetailValue title="EMAIL" value={this.state.data.email} />
          </List>
          <hr />
          <h4>ROLES</h4>
          <UserRoles userId={this.state.data.id} />
          <PersonDetail person={this.state.data.person} />
        </div>
        }
      </Segment>
    );
  }
}


