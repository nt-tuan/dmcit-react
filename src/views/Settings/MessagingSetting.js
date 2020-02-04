import React, { useState, useEffect } from 'react';
import { Form, Card, CardGroup, Button, TextArea } from 'semantic-ui-react';
import { ViettelSMSSetting } from './Messaging/VietelSMSSetting';
import { SMTPSetting } from './Messaging/SMTPSetting';

export function MessagingSetting(props) {
  return (
    <CardGroup>
      <Card>
        <Card.Content>
          <ViettelSMSSetting />
        </Card.Content>
      </Card>
      <Card>
        <Card.Content>
          <SMTPSetting />
        </Card.Content>
      </Card>
    </CardGroup>
  )
}
