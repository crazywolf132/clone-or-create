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
    createElement
} from 'react';

type ComponentType<P = {}> = FunctionComponent<P> | ComponentClass<P> | ForwardRefExoticComponent<P> | keyof JSX.IntrinsicElements;

type CloneOrCreateOptions<C extends ComponentType<any>> = {
    component: C;
    props?: ComponentProps<C>;
    children?: ReactNode;
    ref?: Ref<ComponentProps<C> extends RefAttributes<infer T> ? T : never>;
    key?: string | number;
};

function cloneOrCreate<C extends ComponentType<any>>(component: C, props?: ComponentProps<C>, children?: ReactNode): ReactElement | ReactPortal;
function cloneOrCreate<C extends ComponentType<any>>(options: CloneOrCreateOptions<C>): ReactElement | ReactPortal;
function cloneOrCreate<C extends ComponentType<any>>(
    componentOrOptions: C | CloneOrCreateOptions<C>,
    props?: ComponentProps<C>,
    children?: ReactNode
): ReactElement | ReactPortal {
    if (typeof componentOrOptions === 'object' && 'component' in componentOrOptions) {
        const { component, props, children, ref, key } = componentOrOptions;
        return React.isValidElement(component)
            ? cloneElement(component, { ...props, key }, children)
            : createElement(component, { ...props, ref, key }, children);
    }

    return React.isValidElement(componentOrOptions)
        ? cloneElement(componentOrOptions, { ...props, key: props?.key }, children)
        : createElement(componentOrOptions, { ...props, key: props?.key }, children);
}

export default cloneOrCreate;