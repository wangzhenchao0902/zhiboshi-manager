import { message } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import UpdateForm from './components/UpdateForm';
import type { FormValueType } from './components/UpdateForm';
import type { TableListItem } from './data.d';
import { queryRule, updateRule, voidWarranty } from './service';
import { FormattedMessage } from 'umi';

/**
 * 更新节点
 * @param fields
 */
const handleUpdate = async (id: number, fields: FormValueType) => {
  const hide = message.loading('正在修改');
  try {
    await updateRule(id, fields);
    hide();
    message.success('修改成功');
    return true;
  } catch (error) {
    hide();
    message.error(error.message);
    return false;
  }
};

const handleVoid = async (id: number) => {
  const hide = message.loading('正在作废');
  try {
    await voidWarranty(id);
    hide();
    message.success('作废成功');
    return true;
  } catch (error) {
    hide();
    message.error(error.message);
    return false;
  }
};

const TableList: React.FC = () => {
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [stepFormValues, setStepFormValues] = useState<TableListItem>();
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<TableListItem>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      hideInForm: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      hideInForm: true,
      valueEnum: new Map([
        ['1', { text: '正常', status: 'Success' }],
        ['2', { text: '作废', status: 'Error' }],
      ]),
    },
    { title: '产品ID', dataIndex: 'product_id', hideInForm: true },
    { title: '姓名', dataIndex: 'name', hideInForm: true },
    { title: '手机号', dataIndex: 'phone', hideInForm: true },
    { title: '车架号', dataIndex: 'vin', hideInForm: true },
    { title: '开始时间', dataIndex: 'start_at', hideInForm: true, hideInSearch: true },
    { title: '结束时间', dataIndex: 'end_at', hideInForm: true, hideInSearch: true },
    {
      title: <FormattedMessage id="pages.searchTable.titleOption" defaultMessage="操作" />,
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="config"
          onClick={() => {
            handleUpdateModalVisible(true);
            setStepFormValues(record);
          }}
        >
          <FormattedMessage id="pages.searchTable.edit" defaultMessage="修改" />
        </a>,
        record.status === 1 && (
          <a
            key="config"
            onClick={async () => {
              const success = await handleVoid(record.id);
              if (success) {
                if (actionRef.current) {
                  actionRef.current.reload();
                }
              }
            }}
          >
            <FormattedMessage id="pages.searchTable.void" defaultMessage="作废" />
          </a>
        ),
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<TableListItem>
        headerTitle="查询表格"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 80,
        }}
        request={(params) => queryRule({ ...params })}
        columns={columns}
      />
      {stepFormValues && Object.keys(stepFormValues).length ? (
        <UpdateForm
          onSubmit={async (value) => {
            const success = await handleUpdate(stepFormValues.id, value);
            if (success) {
              handleUpdateModalVisible(false);
              setStepFormValues(undefined);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
            return success;
          }}
          onCancel={() => {
            handleUpdateModalVisible(false);
            setStepFormValues(undefined);
          }}
          updateModalVisible={updateModalVisible}
          values={stepFormValues}
        />
      ) : null}
    </PageContainer>
  );
};

export default TableList;
