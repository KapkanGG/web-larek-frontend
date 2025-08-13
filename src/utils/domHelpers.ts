type DOMElement<T extends HTMLElement = HTMLElement> = T | string;
type ElementCollection<T extends HTMLElement = HTMLElement> = string | NodeListOf<Element> | T[];

export const convertPascalToKebab = (str: string): string => {
    return str.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`).replace(/^-/, '');
};

export const isStringSelector = (value: unknown): value is string => {
    return typeof value === 'string' && value.length > 1 && (value.startsWith('.') || value.startsWith('#'));
};

export const isNullOrUndefined = (value: unknown): value is null | undefined => {
    return value === null || value === undefined;
};

export const queryElements = <T extends HTMLElement>(
    selector: ElementCollection<T>,
    parent: HTMLElement | Document = document
): T[] => {
    if (isStringSelector(selector)) {
        return Array.from(parent.querySelectorAll(selector)) as T[];
    }
    if (selector instanceof NodeList) {
        return Array.from(selector) as T[];
    }
    if (Array.isArray(selector)) {
        return selector;
    }
    throw new Error('Invalid selector type');
};

export const getElement = <T extends HTMLElement>(
    selector: DOMElement<T>,
    context: HTMLElement | Document = document
): T => {
    if (isStringSelector(selector)) {
        const elements = queryElements<T>(selector, context);
        if (elements.length === 0) {
            throw new Error(`Element not found: ${selector}`);
        }
        if (elements.length > 1) {
            console.warn(`Multiple elements found for selector: ${selector}`);
        }
        return elements[0];
    }
    if (selector instanceof HTMLElement) {
        return selector;
    }
    throw new Error('Invalid element reference');
};

export const cloneTemplateContent = <T extends HTMLElement>(
    template: string | HTMLTemplateElement
): T => {
    const templateElement = getElement(template) as HTMLTemplateElement;
    return templateElement.content.firstElementChild.cloneNode(true) as T;
};

export const generateBEMClass = (
    block: string,
    element?: string,
    modifier?: string
): { selector: string; className: string } => {
    let className = block;
    if (element) className += `__${element}`;
    if (modifier) className += `--${modifier}`;
    return { selector: `.${className}`, className };
};

export const getMethodNames = (
    obj: object,
    filterFn?: (name: string, desc: PropertyDescriptor) => boolean
): string[] => {
    return Object.entries(Object.getOwnPropertyDescriptors(Object.getPrototypeOf(obj)))
        .filter(([name, desc]) => 
            filterFn ? filterFn(name, desc) : typeof desc.value === 'function' && name !== 'constructor'
        )
        .map(([name]) => name);
};

export const setElementDataset = <T extends Record<string, unknown>>(
    element: HTMLElement,
    data: T
): void => {
    Object.entries(data).forEach(([key, value]) => {
        element.dataset[key] = String(value);
    });
};

export const getElementDataset = <T extends Record<string, unknown>>(
    element: HTMLElement,
    parser: Record<string, (val: string) => unknown>
): T => {
    const result: Record<string, unknown> = {};
    Object.entries(element.dataset).forEach(([key, value]) => {
        if (parser[key] && value !== undefined) {
            result[key] = parser[key](value);
        }
    });
    return result as T;
};

export const createDOMElement = <T extends HTMLElement>(
    tagName: keyof HTMLElementTagNameMap,
    attributes: Partial<Record<keyof T, string | boolean | object>> = {},
    children?: HTMLElement | HTMLElement[]
): T => {
    const element = document.createElement(tagName) as T;
    
    Object.entries(attributes).forEach(([key, value]) => {
        if (key === 'dataset' && typeof value === 'object') {
            setElementDataset(element, value as Record<string, unknown>);
        } else {
            (element as any)[key] = typeof value === 'boolean' ? value : String(value);
        }
    });

    if (children) {
        const nodes = Array.isArray(children) ? children : [children];
        nodes.forEach(node => element.appendChild(node));
    }

    return element;
};

export const isBoolean = (value: unknown): value is boolean => {
    return typeof value === 'boolean';
};

export const isPlainObject = (value: unknown): value is Record<string, unknown> => {
    return Object.prototype.toString.call(value) === '[object Object]';
};