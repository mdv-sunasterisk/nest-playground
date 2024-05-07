import { CategoryType } from "src/enums/category-type"

export interface Blog {
    id: number
    title: string,
    category: CategoryType | string
}