import {Component, input} from '@angular/core';

@Component({
  selector: 'app-housing-location',
  template: `
    <section class="listing">
      <img
          class="listing-photo"
          [src]="housingLocation().photo"
          alt="Exterior photo of {{ housingLocation().name }}"
          crossorigin
      />
      <h2 class="listing-heading">{{ housingLocation().name }}</h2>
      <p class="listing-location">{{ housingLocation().city }}, {{ housingLocation().state }}</p>
    </section>
  `,
  styleUrls: ['./housing-location.css'],
})
export class HousingLocation {
  housingLocation = input.required<HousingLocationInfo>();
}

export interface HousingLocationInfo {
  id: number;
  name: string;
  city: string;
  state: string;
  photo: string;
  availableUnits: number;
  wifi: boolean;
  laundry: boolean;
}
