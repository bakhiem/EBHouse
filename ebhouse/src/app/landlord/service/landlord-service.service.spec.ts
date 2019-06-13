import { TestBed } from '@angular/core/testing';

import { LandlordService } from './landlord-service.service';

describe('LandlordServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LandlordService = TestBed.get(LandlordService);
    expect(service).toBeTruthy();
  });
});
