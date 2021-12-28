import { diff } from './utils/diff';

export { storage } from './storage';

// 优先获取本地数据，云端数据请求
export class ApiCache {
  constructor(options) {
    const { request, storage } = options;
    this.map = {};
    this.request = request;
    this.storage = storage;
  }

  storageGet = async (key) => {
    const res = await this.storage.getItem(key);
    return res;
  };

  storageSet = (key, val) => {
    this.storage.setItem(key, val);
  };

  init = (prefix) => {
    this._oldRequest = this.request;
    this.request = async (apiLink, apiData, apiVersion, options) => {
      const { cache } = options;

      console.log(apiLink, `开启${cache ? '缓存' : '云端'}数据`);
      if (!cache) {
        return this._oldRequest(apiLink, apiData, apiVersion, options);
      }
      let data: any;
      const key = `${prefix || ''}${apiLink}_${apiVersion}`;
      try {
        data = await this.storageGet(key);
      } catch (e) {
        console.log(e, 'e ====');
      }
      return new Promise(resolve => {
        resolve({
          datas: data,
          updateCallback: async (callback: (arg: any) => void) => {
            console.log(' ============== start');
            console.log('本地数据:', apiLink, data);
            data && callback && callback(data);
            const res = await this._oldRequest(apiLink, apiData, apiVersion, options);
            console.log('app或云端数据:', apiLink, res);
            if (!diff(res, data) || !res) {
              console.log('对比数据不需要更新:', apiLink, data, res);
              console.log(' ============== ');
              return;
            }
            this.storageSet(key, res);
            callback && callback(res);
            return new Promise(resolveSub => {
              resolveSub(res);
              console.log(' ============== end');
            });
          },
        });
      });
    };
  };

  start = (prefix: string) => {
    this.init(prefix);
    return this.request;
  };
}

export default ApiCache;
