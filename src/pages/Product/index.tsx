import { Button, InputNumber, message, Checkbox, Select } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import type { TableListItem } from './data.d';
import { queryRule, download, generate, setUsed, removeRule } from './service';
import QRCode from 'qrcode.react';
import { FormattedMessage } from 'umi';

import ql from '../../../public/logo_50x50.png';
const { Option } = Select;

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

const handleExport = async () => {
  const hide = message.loading('正在导出');
  try {
    await download();
    hide();
    message.success('导出成功，即将刷新');
    return true;
  } catch (error) {
    hide();
    message.error(error.message);
    return false;
  }
};

const handleGenerate = async (
  num: number,
  year: number,
  complimentary: number,
  category: string,
) => {
  const hide = message.loading('正在生成');
  try {
    await generate(num, year, complimentary, category);
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
  const [autoGenerateYear, setAutoGenerateYear] = useState<any>(10);
  const [autoGenerateComplimentary, setAutoGenerateComplimentary] = useState<any>(0);
  const [autoCategory, setAutoCategory] = useState<any>('');

  const columns: ProColumns<TableListItem>[] = [
    { title: 'ID', dataIndex: 'id', hideInForm: true },
    {
      title: '状态',
      dataIndex: 'status',
      hideInForm: true,
      valueEnum: new Map([
        ['0', { text: '待使用', status: 'Success' }],
        ['1', { text: '已使用', status: 'Error' }],
      ]),
    },
    { title: '质保ID', dataIndex: 'warranty_id', hideInForm: true },
    { title: '年限', dataIndex: 'year', hideInForm: true, hideInSearch: true },
    {
      title: '终生免费补膜',
      dataIndex: 'complimentary',
      hideInForm: true,
      hideInSearch: true,
      valueEnum: new Map([
        ['0', { text: '否' }],
        ['10', { text: '否' }],
        ['1', { text: '是' }],
      ]),
    },
    { title: '产品编号', dataIndex: 'sn', hideInForm: true, hideInSearch: true },
    {
      title: '型号',
      dataIndex: 'category',
      hideInForm: true,
      hideInSearch: true,
      valueEnum: new Map([
        ['', { text: '不限' }],
        ['金刚盾', { text: '金刚盾' }],
        ['全能王', { text: '全能王' }],
        ['仿生王', { text: '仿生王' }],
        ['哑光版', { text: '哑光版' }],
      ]),
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
            imageSettings={{ src: ql, x: null, y: null, height: 12, width: 12, excavate: true }}
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
                const success = await handleExport();
                if (success) {
                  if (actionRef.current) {
                    actionRef.current.reload();
                  }
                }
              }}
            >
              导出
            </Button>{' '}
            <Button
              type="primary"
              onClick={async () => {
                const success = await handleGenerate(
                  autoGenerateNum,
                  autoGenerateYear,
                  autoGenerateComplimentary,
                  autoCategory,
                );
                if (success) {
                  if (actionRef.current) {
                    actionRef.current.reload();
                  }
                }
              }}
            >
              编号生成
            </Button>{' '}
            <Checkbox
              onChange={(e) => {
                setAutoGenerateComplimentary(e.target.checked ? 1 : 0);
              }}
            >
              终生免费补膜
            </Checkbox>
            <InputNumber
              onChange={(e) => {
                setAutoGenerateNum(e);
              }}
              style={{ width: 80 }}
              defaultValue={autoGenerateNum}
              max={500}
            />
            个，年限
            <InputNumber
              onChange={(e) => {
                setAutoGenerateYear(e);
              }}
              style={{ width: 80 }}
              defaultValue={autoGenerateYear}
              max={30}
            />
            年
            <Select
              defaultValue={autoCategory}
              style={{ width: 120 }}
              onChange={(e) => {
                setAutoCategory(e);
              }}
            >
              <Option value="">不限型号</Option>
              <Option value="金刚盾">金刚盾</Option>
              <Option value="全能王">全能王</Option>
              <Option value="仿生王">仿生王</Option>
              <Option value="哑光版">哑光版</Option>
            </Select>
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
