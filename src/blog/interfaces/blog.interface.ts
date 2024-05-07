import { CategoryType } from "src/enums/category-type"

export interface Blog {
    id: number
    name: string,
    category: CategoryType | string
}