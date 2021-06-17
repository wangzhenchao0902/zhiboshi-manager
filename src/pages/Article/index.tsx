import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Drawer } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProDescriptions from '@ant-design/pro-descriptions';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import type { FormValueType } from './components/UpdateForm';
import type { TableListItem } from './data.d';
import { queryRule, updateRule, addRule, removeRule } from './service';
import { FormattedMessage } from 'umi';
import TableSwitch from '@/components/Switch/TableSwitch';

/**
 * 添加节点
 * @param fields
 */
const handleAdd = async (fields: TableListItem) => {
  const hide = message.loading('正在添加');
  try {
    await addRule({ ...fields });
    hide();
    message.success('添加成功');
    return true;
  } catch (error) {
    hide();
    message.error('添加失败请重试！');
    return false;
  }
};

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
    message.error('修改失败请重试！');
    return false;
  }
};

/**
 *  删除节点
 * @param selectedRows
 */
const handleRemove = async (selectedRows: TableListItem[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    await removeRule({
      key: selectedRows.map((row) => row.id),
    });
    hide();
    message.success('删除成功，即将刷新');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败，请重试');
    return false;
  }
};

const TableList: React.FC = () => {
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [stepFormValues, setStepFormValues] = useState<TableListItem>();
  const actionRef = useRef<ActionType>();
  const [row, setRow] = useState<TableListItem>();
  const [selectedRowsState, setSelectedRows] = useState<TableListItem[]>([]);
  const columns: ProColumns<TableListItem>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      hideInForm: true,
      render: (dom, entity) => {
        return <a onClick={() => setRow(entity)}>{dom}</a>;
      },
    },
    {
      title: '标题',
      dataIndex: 'title',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '标题为必填项',
          },
        ],
      },
    },
    {
      title: '分类',
      dataIndex: 'category_name',
      hideInForm: true,
    },
    {
      title: '分类',
      dataIndex: 'category_id',
      hideInTable: true,
      valueEnum: new Map([
        ['1', { text: '新闻中心' }],
        ['2', { text: '案例中心' }],
        ['3', { text: '关于我们' }],
        ['4', { text: '联系我们' }],
      ]),
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (_, entity) => {
        return (
          <TableSwitch
            checked={entity.status === 1}
            onChange={(checked) => {
              return handleUpdate(entity.id, { status: checked ? 1 : 2 });
            }}
          ></TableSwitch>
        );
      },
      valueEnum: new Map([
        ['1', { text: '正常' }],
        ['2', { text: '关闭' }],
      ]),
    },
    {
      title: '内容',
      dataIndex: 'content',
      hideInSearch: true,
      hideInTable: true,
      formItemProps: {
        rules: [
          {
            required: true,
            message: '内容为必填项',
          },
        ],
      },
    },
    {
      title: '是否推荐',
      dataIndex: 'recommend',
      // hideInTable: true,
      render: (_, entity) => {
        return (
          <TableSwitch
            checked={entity.recommend === 1}
            onChange={(checked) => {
              return handleUpdate(entity.id, { recommend: checked ? 1 : 0 });
            }}
          ></TableSwitch>
        );
      },
      valueEnum: new Map([
        ['1', { text: '是' }],
        ['0', { text: '否' }],
      ]),
    },
    {
      title: '排序',
      hideInSearch: true,
      dataIndex: 'order_number',
    },
    {
      title: '封面',
      hideInSearch: true,
      dataIndex: 'cover',
      render: (_, entity) => {
        return entity.preview_url ? (
          <img src={entity.preview_url} alt="avatar" style={{ width: '100px', height: '100px' }} />
        ) : (
          ''
        );
      },
    },
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
        toolBarRender={() => [
          <Button type="primary" onClick={() => handleModalVisible(true)}>
            <PlusOutlined /> 新建
          </Button>,
        ]}
        request={(params) => queryRule({ ...params })}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => setSelectedRows(selectedRows),
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              已选择 <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a> 项&nbsp;&nbsp;
            </div>
          }
        >
          <Button
            onClick={async () => {
              await handleRemove(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            批量删除
          </Button>
        </FooterToolbar>
      )}
      <CreateForm
        onSubmit={async (value) => {
          const success = await handleAdd(value);
          if (success) {
            handleModalVisible(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
          return success;
        }}
        onCancel={() => handleModalVisible(false)}
        modalVisible={createModalVisible}
      ></CreateForm>
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

      <Drawer
        width={600}
        visible={!!row}
        onClose={() => {
          setRow(undefined);
        }}
        closable={false}
      >
        {row?.title && (
          <ProDescriptions<TableListItem>
            column={2}
            title={row?.title}
            request={async () => ({
              data: row || {},
            })}
            params={{
              id: row?.id,
            }}
            columns={columns}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default TableList;
