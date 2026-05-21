export type Category = string;

export interface ICategoria {
  id: number;
  name: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  longDescription: string;
  price: number;
  image: string;
  category: Category;
  destacado: boolean;
}
