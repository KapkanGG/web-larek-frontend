import type { IStoreItem } from './StoreItem';

export interface IUIComponent<T> {
    updateContent(data?: T): HTMLElement;
}

export interface IDialogContent {
    content: HTMLElement;
}

export interface IDialog {
    content: HTMLElement;
    show(): void;
    hide(): void;
    render(data: IDialogContent): HTMLElement;
}

export interface IAppPage {
    itemCount: number;
    productElements: HTMLElement[];
    isLocked: boolean;
}

export interface IProductCardActions {
    handleClick: (event: MouseEvent) => void;
}

export type IProductCard = Pick<IStoreItem, 'id' | 'title' | 'price'> &
    Partial<Pick<IStoreItem, 'imageUrl' | 'category' | 'description'>> & {
        buttonText?: string;
    };

export interface ICartItemActions {
    handleClick: (event: MouseEvent) => void;
}

export interface IFormState {
    isValid: boolean;
    errorMessages: string[];
}

export interface IConfirmationView {
    totalAmount: number;
}

export interface IConfirmationActions {
    handleClose: () => void;
}