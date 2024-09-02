import {Recipe} from "../../recipe/model/recipe";
import {Review} from "../../review/model/review";
import {BaseRecipe} from "../../recipe/model/base-recipe";

export interface GeneralRecipeDetails {
  generalRecipeId: number;
  name: string;
  photoUrl: string;
  mealType: string;
  description: string;
  baseRecipe: BaseRecipe;
  reviews: Review[];
  recipes: Recipe[];
  steps: string;
  rating: number;
  calories: number;
  protein: number;
  fat: number;
  carbohydrate: number;
}
