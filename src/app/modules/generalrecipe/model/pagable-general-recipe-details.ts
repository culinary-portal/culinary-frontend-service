import {GeneralRecipeDetails} from "./general-recipe-details";

export interface PagableGeneralRecipeDetails {
  content: GeneralRecipeDetails[];
  totalElements: number;
  numberOfElements: number;
  size: number;
}
