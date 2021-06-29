import { request } from 'umi';
import type { TableListParams } from './data.d';

export async function queryRule(params: TableListParams) {
  const { current, pageSize, ...requestParams } = params;
  return request('/api/manager/product', {
    params: {
      ...requestParams,
      per_page: params.pageSize,
      page: params.current,
    },
  });
}

export async function removeRule(params: { key: number[] }) {
  return request('/api/manager/product', {
    method: 'DELETE',
    data: {
      ids: params.key,
    },
  });
}

export async function setUsed(id: number) {
  return request('/api/manager/product/use/'.concat(id.toString()), {
    method: 'POST',
  });
}

export async function generate(size: number, year: number, complimentary: boolean) {
  return request('/api/manager/product/generate', {
    method: 'POST',
    data: {
      complimentary,
      num: size,
      year,
    },
  });
}

export async function download() {
  return request('/api/manager/product/export', {
    method: 'GET',
  });
}
