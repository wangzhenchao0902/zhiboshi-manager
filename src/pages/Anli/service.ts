import { request } from 'umi';
import type { TableListParams } from './data';

export async function queryRule(params: TableListParams) {
  const { current, pageSize, ...requestParams } = params;
  return request('/api/manager/anli', {
    params: {
      ...requestParams,
      per_page: params.pageSize,
      page: params.current,
    },
  });
}

export async function removeRule(params: { key: number[] }) {
  return request('/api/manager/anli', {
    method: 'DELETE',
    data: {
      ids: params.key,
    },
  });
}

export async function addRule(params: TableListParams) {
  return request('/api/manager/anli', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function updateRule(id: number, params: TableListParams) {
  return request('/api/manager/anli/'.concat(id.toString()), {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}
