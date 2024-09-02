import {Ingredient} from "../../ingredient/ingredient";

export interface SpecificDetails {
  specificId: number;
  userId: number;
  ingredient: Ingredient
  likes: boolean;
}
