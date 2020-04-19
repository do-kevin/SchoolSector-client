import React, { useEffect } from 'react';
import { Table, Button, Tag } from 'antd';
import dayjs from 'dayjs';
import 'scss/antd-overrides.scss';

const { Column } = Table;

export default function OffersTable({
	data,
	providers,
	datafields,
	handleUpdateModal,
	handleRowSelection,
	viewEnrollments
}) {
	useEffect(() => {}, [data]);

    return (
        <Table
            dataSource={data}
            bordered
            className="ant-table-wrapper--responsive"
			rowClassName={() => "antd-row"}
			rowKey="id"
			onRow={(record, rowIndex) => {
				return {
					onClick: event => {
						if (event.target.type === "button") {
							return;
						}
						handleRowSelection(record, rowIndex);
					}
				}
			}}
        >
            <Column
				className="antd-col"
				title="ID"
				dataIndex="id"
				key="id"
				render={(text, record) => ({
					children: text,
					props: {
						"data-title": "ID",
					}
				})}
			/>
            <Column
				className="antd-col"
				title="Name"
				dataIndex="name"
				key="name"
				render={(text, record) => ({
					children: text,
					props: {
						"data-title": "Name",
					}
				})}
			/>
            <Column
				className="antd-col"
				title="Category"
				dataIndex="category"
				key="category"
				render={
					(id) => {
						let name = null;
						if (datafields[id]) {
							name = datafields[id].name;
						}
						return {
							children: name,
							props: { "data-title": "Category" }
						}
					}
                }
			/>
            <Column
				className="antd-col"
				title="Provider"
				dataIndex="provider_id"
				key="provider_id"
				render={
					(id) => {
						let name = 'N/A';
						if (providers[id]) {
							name = providers[id].name;
						}
						return {
							children: name,
							props: { "data-title": "Provider" }
						}
					}
                }
			/>
            <Column
				className="antd-col"
				title="Topics"
				dataIndex="DataFields"
				key="DataFields"
				render={(datafields = [], record) => {
					datafields = datafields.filter(d => d.type === 'topic');
					let children = 'N/A';

					if (datafields.length) {
						children = (
							<>
								{
									datafields.map((datafield, index) => {
										if (datafield.type !== 'topic') {
											return null;
										}
										return (
											<Tag
												color={index % 2 ? "blue" : "orange"}
												key={index.toString()}
											>
												{ datafield.name }
											</Tag>
										);
									})
								}
							</>
						);
					}

					return {
						children,
						props: {
							"data-title": "Topics",
						}
					}
				}}
			/>
            <Column
				className="antd-col"
				title="Start Date"
				dataIndex="start_date"
				key="start_date"
				render={
                    date => {
						return {
							children: dayjs(date).format('MMM DD, YYYY'),
							props: { "data-title": "Start Date" }
						}
                    }
                }
			/>
            <Column
				className="antd-col"
				title="Actions"
				key="index"
				render={(text, record) => {
					return {
						children: (
							<>
								<Button
									type="default"
									className="mr-2 rounded"
									onClick={() => handleUpdateModal(record)}
								>
									Update
								</Button>
								<Button
									className="rounded"
									type="default"
									onClick={() => viewEnrollments(record)}
								>
									View enrollments
								</Button>
							</>
						),
						props: {
							"data-title": "Actions",
						}
				}}}
			/>
        </Table>
    );
}
