import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PropertyFilters, PaginationParams, PropertyResponse, Property } from '../dashboard/interfaces/models.interface';


@Injectable({
  providedIn: 'root'
})
export class PropertyService {
  // URL del backend - ajusta según tu configuración
  private apiUrl = 'http://localhost:5000/api/csv';

  constructor(private http: HttpClient) {}

  /**
   * Obtener todas las propiedades con filtros y paginación
   *
   * Backend URL: GET /api/properties
   * Query Params: page, limit, sortBy, sortOrder, search, city, type, minPrice, maxPrice, minArea, maxArea
   */
  getProperties(
    filters: PropertyFilters = {},
    pagination: PaginationParams = { page: 1, pageSize: 15 }
  ): Observable<PropertyResponse> {
    let params = new HttpParams()
      .set('page', pagination.page.toString())
      .set('limit', pagination.pageSize.toString());

    if (pagination.sortBy) {
      params = params.set('sortBy', pagination.sortBy);
    }
    if (pagination.sortOrder) {
      params = params.set('sortOrder', pagination.sortOrder);
    }
    if (filters.search) {
      params = params.set('search', filters.search);
    }
    if (filters.city) {
      params = params.set('city', filters.city);
    }
    if (filters.type) {
      params = params.set('type', filters.type);
    }
    if (filters.minPrice !== undefined) {
      params = params.set('minPrice', filters.minPrice.toString());
    }
    if (filters.maxPrice !== undefined) {
      params = params.set('maxPrice', filters.maxPrice.toString());
    }
    if (filters.minArea !== undefined) {
      params = params.set('minArea', filters.minArea.toString());
    }
    if (filters.maxArea !== undefined) {
      params = params.set('maxArea', filters.maxArea.toString());
    }
    if (filters.bedrooms !== undefined) {
      params = params.set('bedrooms', filters.bedrooms.toString());
    }
    if (filters.bathrooms !== undefined) {
      params = params.set('bathrooms', filters.bathrooms.toString());
    }

    return this.http.get<PropertyResponse>(`${this.apiUrl}/properties`, { params });
  }

  /**
   * Obtener una propiedad por ID
   *
   * Backend URL: GET /api/properties/:id
   */
  getPropertyById(id: string): Observable<Property> {
    return this.http.get<Property>(`${this.apiUrl}/properties/${id}`);
  }

  /**
   * Crear nueva propiedad
   *
   * Backend URL: POST /api/properties
   * Body: Property (sin id)
   */
  createProperty(property: Omit<Property, 'id'>): Observable<Property> {
    return this.http.post<Property>(`${this.apiUrl}/properties`, property);
  }

  /**
   * Actualizar propiedad existente
   *
   * Backend URL: PUT /api/properties/:id
   * Body: Property parcial
   */
  updateProperty(id: string, updates: Partial<Property>): Observable<Property> {
    return this.http.put<Property>(`${this.apiUrl}/properties/${id}`, updates);
  }

  /**
   * Eliminar propiedad
   *
   * Backend URL: DELETE /api/properties/:id
   */
  deleteProperty(id: string): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.apiUrl}/properties/${id}`);
  }

  /**
   * Importar propiedades desde CSV
   *
   * Backend URL: POST /api/properties/import
   * Body: FormData con archivo CSV
   *
   * El backend procesa el archivo (145k+ registros) de forma optimizada
   * y retorna la cantidad de registros importados y errores si los hay.
   */
  importFromCSV(file: File): Observable<{ imported: number; errors: string[] }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ imported: number; errors: string[] }>(`${this.apiUrl}/upload`, formData);
  }

  /**
   * Exportar propiedades a CSV
   *
   * Backend URL: GET /api/properties/export
   * Query Params: filtros opcionales
   *
   * El backend genera el CSV con los filtros aplicados y lo retorna como Blob.
   */
  exportToCSV(filters: PropertyFilters = {}): Observable<Blob> {
    let params = new HttpParams();

    if (filters.search) {
      params = params.set('search', filters.search);
    }
    if (filters.city) {
      params = params.set('city', filters.city);
    }
    if (filters.type) {
      params = params.set('type', filters.type);
    }
    if (filters.minPrice !== undefined) {
      params = params.set('minPrice', filters.minPrice.toString());
    }
    if (filters.maxPrice !== undefined) {
      params = params.set('maxPrice', filters.maxPrice.toString());
    }
    if (filters.minArea !== undefined) {
      params = params.set('minArea', filters.minArea.toString());
    }
    if (filters.maxArea !== undefined) {
      params = params.set('maxArea', filters.maxArea.toString());
    }

    return this.http.get(`${this.apiUrl}/export`, {
      params,
      responseType: 'blob'
    });
  }

  /**
   * Obtener conteo de propiedades por tipo
   *
   * Backend URL: GET /api/properties/count-by-type
   *
   * Response: {
   *   total_processed: number,
   *   message: string,
   *   counts: {
   *     apartamento: number,
   *     casa: number
   *   }
   * }
   */
  getPropertyCountByType(): Observable<{
    total_processed: number;
    message: string;
    counts: {
      apartamento: number;
      casa: number;
    };
  }> {
    return this.http.get<{
      total_processed: number;
      message: string;
      counts: {
        apartamento: number;
        casa: number;
      };
    }>(`${this.apiUrl}/classify-properties`);
  }

  getExecutiveSummaryStats(): Observable<{
    total_propiedades_analizadas: number;
    valor_promedio_de_propiedad: number;
    precio_promedio_por_m2: number;
  }> {
    return this.http.get<{
      total_propiedades_analizadas: number;
      valor_promedio_de_propiedad: number;
      precio_promedio_por_m2: number;
    }>(`${this.apiUrl}/property-analysis-stats`);

  }
  /**
   * Obtener panorama del mercado regional
   *
   * Backend URL: GET /api/properties/regional-overview
   *
   * Response: {
   *   total_ciudades_analizadas: number,
   *   top_ciudades: [
   *     {
   *       ciudad: string,
   *       cantidad_propiedades: number,
   *       precio_promedio_propiedades: number,
   *       crecimiento_porcentual: number,
   *       primer_anio: number,
   *       ultimo_anio: number,
   *       propiedades_primer_anio: number,
   *       propiedades_ultimo_anio: number
   *     }
   *   ]
   * }
   */
  getRegionalOverview(): Observable<{
    total_ciudades_analizadas: number;
    top_ciudades: Array<{
      ciudad: string;
      cantidad_propiedades: number;
      precio_promedio_propiedades: number;
      crecimiento_porcentual: number;
      primer_anio: number;
      ultimo_anio: number;
      propiedades_primer_anio: number;
      propiedades_ultimo_anio: number;
    }>;
  }> {
    return this.http.get<{
      total_ciudades_analizadas: number;
      top_ciudades: Array<{
        ciudad: string;
        cantidad_propiedades: number;
        precio_promedio_propiedades: number;
        crecimiento_porcentual: number;
        primer_anio: number;
        ultimo_anio: number;
        propiedades_primer_anio: number;
        propiedades_ultimo_anio: number;
      }>;
    }>(`${this.apiUrl}/top-cities-stats`);
  }

  /**
   * Obtener mejores barrios por rendimiento
   *
   * Backend URL: GET /api/properties/top-neighborhoods
   *
   * Response: {
   *   total_barrios_analizados: number,
   *   top_barrios: [
   *     {
   *       barrio: string,
   *       ciudad: string,
   *       crecimiento_porcentual: number,
   *       precio_promedio: number,
   *       primer_anio: number,
   *       ultimo_anio: number,
   *       precio_promedio_primer_anio: number,
   *       precio_promedio_ultimo_anio: number
   *     }
   *   ]
   * }
   */
  getTopNeighborhoods(): Observable<{
    total_barrios_analizados: number;
    top_barrios: Array<{
      barrio: string;
      ciudad: string;
      crecimiento_porcentual: number;
      precio_promedio: number;
      primer_anio: number;
      ultimo_anio: number;
      precio_promedio_primer_anio: number;
      precio_promedio_ultimo_anio: number;
    }>;
  }> {
    return this.http.get<{
      total_barrios_analizados: number;
      top_barrios: Array<{
        barrio: string;
        ciudad: string;
        crecimiento_porcentual: number;
        precio_promedio: number;
        primer_anio: number;
        ultimo_anio: number;
        precio_promedio_primer_anio: number;
        precio_promedio_ultimo_anio: number;
      }>;
    }>(`${this.apiUrl}/top-barrio-growth-stats`);
  }
  /**
   * Obtener tendencias del mercado por año
   *
   * Backend URL: GET /api/properties/market-trends
   *
   * Response: {
   *   primer_anio: number,
   *   ultimo_anio: number,
   *   tendencia_mercado: [
   *     {
   *       anio: number,
   *       precio_promedio_anual: number,
   *       enero: number | null,
   *       diciembre: number | null,
   *       cantidad_propiedades: number
   *     }
   *   ]
   * }
   */
  getMarketTrends(): Observable<{
    primer_anio: number;
    ultimo_anio: number;
    tendencia_mercado: Array<{
      anio: number;
      precio_promedio_anual: number;
      enero: number | null;
      diciembre: number | null;
      cantidad_propiedades: number;
    }>;
  }> {
    return this.http.get<{
      primer_anio: number;
      ultimo_anio: number;
      tendencia_mercado: Array<{
        anio: number;
        precio_promedio_anual: number;
        enero: number | null;
        diciembre: number | null;
        cantidad_propiedades: number;
      }>;
    }>(`${this.apiUrl}/market-trend-stats`);
  }

  /**
   * Obtener distribución de precios por rangos
   *
   * Backend URL: GET /api/properties/price-distribution
   *
   * Response: {
   *   total_propiedades_con_precio: number,
   *   distribucion_precios: {
   *     "0-200_millones": number,
   *     "200-400_millones": number,
   *     "400-600_millones": number,
   *     "600-800_millones": number,
   *     "800_millones-1_billon": number,
   *     "1_billon_mas": number
   *   }
   * }
   */
  getPriceDistribution(): Observable<{
    total_propiedades_con_precio: number;
    distribucion_precios: {
      '0-200_millones': number;
      '200-400_millones': number;
      '400-600_millones': number;
      '600-800_millones': number;
      '800_millones-1_billon': number;
      '1_billon_mas': number;
    };
  }> {
    return this.http.get<{
      total_propiedades_con_precio: number;
      distribucion_precios: {
        '0-200_millones': number;
        '200-400_millones': number;
        '400-600_millones': number;
        '600-800_millones': number;
        '800_millones-1_billon': number;
        '1_billon_mas': number;
      };
    }>(`${this.apiUrl}/price-distribution-stats`);
  }
  /**
   * Obtener comparación de área construida (menos de 100 m² vs más de 100 m²)
   *
   * Backend URL: GET /api/properties/area-comparison
   *
   * Response: {
   *   comparacion_area: {
   *     mas_de_100: {
   *       cantidad: number,
   *       total_precio: number,
   *       por_tipo_propiedad: [
   *         {
   *           tipo_propiedad: string,
   *           cantidad: number,
   *           total_precio: number
   *         }
   *       ]
   *     },
   *     menos_de_100: {
   *       cantidad: number,
   *       total_precio: number,
   *       por_tipo_propiedad: [
   *         {
   *           tipo_propiedad: string,
   *           cantidad: number,
   *           total_precio: number
   *         }
   *       ]
   *     }
   *   }
   * }
   */
  getAreaComparison(): Observable<{
    comparacion_area: {
      mas_de_100: {
        cantidad: number;
        total_precio: number;
        por_tipo_propiedad: Array<{
          tipo_propiedad: string;
          cantidad: number;
          total_precio: number;
        }>;
      };
      menos_de_100: {
        cantidad: number;
        total_precio: number;
        por_tipo_propiedad: Array<{
          tipo_propiedad: string;
          cantidad: number;
          total_precio: number;
        }>;
      };
    };
  }> {
    return this.http.get<{
      comparacion_area: {
        mas_de_100: {
          cantidad: number;
          total_precio: number;
          por_tipo_propiedad: Array<{
            tipo_propiedad: string;
            cantidad: number;
            total_precio: number;
          }>;
        };
        menos_de_100: {
          cantidad: number;
          total_precio: number;
          por_tipo_propiedad: Array<{
            tipo_propiedad: string;
            cantidad: number;
            total_precio: number;
          }>;
        };
      };
    }>(`${this.apiUrl}/area-comparison-stats`);
  }
  /**
   * Obtener comparación de precio por número de habitaciones
   *
   * Backend URL: GET /api/properties/price-by-bedrooms
   *
   * Response: {
   *   comparacion_precio_habitaciones: [
   *     {
   *       habitaciones: number,
   *       cantidad_propiedades: number,
   *       precio_promedio: number,
   *       total_precio: number
   *     }
   *   ]
   * }
   */
  getPriceByBedrooms(): Observable<{
    comparacion_precio_habitaciones: Array<{
      habitaciones: number;
      cantidad_propiedades: number;
      precio_promedio: number;
      total_precio: number;
    }>;
  }> {
    return this.http.get<{
      comparacion_precio_habitaciones: Array<{
        habitaciones: number;
        cantidad_propiedades: number;
        precio_promedio: number;
        total_precio: number;
      }>;
    }>(`${this.apiUrl}/price-vs-bedrooms-stats`);
  }
  /**
   * Obtener comparación de precio por rangos de área construida
   *
   * Backend URL: GET /api/properties/price-by-area
   *
   * Response: {
   *   comparacion_precio_area: [
   *     {
   *       rango_area: string,
   *       cantidad_propiedades: number,
   *       precio_promedio: number,
   *       area_promedio: number,
   *       precio_promedio_por_m2: number
   *     }
   *   ]
   * }
   */
  getPriceByArea(): Observable<{
    comparacion_precio_area: Array<{
      rango_area: string;
      cantidad_propiedades: number;
      precio_promedio: number;
      area_promedio: number;
      precio_promedio_por_m2: number;
    }>;
  }> {
    return this.http.get<{
      comparacion_precio_area: Array<{
        rango_area: string;
        cantidad_propiedades: number;
        precio_promedio: number;
        area_promedio: number;
        precio_promedio_por_m2: number;
      }>;
    }>(`${this.apiUrl}/price-vs-area-stats`);
  }
  /**
   * Obtener datos para matriz de correlación
   *
   * Backend URL: GET /api/properties/correlation-data
   *
   * Response: {
   *   total_registros: number,
   *   columnas: string[],
   *   datos: Array<{
   *     precio: number,
   *     habitaciones: number,
   *     banos: number,
   *     area_construida: number
   *   }>
   * }
   */
  getCorrelationData(): Observable<{
    total_registros: number;
    columnas: string[];
    datos: Array<{
      precio: number;
      habitaciones: number;
      banos: number;
      area_construida: number;
    }>;
  }> {
    return this.http.get<{
      total_registros: number;
      columnas: string[];
      datos: Array<{
        precio: number;
        habitaciones: number;
        banos: number;
        area_construida: number;
      }>;
    }>(`${this.apiUrl}/correlation-matrix-data`);
  }

  /**
   * Obtener insights del dataset generados por análisis de datos
   *
   * Backend URL: GET /api/properties/dataset-insights
   *
   * Response: {
   *   total_ciudades_analizadas: number,
   *   insights: {
   *     zona_crecimiento_fuerte: {
   *       ciudad: string,
   *       cantidad_propiedades: number,
   *       precio_promedio: number,
   *       precio_promedio_por_m2: number,
   *       volatilidad: number,
   *       crecimiento_porcentual: number,
   *       primer_anio: number,
   *       ultimo_anio: number
   *     },
   *     propiedades_subvaloradas: Array<{
   *       ciudad: string,
   *       cantidad_propiedades: number,
   *       precio_promedio: number,
   *       precio_promedio_por_m2: number,
   *       volatilidad: number,
   *       crecimiento_porcentual: number,
   *       primer_anio: number,
   *       ultimo_anio: number
   *     }>,
   *     volatilidad_precios: {
   *       ciudad: string,
   *       cantidad_propiedades: number,
   *       precio_promedio: number,
   *       precio_promedio_por_m2: number,
   *       volatilidad: number,
   *       crecimiento_porcentual: number,
   *       primer_anio: number,
   *       ultimo_anio: number
   *     },
   *     mercado_emergente: {
   *       ciudad: string,
   *       cantidad_propiedades: number,
   *       precio_promedio: number,
   *       precio_promedio_por_m2: number,
   *       volatilidad: number,
   *       crecimiento_porcentual: number,
   *       primer_anio: number,
   *       ultimo_anio: number
   *     },
   *     recomendaciones_inversion: string[],
   *     tendencias_generales: string[]
   *   },
   *   detalle_por_ciudad: Array<{
   *     ciudad: string,
   *     cantidad_propiedades: number,
   *     precio_promedio: number,
   *     precio_promedio_por_m2: number,
   *     volatilidad: number,
   *     crecimiento_porcentual: number,
   *     primer_anio: number,
   *     ultimo_anio: number
   *   }>
   * }
   */
  getDatasetInsights(): Observable<{
    total_ciudades_analizadas: number;
    insights: {
      zona_crecimiento_fuerte: {
        ciudad: string;
        cantidad_propiedades: number;
        precio_promedio: number;
        precio_promedio_por_m2: number;
        volatilidad: number;
        crecimiento_porcentual: number;
        primer_anio: number;
        ultimo_anio: number;
      };
      propiedades_subvaloradas: Array<{
        ciudad: string;
        cantidad_propiedades: number;
        precio_promedio: number;
        precio_promedio_por_m2: number;
        volatilidad: number;
        crecimiento_porcentual: number;
        primer_anio: number;
        ultimo_anio: number;
      }>;
      volatilidad_precios: {
        ciudad: string;
        cantidad_propiedades: number;
        precio_promedio: number;
        precio_promedio_por_m2: number;
        volatilidad: number;
        crecimiento_porcentual: number;
        primer_anio: number;
        ultimo_anio: number;
      };
      mercado_emergente: {
        ciudad: string;
        cantidad_propiedades: number;
        precio_promedio: number;
        precio_promedio_por_m2: number;
        volatilidad: number;
        crecimiento_porcentual: number;
        primer_anio: number;
        ultimo_anio: number;
      };
      recomendaciones_inversion: string[];
      tendencias_generales: string[];
    };
    detalle_por_ciudad: Array<{
      ciudad: string;
      cantidad_propiedades: number;
      precio_promedio: number;
      precio_promedio_por_m2: number;
      volatilidad: number;
      crecimiento_porcentual: number;
      primer_anio: number;
      ultimo_anio: number;
    }>;
  }> {
    return this.http.get<{
      total_ciudades_analizadas: number;
      insights: {
        zona_crecimiento_fuerte: {
          ciudad: string;
          cantidad_propiedades: number;
          precio_promedio: number;
          precio_promedio_por_m2: number;
          volatilidad: number;
          crecimiento_porcentual: number;
          primer_anio: number;
          ultimo_anio: number;
        };
        propiedades_subvaloradas: Array<{
          ciudad: string;
          cantidad_propiedades: number;
          precio_promedio: number;
          precio_promedio_por_m2: number;
          volatilidad: number;
          crecimiento_porcentual: number;
          primer_anio: number;
          ultimo_anio: number;
        }>;
        volatilidad_precios: {
          ciudad: string;
          cantidad_propiedades: number;
          precio_promedio: number;
          precio_promedio_por_m2: number;
          volatilidad: number;
          crecimiento_porcentual: number;
          primer_anio: number;
          ultimo_anio: number;
        };
        mercado_emergente: {
          ciudad: string;
          cantidad_propiedades: number;
          precio_promedio: number;
          precio_promedio_por_m2: number;
          volatilidad: number;
          crecimiento_porcentual: number;
          primer_anio: number;
          ultimo_anio: number;
        };
        recomendaciones_inversion: string[];
        tendencias_generales: string[];
      };
      detalle_por_ciudad: Array<{
        ciudad: string;
        cantidad_propiedades: number;
        precio_promedio: number;
        precio_promedio_por_m2: number;
        volatilidad: number;
        crecimiento_porcentual: number;
        primer_anio: number;
        ultimo_anio: number;
      }>;
    }>(`${this.apiUrl}/market-insights`);
  }

   /**
   * Obtener datos geoespaciales con clusters de ciudades y barrios
   *
   * Backend URL: GET /api/properties/geospatial-data
   *
   * Response: {
   *   total_propiedades_analizadas: number,
   *   total_propiedades_con_precio: number,
   *   ciudades_cluster: Array<{
   *     ciudad: string,
   *     cantidad_propiedades: number,
   *     precio_promedio: number,
   *     crecimiento_porcentual: number,
   *     score_cluster: number
   *   }>,
   *   mejores_barrios: Array<{
   *     barrio: string,
   *     ciudad: string,
   *     cantidad_propiedades: number,
   *     precio_promedio: number,
   *     crecimiento_porcentual: number,
   *     score_cluster: number
   *   }>,
   *   analisis_porcentual_mapa_calor: {
   *     intensidad_dominante: string,
   *     alto: { rango: string, cantidad: number, porcentaje: number },
   *     medio: { rango: string, cantidad: number, porcentaje: number },
   *     bajo: { rango: string, cantidad: number, porcentaje: number }
   *   }
   * }
   */
  getGeospatialData(): Observable<{
    total_propiedades_analizadas: number;
    total_propiedades_con_precio: number;
    ciudades_cluster: Array<{
      ciudad: string;
      cantidad_propiedades: number;
      precio_promedio: number;
      crecimiento_porcentual: number;
      score_cluster: number;
    }>;
    mejores_barrios: Array<{
      barrio: string;
      ciudad: string;
      cantidad_propiedades: number;
      precio_promedio: number;
      crecimiento_porcentual: number;
      score_cluster: number;
    }>;
    analisis_porcentual_mapa_calor: {
      intensidad_dominante: string;
      alto: { rango: string; cantidad: number; porcentaje: number };
      medio: { rango: string; cantidad: number; porcentaje: number };
      bajo: { rango: string; cantidad: number; porcentaje: number };
    };
  }> {
    return this.http.get<{
      total_propiedades_analizadas: number;
      total_propiedades_con_precio: number;
      ciudades_cluster: Array<{
        ciudad: string;
        cantidad_propiedades: number;
        precio_promedio: number;
        crecimiento_porcentual: number;
        score_cluster: number;
      }>;
      mejores_barrios: Array<{
        barrio: string;
        ciudad: string;
        cantidad_propiedades: number;
        precio_promedio: number;
        crecimiento_porcentual: number;
        score_cluster: number;
      }>;
      analisis_porcentual_mapa_calor: {
        intensidad_dominante: string;
        alto: { rango: string; cantidad: number; porcentaje: number };
        medio: { rango: string; cantidad: number; porcentaje: number };
        bajo: { rango: string; cantidad: number; porcentaje: number };
      };
    }>(`${this.apiUrl}/heatmap-stats`);
  }
}
