import { request } from 'umi';

export type LoginParamsType = {
  name: string;
  password: string;
  // mobile: string;
  // captcha: string;
  // type: string;
};

export async function fakeAccountLogin(params: LoginParamsType) {
  return request<API.LoginStateType>('/api/manager/login', {
    method: 'POST',
    data: params,
  });
}

// export async function getFakeCaptcha(mobile: string) {
//   return request(`/api/login/captcha?mobile=${mobile}`);
// }

export async function outLogin() {
  return request('/api/manager/logout');
}
