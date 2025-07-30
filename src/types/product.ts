export type CategoryType =
	| 'софт-скил'
	| 'другое'
	| 'дополнительное'
	| 'кнопка'
	| 'хард-скил';

export interface IProduct {
	id: string;
	description: string;
	image: string;
	title: string;
	category: CategoryType;
	price: number | null;
}

export interface IProductList {
	total: number;
	items: IProduct[];
}
export interface ICatalogModel {
	setItems(items: IProduct[]): void;
	getProduct(id: string): IProduct | undefined;
	setPreview(product: IProduct): void;
	getPreview(): IProduct | null;
	isLoading(): boolean;
}
