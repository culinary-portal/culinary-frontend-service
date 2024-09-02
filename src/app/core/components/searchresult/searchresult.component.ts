import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';

@Component({
  selector: 'recipe-searchresult',
  templateUrl: './searchresult.component.html',
  styles: []
})
export class SearchresultComponent implements OnInit {
  isLoading = false;
  error!: string;
  searchKeyword!: string;

  constructor(
    private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.getResults();
  }

  getResults() {
    this.isLoading = true;

  }


}
