declare module 'mobx-keystone' {
  import { IObservableArray } from 'mobx';

  export function model<T extends object>(
    name: string
  ): (target: new (...args: any[]) => T) => void;

  export function Model<T extends object>(
    props: T
  ): any;

  export function prop<T>(defaultValue?: T | (() => T)): T;
  
  export function tProp<T>(type: any, defaultValue?: T | (() => T)): T;

  export function modelAction(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ): PropertyDescriptor;

  export const idProp: string;

  export const types: {
    string: any;
    boolean: any;
    number: any;
    array: (type: any) => any;
    model: <T>(modelClass: new (...args: any[]) => T) => any;
    // Add other types as needed
  };

  export enum ModelAutoTypeCheckingMode {
    AlwaysOn = 'alwaysOn',
    DevModeOnly = 'devModeOnly',
    AlwaysOff = 'alwaysOff'
  }

  export function setGlobalConfig(config: {
    modelAutoTypeChecking?: ModelAutoTypeCheckingMode;
    [key: string]: any;
  }): void;

  export function getParent<T>(obj: any): T;
  export function getRoot<T>(obj: any): T;
  export function isRoot(obj: any): boolean;
  export function registerRootStore(store: any): void;
  export function getSnapshot<T>(obj: any): T;
  export function fromSnapshot<T>(snapshot: any): T;
  export function applySnapshot(obj: any, snapshot: any): void;
  export function onPatches(obj: any, callback: (patches: any[], inversePatches: any[]) => void): () => void;
  export function applyPatches(obj: any, patches: any[]): void;
  export function onActionMiddleware(obj: any, middleware: any): () => void;

  export interface Patch {
    op: 'add' | 'remove' | 'replace';
    path: string[];
    value?: any;
  }

  export interface ActionCall {
    actionName: string;
    args: any[];
    targetPath: string[];
    targetPathIds: string[];
    rootPath: string[];
    result?: any;
    timestamp: number;
  }
} 