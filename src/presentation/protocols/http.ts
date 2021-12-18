export interface HttpRequest {
  body?: any;
  headers?: any;
}

export interface HttpResponse {
  statusCode: number;
  body: any;
}
