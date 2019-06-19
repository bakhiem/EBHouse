import { TestBed } from '@angular/core/testing';

import { TenantServiceService } from './tenant-service.service';

describe('TenantServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TenantServiceService = TestBed.get(TenantServiceService);
    expect(service).toBeTruthy();
  });
});
