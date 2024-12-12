import {Contains} from "../../contains/model/contains";
import {GeneralRecipeDetails} from "../../generalrecipe/model/general-recipe-details";

export interface Recipe {
  generalRecipe: GeneralRecipeDetails;
  recipeId: number;
  name: string;
  description: string;
  dietType: string;
}
