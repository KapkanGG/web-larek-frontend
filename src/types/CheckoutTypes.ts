type PaymentType = 'cash' | 'card';

export interface ICheckoutDetails {
	paymentMethod: PaymentType | null;
	deliveryAddress: string;
}

export interface IContactInfo {
	email: string;
	phone: string;
}

export interface IPurchase extends ICheckoutDetails, IContactInfo {
	total: number;
	items: string[];
}

export interface IPurchaseResult {
	id: string;
	total: number;
}

export type ValidationErrors = Partial<Record<keyof IPurchase, string>>;
