import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
const key = 'bilirsen.refresh.v1';
let webToken: string | null = null;
export const tokenStorage = {
  async read(): Promise<string | null> {
    return Platform.OS === 'web' ? webToken : SecureStore.getItemAsync(key);
  },
  async write(token: string): Promise<void> {
    if (Platform.OS === 'web') {
      webToken = token;
      return;
    }
    await SecureStore.setItemAsync(key, token);
  },
  async clear(): Promise<void> {
    if (Platform.OS === 'web') {
      webToken = null;
      return;
    }
    await SecureStore.deleteItemAsync(key);
  },
};
