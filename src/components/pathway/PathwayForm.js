import React, { useState, useEffect } from 'react';
import {
    Layout, Form, Input, Row,
    Col, Select, Button, DatePicker,
    Table, Popconfirm
} from 'antd';
import TitleDivider from 'components/TitleDivider';
import { ImageUploadAndNameInputs } from 'components/shared';
import { groupBy, property, isNil, snakeCase, head } from 'lodash';
import 'scss/antd-overrides.scss';

const { Option } = Select;
const { Column } = Table;

const preloadOptions = (data = []) => data.map((item, index) => {
    return (
        <Option
            value={item.id}
            key={index.toString()}
        >
            {item.name}
        </Option>
    );
});

const PathwayForm = (props) => {
    let {
        datafields = [], offers = [],
        groupsOfOffers = [], setGroupsOfOffers,
        userId = null, file, onChangeUpload,
        pathway, handleGroupRemoval, provider,
        providers, scopedToProvider = false,
    } = props;
    const [ groupNameString, setGroupNameString ] = useState('');
    datafields = Object.values(datafields);

    // console.log(providers);

    const handleGroupName = (e) => {
        return setGroupNameString(e.target.value);
    }

    useEffect(() => {}, [file, pathway, groupsOfOffers]);

    const doesGroupNameExist = (groups) => {
        groups.some(group => {
            return (group.name === groupNameString)
                || (group.inputName === snakeCase(groupNameString.toLowerCase()));
        });
    };

    const addGroupName = () => {
        if (!groupNameString.length) {
            return;
        }

        if (doesGroupNameExist(groupsOfOffers)) {
            return;
        }

        const inputName = snakeCase(groupNameString.toLowerCase());

        const newGroupsOfOffers = [
            ...groupsOfOffers,
            {
                group_name: groupNameString,
                inputName,
            }
        ];

        setGroupsOfOffers(newGroupsOfOffers);
    }

    const grouped = groupBy(datafields, property('type'));

    const {
        payment_unit = [], length_unit = [], credit_unit = [],
        topic = [], frequency_unit = [],
    } = grouped;

    let topicOptions = null;

    if (!isNil(topic) && topic.length) {
        topicOptions = topic.map(({ name, id }, index) => (
            <Option
                value={id}
                key={index.toString()}
            >
                {name}
            </Option>
        ));
    }

    let offerOptions = null;

    if (!isNil(offers) && offers.length) {
        offerOptions = preloadOptions(offers);
    }

    let providerTypeOptions = null;

    // console.log(providers);

    if (!isNil(providers) && providers.length) {
        providerTypeOptions = preloadOptions(providers);
    }

    const onCancel = e => {};

    return (
        <Layout>
            <ImageUploadAndNameInputs
                className="mb-2"
                userId={userId}
                onChangeUpload={onChangeUpload}
                file={file}
            >
                <Form.Item
                    label="Description"
                    name="description"
                    labelAlign={"left"}
                    colon={false}
                    className="mb-0 inherit"
                    rules={[{ required: true, message: "Please fill in this field" }]}
                >
                    <Input.TextArea
                        className="rounded"
                        rows={2}
                    />
                </Form.Item>
                <Row gutter={8}>
                    <Col span={10}>
                        <Form.Item
                            label="Start Date"
                            name="start_date"
                            labelAlign={"left"}
                            colon={false}
                            className="mb-0 inherit"
                        >
                            <DatePicker
                                className="w-full custom-datepicker rounded"
                                placeholder=""
                            />
                        </Form.Item>
                    </Col>
                    <Col span={14}>
                        <Form.Item
                            label="Keywords"
                            name="keywords"
                            labelAlign={"left"}
                            colon={false}
                            className="mb-0 inherit"
                        >
                            <Input className="rounded" />
                        </Form.Item>
                    </Col>
                </Row>
            </ImageUploadAndNameInputs>
            <TitleDivider title={"Add Offers Group"} />
            <Row>
                <Col span={8}>
                    <Input
                        className="w-full rounded-l rounded-r-none"
                        style={{ padding: "0.28rem" }}
                        placeholder="Group Name"
                        name="add-group"
                        onChange={handleGroupName}
                    />
                </Col>
                <Col type={4}>
                    <Button
                        className="rounded-l-none"
                        type="primary"
                        onClick={() => addGroupName()}
                    >
                        Add Group
                    </Button>
                </Col>
            </Row>
            <TitleDivider title={"Pathway Offers Groups"} />
            <Row>
                <Table
                    dataSource={groupsOfOffers}
                    bordered
                    className="ant-table-wrapper--responsive w-full"
                    rowClassName={() => "antd-row"}
                    rowKey="id"
                >
                    <Column
                        className="antd-col"
                        title="Offer Group"
                        dataIndex="group_name"
                        key="group_name"
                        render={(text, record) => ({
                            children: text,
                            props: {
                                "data-title": "Offer Group",
                            }
                        })}
                    />
                    <Column
                        className="antd-col"
                        title="Offers"
                        dataIndex="inputName"
                        key="inputName"
                        render={(inputName, record) => {
                            return {
                                children: (
                                    <Form.Item
                                        className="my-auto"
                                        name={inputName}
                                    >
                                        <Select
                                            className="w-full rounded custom-select-rounded-tr-none"
                                            showSearch
                                            mode="multiple"
                                        >
                                            {offerOptions}
                                        </Select>
                                    </Form.Item>
                                ),
                                props: {
                                    "data-title": "Offers",
                                }
                            }
                        }}
                    />
                    <Column
                        className="antd-col"
                        title=""
                        key="index"
                        render={(text, record) => ({
                            children: (
                                <Popconfirm
                                    className="text-red-500 cursor-pointer"
                                    title="Are you sure you want to delete this group?"
                                    onConfirm={() => handleGroupRemoval(pathway, record)}
                                    onCancel={onCancel}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    Remove
                                </Popconfirm>
                                // <Button
                                //     type="link"
                                //     danger
                                //     onClick={() => handleGroupRemoval(pathway, record)}
                                // >
                                //     Remove
                                // </Button>
                            ),
                            props: {
                                "data-title": "",
                            }
                        })}
                    />
                </Table>
                <div
                    className="w-full mb-4"
                    style={{
                        backgroundColor: '#e2e8f0',
                        height: '1px',
                    }}
                />
            </Row>
            <Row className="items-center mb-0">
                <span
                    className="text-gray-700 relative"
                    style={{ bottom: 2 }}
                >
                    Topics
                </span>
                <Form.Item
                    name="topics"
                    className="w-full"
                >
                    <Select
                        showSearch
                        className="w-full custom-select"
                        mode="multiple"
                    >
                        {topicOptions}
                    </Select>
                </Form.Item>
            </Row>
            <Row gutter={8}>
                <Col span={6}>
                    <Form.Item
                        label="Learn/Earn"
                        name="learn_and_earn"
                        labelAlign={"left"}
                        colon={false}
                        className="mb-0 inherit"
                        rules={[{ required: true, message: "Please select an option" }]}
                    >
                        <Select className="rounded custom-select">
                            <Option value="learn">Learn</Option>
                            <Option value="earn">Earn</Option>
                            <Option value="both">Learn and Earn</Option>
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <Form.Item
                        label="Generic Type"
                        name="type"
                        labelAlign={"left"}
                        colon={false}
                        className="mb-0 inherit"
                        rules={[{ required: true, message: "Please fill in this field" }]}
                    >
                        <Input className="rounded" />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        label="Earnings"
                        name="earnings"
                        labelAlign={"left"}
                        colon={false}
                        className="mb-0 inherit"
                    >
                        <Input className="rounded" />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={8}>
            <Col span={6}>
                    <Form.Item
                        label="Length"
                        name="length"
                        labelAlign={"left"}
                        colon={false}
                        className="mb-0 inherit"
                        rules={[{ required: true, message: "Please fill in this field" }]}
                    >
                        <Input
                            type="number"
                            className="rounded"
                        />
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <Form.Item
                        label="Length Unit"
                        name="length_unit"
                        labelAlign={"left"}
                        colon={false}
                        className="mb-0 inherit"
                        rules={[{ required: true, message: "Please select an option" }]}
                    >
                        <Select className="rounded custom-select">
                            {
                                length_unit.map((l, index) => {
                                    return (
                                        <Option
                                            key={index.toString()}
                                            value={l.name}
                                        >
                                            {l.name}
                                        </Option>
                                    );
                                })
                            }
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <Form.Item
                        label="Frequency"
                        name="frequency"
                        labelAlign={"left"}
                        colon={false}
                        className="mb-0 inherit"
                    >
                        <Input
                            type="number"
                            className="rounded"
                        />
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <Form.Item
                        label="Frequency Unit"
                        name="frequency_unit"
                        labelAlign={"left"}
                        colon={false}
                        className="mb-0 inherit"
                    >
                        <Select className="rounded custom-select">
                            {
                                frequency_unit.map((f, index) => {
                                    return (
                                        <Option
                                            key={index.toString()}
                                            value={f.name}
                                        >
                                            {f.name}
                                        </Option>
                                    );
                                })
                            }
                        </Select>
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={8}>
                <Col span={6}>
                    <Form.Item
                        label="Credit"
                        name="credit"
                        labelAlign={"left"}
                        colon={false}
                        className="mb-0 inherit"
                        rules={[{ required: true, message: "Please fill in this field" }]}
                    >
                        <Input
                            type="number"
                            className="rounded"
                        />
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <Form.Item
                        label="Credit Unit"
                        name="credit_unit"
                        labelAlign={"left"}
                        colon={false}
                        className="mb-0 inherit"
                        rules={[{ required: true, message: "Please select an option" }]}
                    >
                        <Select className="rounded custom-select">
                            {
                                credit_unit.map((credit, index) => {
                                    return (
                                        <Option
                                            key={index.toString()}
                                            value={credit.name}
                                        >
                                            {credit.name}
                                        </Option>
                                    );
                                })
                            }
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <Form.Item
                        label="Pay"
                        name="pay"
                        labelAlign={"left"}
                        colon={false}
                        className="mb-0 inherit"
                        rules={[{ required: true, message: "Please fill in this field" }]}
                    >
                        <Input
                            type="number"
                            className="rounded"
                        />
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <Form.Item
                        label="Pay Unit"
                        name="pay_unit"
                        labelAlign={"left"}
                        colon={false}
                        className="mb-0 inherit"
                        rules={[{ required: true, message: "Please select an option" }]}
                    >
                        <Select className="rounded custom-select">
                            {
                                payment_unit.map((unit, index) => {
                                    return (
                                        <Option
                                            key={index.toString()}
                                            value={unit.name}
                                        >
                                            {unit.name}
                                        </Option>
                                    );
                                })
                            }
                        </Select>
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={8}>
                <Col span={12}>
                    <Form.Item
                        label="Outlook"
                        name="outlook"
                        labelAlign={"left"}
                        colon={false}
                        className="mb-0 inherit"
                    >
                        <Input className="rounded" />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        label="Provider"
                        name="provider_id"
                        labelAlign={"left"}
                        colon={false}
                        className="mb-0 inherit flex-col w-full"
                    >
                        <Select
                            className={`custom-select-rounded-l-r-none`}
                            showSearch
                            disabled={scopedToProvider}
                            defaultValue={
                                scopedToProvider && providers && providers.length
                                    ? head(providers).id
                                    : null
                            }
                            name="provider_id"
                        >
                            {providerTypeOptions}
                        </Select>
                    </Form.Item>
                </Col>
            </Row>
        </Layout>
    );
};

export default PathwayForm;