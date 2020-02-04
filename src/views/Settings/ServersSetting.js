import React, { useState, useEffect } from 'react';
import { List, Card, Button, ButtonGroup, Loader } from 'semantic-ui-react';

import { collectingService } from '../../_services';
import { ServerView } from './Servers/ServerComponents';

export function ServersSetting(props) {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState();
  useEffect(() => {
    collectingService.getServers()
      .then(json => {
        setData(json);
        setLoading(false);
      })
      .catch(err => {
        setLoading(false);
      });
  }, []);

  return (
    <Card fluid>
      <Card.Content>
        <Card.Header>
          SERVERS LIST
          <ButtonGroup floated="right">
            <Button basic compact icon="plus" />
          </ButtonGroup>
        </Card.Header>
        <Card.Description>
          <Loader inline="centered" inverted content="Loading" />
          {data && <Card.Group itemsPerRow={2}>
            {data.map((u, index) =>
              <ServerView key={index} id={u.distributorCode} />
            )}
          </Card.Group>
          }
        </Card.Description>
      </Card.Content>      
    </Card>
  );
}
