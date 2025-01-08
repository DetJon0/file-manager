import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';

@Injectable()
export class BaseApiService {
  protected readonly http = inject(HttpClient);
  protected readonly baseUrl = environment.baseUrl;

  constructor() {}
}
