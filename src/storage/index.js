import { AsyncStorage } from 'react-native';

export const storage = {
  async getItem(key) {
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem(key, (err, data) => {
        if (err) {
          reject(err);
          return;
        }
        if (data) {
          resolve(JSON.parse(data).value);
        }
        resolve(null);
      });
    });
  },
  async setItem(key, value) {
    const data = { value, type: typeof value };
    const jsonValue = JSON.stringify(data);
    return new Promise((resolve, reject) => {
      AsyncStorage.setItem(key, jsonValue, err => {
        if (err) {
          reject(err);
          return;
        }
        resolve(true);
      });
    });
  },
  async removeItem(key) {
    return new Promise((resolve, reject) => {
      AsyncStorage.removeItem(key, err => {
        if (err) {
          reject(err);
          return;
        }
        resolve(true);
      });
    });
  },
  clear() {
    console.log('clear');
  },
};

export default storage;
