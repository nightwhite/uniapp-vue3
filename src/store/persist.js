/**
 * 深拷贝函数，用于将对象进行完整复制。
 * @param obj 要深拷贝的对象
 * @param cache 用于缓存已复制的对象，防止循环引用
 * @returns 深拷贝后的对象副本
 */
export function deepClone(obj, cache = new Map()) {
  // 如果对象为 null 或者不是对象类型，则直接返回该对象
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // 处理特殊对象类型：日期、正则表达式、错误对象
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }
  if (obj instanceof RegExp) {
    return new RegExp(obj.source, obj.flags);
  }
  if (obj instanceof Error) {
    const errorCopy = new Error(obj.message);
    errorCopy.stack = obj.stack;
    return errorCopy;
  }

  // 检查缓存中是否已存在该对象的复制
  if (cache.has(obj)) {
    return cache.get(obj);
  }

  // 根据原始对象的类型创建对应的空对象或数组
  const copy = Array.isArray(obj) ? [] : {};

  // 将当前对象添加到缓存中
  cache.set(obj, copy);

  // 递归地深拷贝对象的每个属性
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      copy[key] = deepClone(obj[key], cache);
    }
  }

  return copy;
}

/*
 * @Author: weisheng
 * @Date: 2023-04-18 21:48:30
 * @LastEditTime: 2023-09-03 14:32:07
 * @LastEditors: weisheng
 * @Description:
 * @FilePath: \wot-starter\src\store\persist.ts
 * 记得注释
 */
export function persist({ store }) {
  // 暂存 State
  let persistState = deepClone(store.$state);
  // 从缓存中读取
  const storageState = uni.getStorageSync(store.$id);
  if (storageState) {
    persistState = storageState;
  }
  store.$state = persistState;
  store.$subscribe(() => {
    // 在存储变化的时候将 store 缓存
    uni.setStorageSync(store.$id, deepClone(store.$state));
  });
}
