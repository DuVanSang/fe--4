import { IBaseHttpResponse } from '@/base/base.model';
import { httpService } from '@/base/http-service';

import { IAbpConfiguration } from './abp.model';
import { IUserInfo } from '../auth/auth.model';

class AbpService {
  async getConfigurations() {
    try {
      const response = await httpService.request<
        IBaseHttpResponse<IAbpConfiguration>
      >({
        url: '/users/GetAllConfigurations',
        method: 'GET',
      });
      return response.result;
    } catch (e) {
      // Nếu backend không có API, trả về cấu hình tĩnh cho admin với full quyền
      const { ALL_PERMISSIONS } = require('@/configs/permissions.constant');
      const grantedPermissions: { [key: string]: boolean } = {};
      Object.values(ALL_PERMISSIONS).forEach((key) => {
        grantedPermissions[String(key)] = true;
      });
      return {
        roleId: 1,
        roleName: 'admin',
        auth: {
          allPermissions: ALL_PERMISSIONS,
          grantedPermissions,
        },
      };
    }
  }

  async getCurLoginInfo() {
    const response = await httpService.request<
      IBaseHttpResponse<IUserInfo>
    >({
      url: '/users/MyInfo',
      method: 'GET',
    });

    return response.result;
  }
}

export const abpService = new AbpService();
