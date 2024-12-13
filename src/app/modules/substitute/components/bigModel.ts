import {Ingredient} from "../../ingredient/ingredient";
import {Substitute} from "../substitute";

export interface BigModel {
  substituteId: number;
  ingredient1: Ingredient;
  ingredient2: Ingredient;
  proportionI1I2: number;
}
