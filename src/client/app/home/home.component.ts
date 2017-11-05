import { Component, OnInit } from '@angular/core';
import { SchedulesStoreService } from './schedule.service';

/**
 * This class represents the lazy loaded HomeComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.css'],
})
export class HomeComponent implements OnInit {

  /**
   * Creates an instance of the HomeComponent with the injected
   * SchedulesStoreService.
   *
   * @param {SchedulesStoreService} schedulesStoreService - injected
   */
  constructor(public schedulesStoreService: SchedulesStoreService) {
  }

  /**
   * Get the names OnInit
   */
  ngOnInit() {
  }

}
