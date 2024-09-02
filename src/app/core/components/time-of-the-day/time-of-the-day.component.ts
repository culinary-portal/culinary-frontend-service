import {Component, OnInit} from '@angular/core';
import {API_CONFIG} from "../../../config/api-conifg";

@Component({
  selector: 'app-time-of-the-day',
  templateUrl: './time-of-the-day.component.html',
  styles: []
})
export class TimeOfTheDayComponent implements OnInit {

  skeletons: number[] = [...new Array(6)];
  error!: string;
  isLoading = false;
  mealTypes = [
    {title: "Breakfast", photoUrl: API_CONFIG.breakfastUrl},
    {title: "Lunch", photoUrl: API_CONFIG.lunchUrl},
    {title: "Dinner", photoUrl: API_CONFIG.dinnerUrl},
    {title: "Dessert", photoUrl: API_CONFIG.dessertUrl},
    {title: "Supper", photoUrl: API_CONFIG.supperUrl}
  ];

  constructor() {
  }

  ngOnInit(): void {
  }
}
