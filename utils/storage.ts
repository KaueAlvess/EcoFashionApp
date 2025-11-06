// Cross-platform storage wrapper: uses localStorage on web, AsyncStorage on native.
import { Platform } from 'react-native';
let AsyncStorage: any = null;
if (Platform.OS !== 'web') {
  try {
    // Dynamically require to avoid bundling issues on web
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    AsyncStorage = require('@react-native-async-storage/async-storage').default;
  } catch (e) {
    AsyncStorage = null;
  }
}

type ChangeCallback = (key: string, newValue: string | null) => void;

const listeners = new Set<ChangeCallback>();

export async function getItem(key: string): Promise<string | null> {
  if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
    return Promise.resolve(window.localStorage.getItem(key));
  }
  if (AsyncStorage) return AsyncStorage.getItem(key);
  return Promise.resolve(null);
}

export async function setItem(key: string, value: string): Promise<void> {
  if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
    window.localStorage.setItem(key, value);
    // Dispatch native-like change event
    try {
      window.dispatchEvent(new StorageEvent('storage', { key, newValue: value } as any));
    } catch (e) {
      // fallback: call listeners
      listeners.forEach(fn => fn(key, value));
    }
    listeners.forEach(fn => fn(key, value));
    return Promise.resolve();
  }
  if (AsyncStorage) {
    await AsyncStorage.setItem(key, value);
    listeners.forEach(fn => fn(key, value));
    return;
  }
}

export async function removeItem(key: string): Promise<void> {
  if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
    window.localStorage.removeItem(key);
    try {
      window.dispatchEvent(new StorageEvent('storage', { key, newValue: null } as any));
    } catch (e) {
      listeners.forEach(fn => fn(key, null));
    }
    listeners.forEach(fn => fn(key, null));
    return Promise.resolve();
  }
  if (AsyncStorage) {
    await AsyncStorage.removeItem(key);
    listeners.forEach(fn => fn(key, null));
    return;
  }
}

export function addChangeListener(cb: ChangeCallback) {
  listeners.add(cb);
}

export function removeChangeListener(cb: ChangeCallback) {
  listeners.delete(cb);
}

export default {
  getItem,
  setItem,
  removeItem,
  addChangeListener,
  removeChangeListener,
};
