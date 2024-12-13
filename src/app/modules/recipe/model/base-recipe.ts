import {Contains} from "../../contains/model/contains";

export interface BaseRecipe {
  recipeId: number;
  name: string;
  description: string;
  dietType: string;
  generalRecipeId: number;
  contains: Contains[];
}


