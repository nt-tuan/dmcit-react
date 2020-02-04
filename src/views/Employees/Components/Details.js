import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MyModal from '../../Modals/MyModal';
import { DepartmentLink } from '../../Departments/Components';
import { HRApiService } from '../../../_services/hr';
import { PersonDetail } from '../../Base/Person';
import { DetailValue } from '../../Base/Utilities';

function EmployeeDetails(props) {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState();

  useEffect(() => {
    loadData();
  }, [props.id]);

  function loadData() {
    setLoading(true);
    HRApiService.employeeDetail(props.id)
      .then(
        json => {
          setLoading(false);
          if (json.data == null) {
            setMessages("EMPLOYEE NOT FOUND");
          } else {
            setData(json.data);
            props.onSuccess && props.onSuccess();
          }
        })
      .catch(
          err => {
            setLoading(false);
            setMessages(err);
          });
  }


  if (messages) {
    return <div>{messages}</div>;
  }
  else if (loading) {
    return (
      <div>Loading...</div>
    );
  } else if (data) {
    return (
      <div>
        <DetailValue title='EMPLOYEE CODE' value={data.code} />
        {data.dept && <DetailValue
          title='DEPARTMENT'
          value={<DepartmentLink
            id={data.dept.id} name={data.dept.name} />}
        />
        }
        <hr />
        <PersonDetail person={data.person} />
      </div>
    );
  } else {
    return <div>NO DATA FOUND</div>
  }

}

export default EmployeeDetails;
