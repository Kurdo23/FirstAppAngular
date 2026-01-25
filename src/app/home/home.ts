import { Component } from '@angular/core';

import {HousingLocation, HousingLocationInfo} from '../housing-location/housing-location';


@Component({
  selector: 'app-home',
  imports: [HousingLocation],
  template: `
    <section>
      <form>
        <input type="text" placeholder="Filter by city" />
        <button class="primary" type="button">Search</button>
      </form>
    </section>
    <section class="results">
      <app-housing-location [housingLocation]="housingLocation" />
    </section>
  `,
  styleUrls: ['./home.css'],
})
export class Home {
  readonly baseUrl = 'https://angular.dev/assets/images/tutorials/common'; // this link doesn't work anymore so I replace by me ^^

  housingLocation: HousingLocationInfo = {
    id: 9999,
    name: 'Test Home',
    city: 'Test City',
    state: 'ST',
    photo: '/exemple-house.png',
    availableUnits: 99,
    wifi: true,
    laundry: false,
  };
}
