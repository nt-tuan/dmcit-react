import React, { useState, useMemo } from 'react';
import { Form, Button, Segment, Header, Icon } from 'semantic-ui-react';
import { createEditor } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import ImageText from '../../views/Base/Editors/ImageAndTextEditor';

const CreateRequest = () => {
    const [formData, setFormData] = useState({
        code: '', phone: '', email: '', content: [{
            type: 'paragraph',
            children: [{ text: '' }]
        }]
    });
    const editor = useMemo(() => withReact(createEditor()), []);

    const handleChange = (e, { name, value }) => {

    }

    const handleContentChange = (value) => {
        setFormData({ ...formData, value })
    }
    const handleSend = (e) => {
        e.preventDefault();
    }

    return <Segment>
        <Header as='h4' dividing>
            Yêu cầu hổ trợ
              </Header>
        <Form>
            <Form.Field required>
                <label>Mã nhân viên</label>
                <input name="code" value={formData.code} onChange={handleChange} />
            </Form.Field>
            <Form.Group widths="equal">
                <Form.Field>
                    <label>Số điện thoại</label>
                    <input name="phone" value={formData.phone} onChange={handleChange} />
                </Form.Field>
                <Form.Field>
                    <label>Email</label>
                    <input name="email" value={formData.email} onChange={handleChange} />
                </Form.Field>
            </Form.Group>
            <Form.Field required>
                <label>Nội dung</label>
                <ImageText onChange={handleContentChange} />
            </Form.Field>
            <Button onClick={handleSend} icon compact primary labelPosition="left"><Icon name="envelope" />Gửi yêu cầu</Button>
        </Form>
    </Segment>
}

export default CreateRequest;