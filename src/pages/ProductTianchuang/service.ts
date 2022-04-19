import { request } from 'umi';
import type { TableListParams } from './data';

export async function queryRule(params: TableListParams) {
  const { current, pageSize, ...requestParams } = params;
  return request('/api/manager/producttianchuang', {
    params: {
      ...requestParams,
      per_page: params.pageSize,
      page: params.current,
    },
  });
}

export async function removeRule(params: { key: number[] }) {
  return request('/api/manager/producttianchuang', {
    method: 'DELETE',
    data: {
      ids: params.key,
    },
  });
}

export async function setUsed(id: number) {
  return request('/api/manager/producttianchuang/use/'.concat(id.toString()), {
    method: 'POST',
  });
}

export async function generate(size: number, year: number, complimentary: number) {
  return request('/api/manager/producttianchuang/generate', {
    method: 'POST',
    data: {
      complimentary,
      num: size,
      year,
    },
  });
}

export async function download() {
  return request('/api/manager/producttianchuang/export', {
    method: 'GET',
  });
}
