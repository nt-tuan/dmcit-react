import React, { useState } from 'react';
import { Segment, Form, Message, Button } from 'semantic-ui-react';
import { userService } from '../../../_services';

export const ResetPassword = ({ id }) => {
    const [username, setUsername] = useState('');
    const [error, setError] = useState();
    const [newPassword, setNewPassword] = useState();

    const handleReset = () => {
        userService.resetPassword(username)
            .then(setNewPassword)
            .catch(setError);
    }

    return <Segment>
        {error && <Message negative>{error}</Message>}
        {newPassword && <Message positive>Reset password for user {username} successfully, new password is: <strong>{newPassword}</strong></Message>}
        <Form size='tiny'>
            <Form.Field>
                <label>USERNAME</label>
                <input type='text' value={username} onChange={(e) => setUsername(e.target.value)} name='username' />
            </Form.Field>

            <Button size='mini' positive onClick={handleReset}>Reset</Button>
        </Form>
    </Segment>
}