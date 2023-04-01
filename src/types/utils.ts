import { CamelCase } from 'type-fest';

export type CamelCaseKeys<T> = {
  [key in keyof T as CamelCase<key>]: T[key];
};
