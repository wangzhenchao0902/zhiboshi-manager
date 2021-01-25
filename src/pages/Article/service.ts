import { request } from 'umi';
import type { TableListParams } from './data.d';

export async function queryRule(params: TableListParams) {
  const { current, pageSize, ...requestParams } = params;
  return request('/api/manager/article', {
    params: {
      ...requestParams,
      per_page: params.pageSize,
      page: params.current,
    },
  });
}

export async function removeRule(params: { key: number[] }) {
  return request('/api/manager/article', {
    method: 'DELETE',
    data: {
      ids: params.key,
    },
  });
}

export async function addRule(params: TableListParams) {
  return request('/api/manager/article', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function updateRule(id: number, params: TableListParams) {
  return request('/api/manager/article/'.concat(id.toString()), {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}
