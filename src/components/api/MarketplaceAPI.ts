import { Api as BaseApi, ApiListResponse } from '../base/api';

interface IProduct {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
}

interface IOrder {
	payment: string;
	email: string;
	phone: string;
	address: string;
	total: number;
	items: string[];
}

interface IOrderResult {
	id: string;
	total: number;
}

interface MediaConfiguration {
	contentDeliveryUrl: string;
}

export class StoreApiService extends BaseApi {
	private readonly mediaConfig: MediaConfiguration;

	constructor(
		mediaConfig: string,
		apiEndpoint: string,
		requestSettings?: RequestInit
	) {
		super(apiEndpoint, requestSettings);
		this.mediaConfig = { contentDeliveryUrl: mediaConfig };
	}

	async fetchAllProducts(): Promise<IProduct[]> {
		const response = await this.get('/product');
		const data = response as ApiListResponse<IProduct>;
		return data.items.map((product) => this.enrichWithMediaUrl(product));
	}

	async getProductDetails(productId: string): Promise<IProduct> {
		const product = await this.get(`/product/${productId}`);
		return this.enrichWithMediaUrl(product as IProduct);
	}

	async submitOrder(orderDetails: IOrder): Promise<IOrderResult> {
		const response = await this.post('/order', orderDetails);
		return response as IOrderResult;
	}

	private enrichWithMediaUrl(product: IProduct): IProduct {
		return {
			...product,
			image: `${this.mediaConfig.contentDeliveryUrl}${product.image}`,
		};
	}
}

export type { IProduct, IOrder, IOrderResult };
