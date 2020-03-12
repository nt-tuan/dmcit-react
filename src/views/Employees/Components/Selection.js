import React, { Component } from 'react';

import { Dropdown, Form, Label } from 'semantic-ui-react';
import { HRApiService } from '../../../_services';


class Selection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      isLoadedCurrentValue: false,
      multiple: true,
      search: true,
      value: this.props.value,
      options: [],
      placeholder: 'SELECT_EMPLOYEE'
    }

    this.searchQuery = null;

    this.handleChange = (e, { value, name }) => {
      this.setState({ value });
      if (this.props.onChange)
        this.props.onChange(e, { value, name });
    };
    this.handleSearchChange = (e, { searchQuery }) => {
      this.searchQuery = searchQuery;
      console.log(searchQuery);
      this.loadData();
    };
    this.handleOpen = this.handleOpen.bind(this);
    this.selected = null;
  }

  handleOpen(value) {
    this.loadData();
  }

  appendSelected(options) {
    let emps = options;
    if (this.selected) {
      if (emps.filter(u => u.value === this.selected.value).length === 0) {
        emps.push({
          text: this.selected.text,
          value: this.selected.value
        });
      }
    }
    return emps;
  }

  loadCurrentValue(value) {
    if (!value) {
      value = this.state.value;
    }
    
    if (!value) {
      this.setState({
        isLoadedCurrentValue: true
      });
      return;
    }
    this.setState({
      isLoadedCurrentValue: false
    });
    HRApiService.employeeDetail(value)
      .then(result => {
        if (result.data == null) {
          this.selected = null;
        } else {
          let emp = result.data;
          this.selected = {
            text: `${emp.code} - ${emp.person.displayname}`,
            value: emp.id
          };
          let emps = this.appendSelected(this.state.options);
          this.setState({
            options: emps,
            value: value,
            isLoadedCurrentValue: true
          });
        }
      }).catch(error => {
        console.log(error);
        this.selected = null;
      });
  }

  loadData() {
    this.setState({
      isLoaded: false
    });
    HRApiService.employeeList({
        search: this.searchQuery,
        page: 0,
        pageSize: 100,
        orderBy: 'lastname',
        orderDirection: 0
      })
      .then(json => {
        if (json && json.data) {
          let emps = json.data.map(u => {
            return {
              text: `${u.code} - ${u.person.displayname}`,
              value: u.id
            };
          });
          emps = this.appendSelected(emps);
          this.setState({
            options: emps,
            isLoaded: true
          });
        } else {
          if (json && json.message)
            throw new Error(json.message);
          else
            throw new Error("UNKNOWN_ERROR");
        }
      })
      .catch(error => {
        this.setState({
          options: [],
          isLoaded: true,
          error: error
        });
      });
  }

  componentDidMount() {
    this.loadData();
    this.loadCurrentValue(this.state.value);
  }

  componentWillReceiveProps(props) {
    if(props.value != this.state.value)
      this.loadCurrentValue(props.value);
  }

  render() {
    const { multiple, options, isLoaded, search, value, placeholder, isLoadedCurrentValue } = this.state;
    return (
      <Form.Field>
        <label>{this.props.label?this.props.label : 'EMPLOYEE'}</label>
        <Dropdown
          name={this.props.name}
          fluid
          selection
          search={search}
          options={options}
          value={value}
          placeholder={placeholder}
          onChange={this.handleChange}
          onSearchChange={this.handleSearchChange}
          onOpen={this.handleOpen}
          loading={!(isLoaded && isLoadedCurrentValue)}
          noResultsMessage={this.state.error}
        />
      </Form.Field>
    );
  }
};

export default Selection;
