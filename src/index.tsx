"use client";

import React, {
  ComponentClass,
  ComponentProps,
  ForwardRefExoticComponent,
  FunctionComponent,
  ReactElement,
  ReactNode,
  ReactPortal,
  Ref,
  RefAttributes,
  cloneElement,
  createContext,
  createElement,
  isValidElement,
  memo,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useReducer,
  useRef
} from 'react';

type ComponentType<P = {}> = FunctionComponent<P> | ComponentClass<P> | ForwardRefExoticComponent<P> | keyof JSX.IntrinsicElements;


type CloneOrCreateOptions<C extends ComponentType<any>, S = Record<string, any>> = {
  component: C;
  props?: ComponentProps<C>;
  children?: ReactNode;
  ref?: Ref<ComponentProps<C> extends RefAttributes<infer T> ? T : never>;
  key?: string | number;
  mergeProp?: (existingProps: ComponentProps<C>, newProps: ComponentProps<C>) => ComponentProps<C>;
  shouldMemo?: boolean;
  displayName?: string;
  context?: Record<string, any>;
  propsAreEqual?: (prevProps: ComponentProps<C>, nextProps: ComponentProps<C>) => boolean;
  beforeClone?: (props: ComponentProps<C>) => void;
  afterClone?: (clonedElement: ReactElement) => void;
  initialState?: S;
  reducer?: (state: S, action: any) => S;
  onUpdate?: (prevProps: ComponentProps<C>, nextProps: ComponentProps<C>) => void;
  onStateChange?: (prevState: S, nextState: S) => void;
  shouldUpdate?: (prevProps: ComponentProps<C>, nextProps: ComponentProps<C>) => boolean;
  getSnapshotBeforeUpdate?: (prevProps: ComponentProps<C>, prevState: S) => any;
  componentDidMount?: (props: ComponentProps<C>, state: S) => void;
  componentWillUnmount?: (props: ComponentProps<C>, state: S) => void;
  componentDidCatch?: (error: Error, info: { componentStack: string }) => void;
};

const CloneOrCreateContext = createContext<Record<string, any> | undefined>(undefined);

function cloneOrCreate<C extends ComponentType<any>, S = Record<string, any>>(
  component: C,
  props?: ComponentProps<C>,
  children?: ReactNode
): ReactElement | ReactPortal;
function cloneOrCreate<C extends ComponentType<any>, S = Record<string, any>>(
  options: CloneOrCreateOptions<C, S>
): ReactElement | ReactPortal;
function cloneOrCreate<C extends ComponentType<any>, S = Record<string, any>>(
  componentOrOptions: C | CloneOrCreateOptions<C, S>,
  props?: ComponentProps<C>,
  children?: ReactNode
): ReactElement | ReactPortal {
  if (typeof componentOrOptions === 'object' && 'component' in componentOrOptions) {
    const {
      component,
      props,
      children,
      ref,
      key,
      mergeProp,
      shouldMemo,
      displayName,
      context,
      propsAreEqual,
      beforeClone,
      afterClone,
      initialState,
      reducer,
      onUpdate,
      onStateChange,
      shouldUpdate,
      getSnapshotBeforeUpdate,
      componentDidMount,
      componentWillUnmount,
      componentDidCatch,
    } = componentOrOptions;

    const mergedProps = useMemo(() => {
      const existingProps: object = isValidElement(component)
        ? component.props as unknown as object
        : {};

      return mergeProp
        ? mergeProp(existingProps as ComponentProps<C>, props ?? ({} as ComponentProps<C>))
        : { ...existingProps, ...(props ?? {}) } as ComponentProps<C>;
    }, [component, props, mergeProp]);

    const contextValue = useContext(CloneOrCreateContext);
    const mergedContext = useMemo(() => ({ ...contextValue, ...context }), [contextValue, context]);

    const [state, dispatch] = useReducer(reducer ?? ((state) => state), initialState ?? {});

    const elementRef = useRef<ReactElement | null>(null);
    const stateRef = useRef<S>(state);
    const propsRef = useRef<ComponentProps<C>>(mergedProps);
    const snapshotRef = useRef<any>();

    const renderElement = useCallback(() => {
      beforeClone?.(mergedProps);

      const element = React.isValidElement(component)
        ? cloneElement(component, { ...mergedProps, key }, children)
        : createElement(CloneOrCreateContext.Provider, { value: mergedContext }, createElement(component, { ...mergedProps, ref, key }, children));

      elementRef.current = element;

      return element;
    }, [component, mergedProps, children, ref, key, mergedContext, beforeClone]);

    useLayoutEffect(() => {
      if (elementRef.current) {
        afterClone?.(elementRef.current);
      }
    }, [afterClone]);

    useEffect(() => {
      onUpdate?.(propsRef.current, mergedProps);
      propsRef.current = mergedProps;
    }, [mergedProps, onUpdate]);

    useEffect(() => {
      onStateChange?.(stateRef.current, state);
      stateRef.current = state;
    }, [state, onStateChange]);

    useEffect(() => {
      componentDidMount?.(mergedProps, state);
      return () => {
        componentWillUnmount?.(mergedProps, state);
      };
    }, [mergedProps, state, componentDidMount, componentWillUnmount]);

    useEffect(() => {
      if (shouldUpdate?.(propsRef.current, mergedProps)) {
        snapshotRef.current = getSnapshotBeforeUpdate?.(propsRef.current, stateRef.current);
      }
    }, [mergedProps, shouldUpdate, getSnapshotBeforeUpdate]);

    useEffect(() => {
      if (snapshotRef.current !== undefined) {
        snapshotRef.current = undefined;
      }
    }, [mergedProps, state]);

    useEffect(() => {
      const errorHandler = (event: ErrorEvent) => {
        componentDidCatch?.(event.error as Error, { componentStack: '' });
      };
      window.addEventListener('error', errorHandler);
      return () => {
        window.removeEventListener('error', errorHandler);
      };
    }, [componentDidCatch]);

    const memoizedElement = useMemo(() => {
      if (shouldMemo) {
        const MemoComponent = memo(renderElement, propsAreEqual as (prevProps: object, nextProps: object) => boolean);
        MemoComponent.displayName = displayName ?? `CloneOrCreate(${getDisplayName(component)})`;
        return createElement(MemoComponent);
      }
      return renderElement();
    }, [shouldMemo, renderElement, propsAreEqual, displayName, component]);

    return memoizedElement;
  }

  return isValidElement(componentOrOptions)
    ? cloneElement(componentOrOptions, { ...props, key: props?.key }, children)
    : createElement(componentOrOptions, { ...props, key: props?.key }, children);
}

function getDisplayName<C extends ComponentType<any>>(component: C): string {
  return typeof component === 'string'
    ? component
    : component.displayName || component.name || 'Component';
}

export default cloneOrCreate;