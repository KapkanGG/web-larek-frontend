import type { IProduct } from './product';
import type { IOrder, IOrderResult } from './order';

export interface IWebLarekAPI {
	getProductList(): Promise<IProduct[]>;
	getProduct(id: string): Promise<IProduct>;
	createOrder(order: IOrder): Promise<IOrderResult>;
}
