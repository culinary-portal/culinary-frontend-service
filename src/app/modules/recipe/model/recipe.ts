import {Contains} from "../../contains/model/contains";

export interface Recipe {
  generalRecipe: GeneralRecipeDetails;
  recipeId: number;
  name: string;
  description: string;
  dietType: string;
}
