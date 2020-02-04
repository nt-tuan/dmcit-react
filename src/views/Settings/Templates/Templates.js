import React, { useState, useEffect } from 'react';
import { templateService } from '../../../_services';
import { List, Segment, Grid } from 'semantic-ui-react';
import { Container, Row, Col } from 'reactstrap';
import TemplateView from './TemplateView';
import { handleError } from '../../../_helpers';
export default function Templates(props) {
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState();
  useEffect(() => {
    templateService
      .getTemplates()
      .then(u => {
        setData(u);
      })
      .catch(e => { });
  }, []);

  return <Segment>
    <h4>Template management</h4>
    <hr />
    <Container fluid>
      <Row>
        <Col lg={4}>
          <List divided selection>
            {data.map(u =>
              <List.Item key={u.id} onClick={() => setSelected(u.id)} active={u.id == selected}>
                <List.Header>{u.name}</List.Header>
                <List.Description>{u.description ? u.description : ' '}
                </List.Description>
              </List.Item>)
            }
          </List>
        </Col>
        <Col lg={8}>
          <TemplateView id={selected} />
        </Col>
      </Row>
    </Container>
  </Segment>
}
