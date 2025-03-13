import * as React from 'react';

declare module 'react' {
  export interface FC<P = {}> {
    (props: P & { children?: React.ReactNode }): React.ReactElement | null;
    displayName?: string;
    defaultProps?: Partial<P>;
  }

  export interface ChangeEvent<T = Element> extends SyntheticEvent<T> {
    target: EventTarget & T;
  }

  export interface MouseEvent<T = Element, E = NativeMouseEvent> extends SyntheticEvent<T, E> {
    altKey: boolean;
    button: number;
    buttons: number;
    clientX: number;
    clientY: number;
    ctrlKey: boolean;
    getModifierState(key: string): boolean;
    metaKey: boolean;
    movementX: number;
    movementY: number;
    pageX: number;
    pageY: number;
    relatedTarget: EventTarget | null;
    screenX: number;
    screenY: number;
    shiftKey: boolean;
  }

  export interface SyntheticEvent<T = Element, E = Event> {
    bubbles: boolean;
    cancelable: boolean;
    currentTarget: T;
    defaultPrevented: boolean;
    eventPhase: number;
    isDefaultPrevented(): boolean;
    isPropagationStopped(): boolean;
    isTrusted: boolean;
    nativeEvent: E;
    preventDefault(): void;
    stopPropagation(): void;
    target: EventTarget;
    timeStamp: number;
    type: string;
  }
}

// Mock NativeMouseEvent
interface NativeMouseEvent extends MouseEvent {} 