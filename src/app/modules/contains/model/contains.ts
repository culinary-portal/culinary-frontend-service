import {Ingredient} from "../../ingredient/ingredient";

export interface Contains {
  amount: number;
  measure: string;
  recipeId: number;
  ingredient: Ingredient;
}
