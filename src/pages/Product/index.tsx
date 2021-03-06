import { Button, InputNumber, message } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import type { TableListItem } from './data.d';
import { queryRule, generate, setUsed, removeRule } from './service';
import QRCode from 'qrcode.react';
import { FormattedMessage } from 'umi';

import ql from '../../../public/logo_50x50.png';

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
    message.error(error.message);
    return false;
  }
};

const handleUse = async (id: number) => {
  const hide = message.loading('正在更新');
  try {
    await setUsed(id);
    hide();
    message.success('更新成功，即将刷新');
    return true;
  } catch (error) {
    hide();
    message.error(error.message);
    return false;
  }
};

const handleGenerate = async (num: number) => {
  const hide = message.loading('正在生成');
  try {
    await generate(num);
    hide();
    message.success('生成成功，即将刷新');
    return true;
  } catch (error) {
    hide();
    message.error(error.message);
    return false;
  }
};

const TableList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [selectedRowsState, setSelectedRows] = useState<TableListItem[]>([]);
  const [autoGenerateNum, setAutoGenerateNum] = useState<any>(10);

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
        ['0', { text: '待使用', status: 'Success' }],
        ['1', { text: '已使用', status: 'Error' }],
      ]),
    },
    {
      title: '产品编号',
      dataIndex: 'sn',
      hideInForm: true,
      hideInSearch: true,
    },
    {
      title: '二维码',
      dataIndex: 'sn',
      hideInForm: true,
      hideInSearch: true,
      render: (_, entity) => {
        return (
          <QRCode
            value={entity.qr_sn}
            size={100}
            bgColor={'#ffffff'}
            fgColor={'#000000'}
            level={'L'}
            includeMargin={false}
            renderAs={'svg'}
            imageSettings={{
              src: ql,
              x: null,
              y: null,
              height: 12,
              width: 12,
              excavate: true,
            }}
          />
        );
      },
    },
    {
      title: <FormattedMessage id="pages.searchTable.titleOption" defaultMessage="操作" />,
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => {
        return (
          <>
            {record.status !== 1 && (
              <a
                key="config"
                onClick={async () => {
                  const success = await handleUse(record.id);
                  if (success) {
                    if (actionRef.current) {
                      actionRef.current.reload();
                    }
                  }
                }}
              >
                <FormattedMessage id="pages.searchTable.setUsed" defaultMessage="设为已使用" />
              </a>
            )}
          </>
        );
      },
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
        toolBarRender={() => [
          <>
            <Button
              type="primary"
              onClick={async () => {
                const success = await handleGenerate(autoGenerateNum);
                if (success) {
                  if (actionRef.current) {
                    actionRef.current.reload();
                  }
                }
              }}
            >
              编号生成
            </Button>{' '}
            <InputNumber
              onChange={(e) => {
                setAutoGenerateNum(e);
              }}
              style={{ width: 80 }}
              defaultValue={autoGenerateNum}
              max={500}
            />
            个
          </>,
        ]}
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
    </PageContainer>
  );
};

export default TableList;
