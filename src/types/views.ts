import type { IProduct } from './product';

export interface IComponent<T> {
	render(data?: T): HTMLElement;
}

export interface IModalData {
	content: HTMLElement;
}

export interface IModal {
	content: HTMLElement;
	open(): void;
	close(): void;
	render(data: IModalData): HTMLElement;
}

export interface IPage {
	counter: number;
	catalog: HTMLElement[];
	locked: boolean;
}

export interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

export type ICard = Pick<IProduct, 'id' | 'title' | 'price'> &
	Partial<Pick<IProduct, 'image' | 'category' | 'description'>> & {
		button?: string;
	};

export interface IBasketCardActions {
	onClick: (event: MouseEvent) => void;
}

export interface IForm {
	valid: boolean;
	errors: string[];
}

export interface ISuccess {
	total: number;
}

export interface ISuccessActions {
	onClick: () => void;
}
