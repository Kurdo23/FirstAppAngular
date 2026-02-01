import {ChangeDetectorRef, Component, inject} from '@angular/core';

import {HousingLocation } from '../housing-location/housing-location';
import {HousingLocationInfo} from '../housinglocation';
import {HousingService} from '../housing.service';

@Component({
  selector: 'app-home',
  imports: [HousingLocation],
  template: `
    <section>
      <div> <!-- J'ai changé mon form en div car l'event reload la page, je ne sais pas  -->
        <input type="text" placeholder="Filter by city" #filter/> <!-- Référence locale pour accéder à la valeur de l'entrée, en gros on récupère ce que l'utilisateur tape via #filter -->
        <button class="primary" type="button" (click)="filterResults(filter.value)">Search</button> <!-- Appel de la méthode filterResults avec la valeur de l'entrée donc #filter.value -->
      </div>
    </section>
    <section class="results">
      @for (housingLocation of filteredLocationList; track $index) {
        <app-housing-location [housingLocation]="housingLocation" />
      }
    </section>
  `,
  styleUrls: ['./home.css'],
})

export class Home {
  housingLocationList: HousingLocationInfo[] = [];
  filteredLocationList: HousingLocationInfo[] = [];
  housingService: HousingService = inject(HousingService);
  changeDetectorRef = inject(ChangeDetectorRef);
  
  constructor() {
    this.housingService.getAllHousingLocations().then((housingLocationList: HousingLocationInfo[]) => {
      this.housingLocationList = housingLocationList;
      this.filteredLocationList = housingLocationList;
      this.changeDetectorRef.markForCheck();
    });    
  }
  
  filterResults(text: string) {
    if (!text) {
      this.filteredLocationList = this.housingLocationList;
      return;
    }
    this.filteredLocationList = this.housingLocationList.filter((housingLocation) =>
      housingLocation?.city.toLowerCase().includes(text.toLowerCase()),
    );
  }
}
