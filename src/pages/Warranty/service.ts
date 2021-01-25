import { request } from 'umi';
import type { TableListParams } from './data.d';

export async function queryRule(params: TableListParams) {
  const { current, pageSize, ...requestParams } = params;
  return request('/api/manager/warranty', {
    params: {
      ...requestParams,
      per_page: params.pageSize,
      page: params.current,
    },
  });
}

export async function updateRule(id: number, params: TableListParams) {
  return request('/api/manager/warranty/'.concat(id.toString()), {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}

export async function voidWarranty(id: number) {
  return request('/api/manager/warranty/void/'.concat(id.toString()), {
    method: 'POST',
  });
}
