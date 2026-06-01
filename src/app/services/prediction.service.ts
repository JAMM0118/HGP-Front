import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PredictionRequest {
  area_construida: number;
  habitaciones: number;
  banos: number;
  tipo_propiedad: string;
  ciudad: string;
}

export interface PredictionResponse {
  fecha: string;
  area_construida: number;
  habitaciones: number;
  banos: number;
  tipo_propiedad: string;
  ciudad: string;
  precio_estimado: number;
}

@Injectable({
  providedIn: 'root'
})
export class PredictionService {
  // URL del endpoint de predicción - ajusta según tu backend
  private apiUrl = 'http://localhost:5000/api/prediction/predict';

  constructor(private http: HttpClient) {}

  /**
   * Obtener predicción de precio
   *
   * Backend URL: POST /api/predict
   * Body: { area_construida, habitaciones, banos, tipo_propiedad, ciudad }
   *
   * Response: {
   *   fecha: string,
   *   area_construida: number,
   *   habitaciones: number,
   *   banos: number,
   *   tipo_propiedad: string,
   *   ciudad: string,
   *   precio_estimado: number
   * }
   */
  getPrediction(request: PredictionRequest): Observable<PredictionResponse> {
    return this.http.post<PredictionResponse>(this.apiUrl, request);
  }
}
