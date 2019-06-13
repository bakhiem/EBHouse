import { TestBed } from '@angular/core/testing';

import { EquipmentServiceService } from './equipment-service.service';

describe('EquipmentServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EquipmentServiceService = TestBed.get(EquipmentServiceService);
    expect(service).toBeTruthy();
  });
});
