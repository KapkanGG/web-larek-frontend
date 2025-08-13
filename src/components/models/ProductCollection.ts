import { DataEntity } from '../base/DataEntity';
import { IEventSystem } from '../base/EventSystem';

interface IStoreItem {
	id: string;
	description: string;
	imageUrl: string;
	title: string;
	category: string;
	price: number | null;
}

interface IProductCollection {
	updateProductList(items: IStoreItem[]): void;
	findProductById(id: string): IStoreItem | undefined;
	setProductPreview(item: IStoreItem): void;
	getPreviewedProduct(): IStoreItem | null;
	setLoadingStatus(status: boolean): void;
	getAllProducts(): IStoreItem[];
	loadingStatus: boolean;
}

export class ProductCollection
	extends DataEntity<IProductCollection>
	implements IProductCollection
{
	private productList: IStoreItem[] = [];
	private previewItemId: string | null = null;
	private isLoadingState = false;

	constructor(
		initialData: Partial<IProductCollection>,
		eventSystem: IEventSystem
	) {
		super(initialData, eventSystem);
	}

	updateProductList(items: IStoreItem[]): void {
		this.productList = items;
		this.notifyChanges('productList:update', this.productList);
	}

	findProductById(id: string): IStoreItem | undefined {
		return this.productList.find((item) => item.id === id);
	}

	setProductPreview(item: IStoreItem): void {
		this.previewItemId = item.id;
		this.notifyChanges('productPreview:update', item);
	}

	getPreviewedProduct(): IStoreItem | null {
		return this.previewItemId
			? this.findProductById(this.previewItemId) ?? null
			: null;
	}

	setLoadingStatus(status: boolean): void {
		this.isLoadingState = status;
	}

	getAllProducts(): IStoreItem[] {
		return [...this.productList];
	}

	get loadingStatus(): boolean {
		return this.isLoadingState;
	}
}

export type { IStoreItem, IProductCollection };
