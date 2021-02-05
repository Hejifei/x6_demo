import React from 'react'
import { Form, Input, Row, Col, InputNumber, Divider, Radio, Slider, } from 'antd';
import { ColorPicker } from '@antv/x6-react-components'
import lodash from 'lodash'
import '@antv/x6-react-components/es/color-picker/style/index.css'
import styles from './index.module.scss'

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};

const ActionWrapper = ({
    cellInfo = {},
    cell,
}) => {
    const {shape} = cellInfo

    const onValuesChange = (changeValues, values) => {
        const {
            position,
            size,
            angle,
            attrs,
        } = values
        if (lodash.isPlainObject(values?.attrs?.label?.fill)) {
            const color = lodash.get(values, ['attrs', 'label', 'fill', 'hex'])
            lodash.set(values, ['attrs', 'label', 'fill'], color)
        }
        if (lodash.isPlainObject(values?.attrs?.text?.fill)) {
            const color = lodash.get(values, ['attrs', 'text', 'fill', 'hex'])
            lodash.set(values, ['attrs', 'text', 'fill'], color)
        }
        if (lodash.isPlainObject(values?.attrs?.body?.fill)) {
            const color = lodash.get(values, ['attrs', 'body', 'fill', 'hex'])
            lodash.set(values, ['attrs', 'body', 'fill'], color)
        }
        if (lodash.isPlainObject(values?.attrs?.body?.stroke)) {
            const color = lodash.get(values, ['attrs', 'body', 'stroke', 'hex'])
            lodash.set(values, ['attrs', 'body', 'stroke'], color)
        }
        if (position) {
            cell.position(position.x, position.y)
        }
        if (size) {
            cell.size(size)
        }
        if (angle) {
            cell.rotate(angle, {absolute: true})
        }
        if (attrs) {
            cell.attr(attrs)
        }
        console.log({
            values,
            cell,
        })
    }

    const getBaseConfig = () => {
        let baseConfig = [
            <Divider key={'divider_base'} orientation="left">基础配置</Divider>,
            <Row gutter={0} key={'base_position'}>
                <Col className="gutter-row" span={12}>
                    <Form.Item
                        label="x"
                        labelAlign='left'
                        name={['position', 'x']}
                        className={styles.inputWrapper}
                        rules={[{ required: true, message: 'Please input your x!' }]}
                    >
                        <InputNumber />
                    </Form.Item>
                </Col>
                <Col className="gutter-row" span={12}>
                    <Form.Item
                        label="y"
                        labelAlign='left'
                        name={['position', 'y']}
                        className={styles.inputWrapper}
                        rules={[{ required: true, message: 'Please input your y!' }]}
                    >
                        <InputNumber />
                    </Form.Item>
                </Col>
            </Row>
        ]
        if (shape === 'react-shape') {
            return baseConfig
        }
        baseConfig.push(...[ 
            <Row gutter={0} key={'base_size'}>
                <Col className="gutter-row" span={12}>
                    <Form.Item
                        label="width"
                        labelAlign='left'
                        name={['size', 'width']}
                        className={styles.inputWrapper}
                        rules={[{ required: true, message: 'Please input your width!' }]}
                    >
                        <InputNumber />
                    </Form.Item>
                </Col>
                <Col className="gutter-row" span={12}>
                    <Form.Item
                        label="height"
                        labelAlign='left'
                        name={['size', 'height']}
                        className={styles.inputWrapper}
                        rules={[{ required: true, message: 'Please input your height!' }]}
                    >
                        <InputNumber />
                    </Form.Item>
                </Col>
            </Row>,
            <Row gutter={0} key={'base_angle'}>
                <Col className="gutter-row" span={12}>
                    <Form.Item
                        label="angle"
                        name="angle"
                        className={styles.inputWrapper}
                        rules={[{ required: true, message: 'Please input your angle!' }]}
                    >
                        <InputNumber />
                    </Form.Item>
                </Col>
                {
                    shape !== 'image' && <>
                        <Col className="gutter-row" span={12}>
                            <Form.Item
                                label="strokeWidth"
                                labelAlign='left'
                                name={
                                    cellInfo?.attrs?.body?.strokeWidth
                                        ? ['attrs', 'body', 'strokeWidth']
                                        : ['attrs', shape, 'strokeWidth']
                                }
                                className={styles.inputWrapper}
                                rules={[{ required: true, message: 'Please input strokeWidth!' }]}
                            >
                                <InputNumber />
                            </Form.Item>
                        </Col>
                    </>
                }
            </Row>
        ])
        if (shape !== 'image') {
            baseConfig.push(
                <Row gutter={0} key={'base_color'}>
                    <Col className="gutter-row" span={12}>
                        <Form.Item
                            label="fill"
                            labelAlign='left'
                            name={['attrs', 'body', 'fill']}
                            className={styles.inputWrapper}
                            rules={[{ required: true, message: 'Please input text!' }]}
                        >
                            <ColorPicker color={lodash.get(cellInfo, ['attrs', 'body', 'fill'])} />
                        </Form.Item>
                    </Col>
                    <Col className="gutter-row" span={12}>
                        <Form.Item
                            label="stroke"
                            labelAlign='left'
                            name={['attrs', 'body', 'stroke']}
                            className={styles.inputWrapper}
                            rules={[{ required: true, message: 'Please input text!' }]}
                        >
                            <ColorPicker color={lodash.get(cellInfo, ['attrs', 'body', 'stroke'])} />
                        </Form.Item>
                    </Col>
                </Row>
            )
        }
        return baseConfig
    }

    const getTextConfig = () => {
        if (shape === 'react-shape' || shape === 'image') {
            return null
        }
        return <>
            <Divider orientation="left">文字配置</Divider>
            <Row gutter={0}>
                <Col className="gutter-row" span={12}>
                    <Form.Item
                        label="text"
                        labelAlign='left'
                        name={['attrs', 'label', 'text']}
                        className={styles.inputWrapper}
                        rules={[{ required: true, message: 'Please input text!' }]}
                    >
                        <Input />
                    </Form.Item>
                </Col>
                <Col className="gutter-row" span={12}>
                    <Form.Item
                        label="fontSize"
                        labelAlign='left'
                        name={['attrs', 'label', 'fontSize']}
                        className={styles.inputWrapper}
                        rules={[{ required: true, message: 'Please input fontSize!' }]}
                    >
                        <InputNumber />
                    </Form.Item>
                </Col>
            </Row>
            <Form.Item
                label="refX"
                labelAlign='left'
                name={['attrs', 'text', 'refX']}
                className={styles.inputWrapper}
                rules={[{ required: true, message: 'Please input text!' }]}
            >
                <Slider
                    min={0}
                    max={0.99}
                    step={0.01}
                />
            </Form.Item>
            <Form.Item
                label="refY"
                labelAlign='left'
                name={['attrs', 'text', 'refY']}
                className={styles.inputWrapper}
                rules={[{ required: true, message: 'Please input text!' }]}
            >
                <Slider
                    min={0}
                    max={0.99}
                    step={0.01}
                />
            </Form.Item>
            <Form.Item
                label="textAnchor"
                labelAlign='left'
                name={['attrs', 'text', 'textAnchor']}
                className={styles.inputWrapper}
                rules={[{ required: true, message: 'Please input text!' }]}
            >
                <Radio.Group buttonStyle="solid">
                    <Radio.Button value={'start'}>Start</Radio.Button>
                    <Radio.Button value={'middle'}>Middle</Radio.Button>
                    <Radio.Button value={'end'}>End</Radio.Button>
                </Radio.Group>
            </Form.Item>
            <Form.Item
                label="textVerticalAnchor"
                labelAlign='left'
                name={['attrs', 'text', 'textVerticalAnchor']}
                className={styles.inputWrapper}
                rules={[{ required: true, message: 'Please input fontSize!' }]}
            >
                <Radio.Group buttonStyle="solid">
                    <Radio.Button value={'top'}>Top</Radio.Button>
                    <Radio.Button value={'middle'}>Middle</Radio.Button>
                    <Radio.Button value={'bottom'}>Bottom</Radio.Button>
                </Radio.Group>
            </Form.Item>
            <Form.Item
                                        label="fill"
                                        labelAlign='left'
                                        name={cellInfo?.attrs?.label?.fill ? ['attrs', 'label', 'fill'] : ['attrs', 'text', 'fill']}
                                        className={styles.inputWrapper}
                                        rules={[{ required: true, message: 'Please input text!' }]}
                                    >
                                        <ColorPicker color={cellInfo?.attrs?.label?.fill || cellInfo?.attrs?.text?.fill} />
                                    </Form.Item>
        </>
    }

    return <div className={styles.wrapper}>
        <Form
            {...layout}
            name="basic"
            initialValues={cellInfo}
            onValuesChange={onValuesChange}
        >
            {getBaseConfig()}
            {getTextConfig()}
        </Form>
    </div>
}

export default ActionWrapper
