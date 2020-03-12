import React from 'react';
import { Col, Row } from 'antd';

const Header = ({ title, extras, divided, tags }) => {
    return <>
        <Row>
            <Col flex={8}>
                <h4 className='header'>{title} {tags}</h4>
            </Col>
            <Col flex={5}>
                <div style={{ float: 'right' }}>
                    {extras}
                </div>
            </Col>
        </Row>
        {divided && <hr style={{marginTop:'0.2em'}} />}
    </>
}

const Header2 = ({ title, extras, divided, tags }) => {
    return <>
        <Row>
            <Col flex={8}>
                <h5 className='header'>{title} {tags}</h5>
            </Col>
            <Col flex={5}>
                <div style={{ float: 'right' }}>
                    {extras}
                </div>
            </Col>
        </Row>
        {divided && <hr style={{marginTop:'0.2em'}} />}
    </>
}

const Header3 = ({ title, extras, divided, tags }) => {
    return <>
        <Row>
            <Col flex={8}>
                <h6 className='header'>{title} {tags}</h6>
            </Col>
            <Col flex={5}>
                <div style={{ float: 'right' }}>
                    {extras}
                </div>
            </Col>
        </Row>
        {divided && <hr style={{marginTop:'0.2em'}} />}
    </>
}

export { Header, Header2, Header3 }