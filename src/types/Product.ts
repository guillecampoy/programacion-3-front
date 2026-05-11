export const categories = ["Milanesas", "Papas Fritas", "Minutas"] as const;

export type Category = (typeof categories)[number];

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: Category;
  destacado: boolean;
}
