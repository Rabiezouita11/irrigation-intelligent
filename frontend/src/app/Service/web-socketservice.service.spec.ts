import { TestBed } from '@angular/core/testing';

import { WebSocketserviceService } from './web-socketservice.service';

describe('WebSocketserviceService', () => {
  let service: WebSocketserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebSocketserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
