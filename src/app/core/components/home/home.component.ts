import {Component, OnInit} from '@angular/core';
import {API_CONFIG} from "../../../config/api-conifg";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: []
})
export class HomeComponent implements OnInit {
  skeletons: number[] = [...new Array(6)];
  error!: string;
  isLoading = false;
  constructor() {
  }

  ngOnInit(): void {
  }

}
