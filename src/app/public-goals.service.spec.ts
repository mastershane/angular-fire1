/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PublicGoalsService } from './public-goals.service';

describe('PublicGoalsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PublicGoalsService]
    });
  });

  it('should ...', inject([PublicGoalsService], (service: PublicGoalsService) => {
    expect(service).toBeTruthy();
  }));
});
