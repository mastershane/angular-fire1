/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SecretGoalsService } from './secret-goals.service';

describe('SecretGoalsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SecretGoalsService]
    });
  });

  it('should ...', inject([SecretGoalsService], (service: SecretGoalsService) => {
    expect(service).toBeTruthy();
  }));
});
