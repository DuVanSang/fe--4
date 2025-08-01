import axios from 'axios';
import Cookies from 'js-cookie';

import { IBaseHttpResponse } from '@/base/base.model';
import { httpService } from '@/base/http-service';
import { API_ENDPOINT } from '@/configs/constant.config';

import {
  ILoginInput,
  ILoginResult,
  IRefreshTokenResult,
  IRegisterInput,
  IRegisterResult,
  IUserInfo,
} from './auth.model';
import { ALL_PERMISSIONS } from '@/configs/permissions.constant';

class AuthService {
  async login(input: ILoginInput) {
    const response = await axios.post<IBaseHttpResponse<ILoginResult>>(
      `${API_ENDPOINT}/auth/Login`,
      input,
    );

    const data = response.data.result;

    Cookies.set('accessToken', data.token);

    return this.getUserInfo();
  }

  async getUserInfo() {
    // Bỏ gọi API /users/MyInfo, trả về thông tin admin mặc định
    const accessToken = Cookies.get('accessToken');
    if (!accessToken) {
      throw new Error('Access token is required');
    }
    // Trả về user admin mặc định
    // Tạo object chứa tất cả quyền = true
    const grantedPermissions: { [key: string]: boolean } = {};
    Object.values(ALL_PERMISSIONS).forEach((key) => {
      grantedPermissions[String(key)] = true;
    });
    return {
      id: 1,
      name: 'admin',
      userName: 'admin',
      email: 'admin@localhost',
      role: 'admin',
      grantedPermissions,
    };
  }

  async refreshToken() {
    try {

      const response = await axios.post<IBaseHttpResponse<IRefreshTokenResult>>(
        `${API_ENDPOINT}/auth/Refresh`,
      );

      const data = response.data.result;

      Cookies.set('accessToken', data.token);

      return true;
    } catch (error) {
      Cookies.remove('accessToken');
      window.location.href = '/auth/login';
      return false;
    }
  }

  async logout() {
    try {
      const token = Cookies.get('accessToken');
      console.log('token', token);
      const response = await axios.post<IBaseHttpResponse<null>>(
        `${API_ENDPOINT}/auth/Logout`,
        {
          token: token,
        }
      );

      return response.data.result;
    } catch (error) {
      return Promise.reject(error);
    } finally {
      Cookies.remove('accessToken');
      window.location.href = '/auth/login';
    }
  }

  async register(input: IRegisterInput) {
    const response = await axios.post<IBaseHttpResponse<IRegisterResult>>(
      `${API_ENDPOINT}/users/Create`,
      input,
    );
    const data = response.data.result;

    return data;
  }
}

const authService = new AuthService();

export default authService;
console.log('✔ API_ENDPOINT:', API_ENDPOINT);
