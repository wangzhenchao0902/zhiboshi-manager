import request from 'umi-request';

export async function Upload(file: File) {
  const formData = new FormData();
  formData.append('file', file);

  return request('/api/manager/upload', {
    method: 'POST',
    data: formData,
  });
}
