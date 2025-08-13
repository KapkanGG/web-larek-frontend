export type ProductCategory =
    | 'software-skill'
    | 'other'
    | 'additional'
    | 'button'
    | 'hard-skill';

export interface IStoreItem {
    id: string;
    description: string;
    imageUrl: string;
    title: string;
    category: ProductCategory;
    price: number | null;
}

export interface IProductCatalog {
    totalItems: number;
    products: IStoreItem[];
}

export interface ICatalogManager {
    updateProductList(items: IStoreItem[]): void;
    findProductById(id: string): IStoreItem | undefined;
    setProductPreview(item: IStoreItem): void;
    getPreviewedProduct(): IStoreItem | null;
    isLoading: boolean;
}