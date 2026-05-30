import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { PaginationParams, Property, PropertyFilters, PropertyResponse } from '../dashboard/interfaces/models.interface';



@Injectable({
  providedIn: 'root'
})
export class PropertyService {
  // URL del backend - cambiar cuando esté listo
  private apiUrl = '/api/properties';

  // Datos simulados (se eliminarán cuando se conecte al backend)
  private mockData: Property[] = [
    { id: 'P001', titulo: 'Apartamento en Chapinero', direccion: 'Cra 7 #85-42', ciudad: 'Bogotá', barrios: 'Chapinero', tipoPropiedad: 'Apartamento', tipoOperacion: 'Venta', areaConstruida: 95, habitaciones: 3, banos: 2, precio: 628000000, predictedPrice: 645000000, antiguedad: '8 años', estrato: 4, lastUpdated: '2025-04-20', fechaActualizacion: '2025-04-20', estado: 'Activo' },
    { id: 'P002', titulo: 'Penthouse El Poblado', direccion: 'Calle 10 #43A-28', ciudad: 'Medellín', barrios: 'El Poblado', tipoPropiedad: 'Penthouse', tipoOperacion: 'Venta', areaConstruida: 168, habitaciones: 4, banos: 3, precio: 892000000, predictedPrice: 875000000, antiguedad: '6 años', estrato: 6, lastUpdated: '2025-04-22', fechaActualizacion: '2025-04-22', estado: 'Activo' },
    { id: 'P003', titulo: 'Casa en Granada', direccion: 'Av Circunvalar #5-89', ciudad: 'Cali', barrios: 'Granada', tipoPropiedad: 'Casa', tipoOperacion: 'Venta', areaConstruida: 205, habitaciones: 5, banos: 4, precio: 734000000, predictedPrice: 728000000, antiguedad: '11 años', estrato: 5, lastUpdated: '2025-04-19', fechaActualizacion: '2025-04-19', estado: 'Activo' },
    { id: 'P004', titulo: 'Apartamento Usaquén', direccion: 'Cra 15 #118-32', ciudad: 'Bogotá', barrios: 'Usaquén', tipoPropiedad: 'Apartamento', tipoOperacion: 'Venta', areaConstruida: 82, habitaciones: 2, banos: 2, precio: 512000000, predictedPrice: 505000000, antiguedad: '7 años', estrato: 5, lastUpdated: '2025-04-21', fechaActualizacion: '2025-04-21', estado: 'Activo' },
    { id: 'P005', titulo: 'Apartamento El Prado', direccion: 'Calle 70 #52-44', ciudad: 'Barranquilla', barrios: 'El Prado', tipoPropiedad: 'Apartamento', tipoOperacion: 'Venta', areaConstruida: 108, habitaciones: 3, banos: 2, precio: 445000000, predictedPrice: 461000000, antiguedad: '9 años', estrato: 4, lastUpdated: '2025-04-18', fechaActualizacion: '2025-04-18', estado: 'Activo' },
    { id: 'P006', titulo: 'Apartamento Laureles', direccion: 'Transversal 39A #75-105', ciudad: 'Medellín', barrios: 'Laureles', tipoPropiedad: 'Apartamento', tipoOperacion: 'Venta', areaConstruida: 75, habitaciones: 2, banos: 2, precio: 468000000, predictedPrice: 472000000, antiguedad: '5 años', estrato: 5, lastUpdated: '2025-04-23', fechaActualizacion: '2025-04-23', estado: 'Activo' },
    { id: 'P007', titulo: 'Casa San Fernando', direccion: 'Calle 5 Norte #23N-45', ciudad: 'Cali', barrios: 'San Fernando', tipoPropiedad: 'Casa', tipoOperacion: 'Venta', areaConstruida: 185, habitaciones: 4, banos: 3, precio: 612000000, predictedPrice: 598000000, antiguedad: '10 años', estrato: 4, lastUpdated: '2025-04-20', fechaActualizacion: '2025-04-20', estado: 'Activo' },
    { id: 'P008', titulo: 'Estudio Chapinero', direccion: 'Cra 9 #72-35', ciudad: 'Bogotá', barrios: 'Chapinero', tipoPropiedad: 'Estudio', tipoOperacion: 'Venta', areaConstruida: 45, habitaciones: 1, banos: 1, precio: 298000000, predictedPrice: 285000000, antiguedad: '4 años', estrato: 3, lastUpdated: '2025-04-24', fechaActualizacion: '2025-04-24', estado: 'Activo' },
    { id: 'P009', titulo: 'Apartamento El Poblado', direccion: 'Calle 10A #34-11', ciudad: 'Medellín', barrios: 'El Poblado', tipoPropiedad: 'Apartamento', tipoOperacion: 'Venta', areaConstruida: 120, habitaciones: 3, banos: 2, precio: 592000000, predictedPrice: 582000000, antiguedad: '7 años', estrato: 6, lastUpdated: '2025-04-22', fechaActualizacion: '2025-04-22', estado: 'Activo' },
    { id: 'P010', titulo: 'Apartamento Granada', direccion: 'Av 3N #12-08', ciudad: 'Cali', barrios: 'Granada', tipoPropiedad: 'Apartamento', tipoOperacion: 'Venta', areaConstruida: 95, habitaciones: 3, banos: 2, precio: 478000000, predictedPrice: 485000000, antiguedad: '8 años', estrato: 5, lastUpdated: '2025-04-21', fechaActualizacion: '2025-04-21', estado: 'Activo' },
    { id: 'P011', titulo: 'Casa Alto Prado', direccion: 'Cra 84 #45-67', ciudad: 'Barranquilla', barrios: 'Alto Prado', tipoPropiedad: 'Casa', tipoOperacion: 'Venta', areaConstruida: 230, habitaciones: 5, banos: 4, precio: 789000000, predictedPrice: 802000000, antiguedad: '12 años', estrato: 5, lastUpdated: '2025-04-19', fechaActualizacion: '2025-04-19', estado: 'Activo' },
    { id: 'P012', titulo: 'Penthouse Chicó', direccion: 'Calle 93 #11A-28', ciudad: 'Bogotá', barrios: 'Chicó', tipoPropiedad: 'Penthouse', tipoOperacion: 'Venta', areaConstruida: 255, habitaciones: 4, banos: 4, precio: 1245000000, predictedPrice: 1198000000, antiguedad: '5 años', estrato: 6, lastUpdated: '2025-04-23', fechaActualizacion: '2025-04-23', estado: 'Activo' },
    { id: 'P013', titulo: 'Apartamento Sabaneta', direccion: 'Calle 77 Sur #48-90', ciudad: 'Medellín', barrios: 'Sabaneta', tipoPropiedad: 'Apartamento', tipoOperacion: 'Venta', areaConstruida: 68, habitaciones: 2, banos: 1, precio: 312000000, predictedPrice: 325000000, antiguedad: '6 años', estrato: 3, lastUpdated: '2025-04-20', fechaActualizacion: '2025-04-20', estado: 'Activo' },
    { id: 'P014', titulo: 'Apartamento Versalles', direccion: 'Av 6 #36N-25', ciudad: 'Cali', barrios: 'Versalles', tipoPropiedad: 'Apartamento', tipoOperacion: 'Venta', areaConstruida: 88, habitaciones: 2, banos: 2, precio: 398000000, predictedPrice: 402000000, antiguedad: '9 años', estrato: 4, lastUpdated: '2025-04-22', fechaActualizacion: '2025-04-22', estado: 'Activo' },
    { id: 'P015', titulo: 'Estudio El Prado', direccion: 'Cra 53 #82-15', ciudad: 'Barranquilla', barrios: 'El Prado', tipoPropiedad: 'Estudio', tipoOperacion: 'Venta', areaConstruida: 52, habitaciones: 1, banos: 1, precio: 245000000, predictedPrice: 238000000, antiguedad: '3 años', estrato: 3, lastUpdated: '2025-04-24', fechaActualizacion: '2025-04-24', estado: 'Activo' }
  ];

  constructor() {
    // Inicializar con datos del localStorage si existen
    const storedData = localStorage.getItem('properties');
    if (storedData) {
      this.mockData = JSON.parse(storedData);
    } else {
      this.saveToLocalStorage();
    }
  }

  /**
   * Obtener todas las propiedades con filtros y paginación
   *
   * Backend URL: GET /api/properties
   * Query Params: page, limit, sortBy, sortOrder, search, city, type, minPrice, maxPrice, minArea, maxArea
   */
  getProperties(
    filters: PropertyFilters = {},
    pagination: PaginationParams = { page: 1, limit: 15 }
  ): Observable<PropertyResponse> {
    // SIMULACIÓN - Reemplazar con HttpClient
    // return this.http.get<PropertyResponse>(`${this.apiUrl}`, { params: {...filters, ...pagination} });

    return of(this.simulateBackendResponse(filters, pagination)).pipe(delay(300));
  }

  /**
   * Obtener una propiedad por ID
   *
   * Backend URL: GET /api/properties/:id
   */
  getPropertyById(id: string): Observable<Property> {
    // SIMULACIÓN - Reemplazar con:
    // return this.http.get<Property>(`${this.apiUrl}/${id}`);

    const property = this.mockData.find(p => p.id === id);
    if (property) {
      return of(property).pipe(delay(200));
    }
    return throwError(() => ({ error: 'Propiedad no encontrada' }));
  }

  /**
   * Crear nueva propiedad
   *
   * Backend URL: POST /api/properties
   * Body: Property (sin id)
   */
  createProperty(property: Omit<Property, 'id'>): Observable<Property> {
    // SIMULACIÓN - Reemplazar con:
    // return this.http.post<Property>(`${this.apiUrl}`, property);

    const newProperty = {
      ...property,
      id: this.generateId(),
      lastUpdated: new Date().toISOString().split('T')[0]
    } as Property;

    this.mockData.push(newProperty);
    this.saveToLocalStorage();

    return of(newProperty).pipe(delay(300));
  }

  /**
   * Actualizar propiedad existente
   *
   * Backend URL: PUT /api/properties/:id
   * Body: Property parcial
   */
  updateProperty(id: string, updates: Partial<Property>): Observable<Property> {
    // SIMULACIÓN - Reemplazar con:
    // return this.http.put<Property>(`${this.apiUrl}/${id}`, updates);

    const index = this.mockData.findIndex(p => p.id === id);
    if (index !== -1) {
      this.mockData[index] = {
        ...this.mockData[index],
        ...updates,
        lastUpdated: new Date().toISOString().split('T')[0]
      };
      this.saveToLocalStorage();
      return of(this.mockData[index]).pipe(delay(300));
    }
    return throwError(() => ({ error: 'Propiedad no encontrada' }));
  }

  /**
   * Eliminar propiedad
   *
   * Backend URL: DELETE /api/properties/:id
   */
  deleteProperty(id: string): Observable<{ success: boolean; message: string }> {
    // SIMULACIÓN - Reemplazar con:
    // return this.http.delete<{success: boolean, message: string}>(`${this.apiUrl}/${id}`);

    const index = this.mockData.findIndex(p => p.id === id);
    if (index !== -1) {
      this.mockData.splice(index, 1);
      this.saveToLocalStorage();
      return of({ success: true, message: 'Propiedad eliminada' }).pipe(delay(300));
    }
    return throwError(() => ({ error: 'Propiedad no encontrada' }));
  }

  /**
   * Importar propiedades desde CSV
   *
   * Backend URL: POST /api/properties/import
   * Body: FormData con archivo CSV
   */
  importFromCSV(file: File): Observable<{ imported: number; errors: string[] }> {
    // SIMULACIÓN - Reemplazar con:
    // const formData = new FormData();
    // formData.append('file', file);
    // return this.http.post<{imported: number, errors: string[]}>(`${this.apiUrl}/import`, formData);

    return new Observable(observer => {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        try {
          const csvContent = e.target.result;
          const result = this.parseCSV(csvContent);

          // Agregar las propiedades importadas
          result.properties.forEach(prop => {
            this.mockData.push({
              ...prop,
              id: this.generateId(),
              lastUpdated: new Date().toISOString().split('T')[0]
            });
          });

          this.saveToLocalStorage();

          observer.next({
            imported: result.properties.length,
            errors: result.errors
          });
          observer.complete();
        } catch (error: any) {
          observer.error({ error: 'Error al procesar el archivo CSV' });
        }
      };

      reader.onerror = () => {
        observer.error({ error: 'Error al leer el archivo' });
      };

      reader.readAsText(file);
    });
  }

  /**
   * Exportar propiedades a CSV
   *
   * Backend URL: GET /api/properties/export
   * Query Params: filtros opcionales
   */
  exportToCSV(filters: PropertyFilters = {}): Observable<Blob> {
    // SIMULACIÓN - Reemplazar con:
    // return this.http.get(`${this.apiUrl}/export`, {
    //   params: filters,
    //   responseType: 'blob'
    // });

    const filtered = this.applyFilters(this.mockData, filters);
    const csv = this.generateCSV(filtered);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

    return of(blob).pipe(delay(200));
  }

  // ===== MÉTODOS AUXILIARES (No necesarios cuando se conecte al backend) =====

  private simulateBackendResponse(
    filters: PropertyFilters,
    pagination: PaginationParams
  ): PropertyResponse {
    let filtered = this.applyFilters(this.mockData, filters);
    const total = filtered.length;

    // Ordenar
    if (pagination.sortBy) {
      filtered = this.sortData(filtered, pagination.sortBy, pagination.sortOrder || 'desc');
    }

    // Paginar
    const startIndex = (pagination.page - 1) * pagination.limit;
    const paginatedData = filtered.slice(startIndex, startIndex + pagination.limit);

    return {
      data: paginatedData,
      total,
      page: pagination.page,
      limit: pagination.limit,
      totalPages: Math.ceil(total / pagination.limit)
    };
  }

  private applyFilters(data: Property[], filters: PropertyFilters): Property[] {
    let filtered = [...data];

    if (filters.search) {
      const term = filters.search.toLowerCase();
      filtered = filtered.filter(p =>
        (p.direccion?.toLowerCase().includes(term) || false) ||
        (p.ciudad?.toLowerCase().includes(term) || false) ||
        (p.barrios?.toLowerCase().includes(term) || false) ||
        (p.titulo?.toLowerCase().includes(term) || false) ||
        (p.localidad?.toLowerCase().includes(term) || false) ||
        (p.zona?.toLowerCase().includes(term) || false)
      );
    }

    if (filters.city) {
      filtered = filtered.filter(p => p.ciudad === filters.city);
    }

    if (filters.type) {
      filtered = filtered.filter(p => p.tipoPropiedad === filters.type);
    }

    if (filters.minPrice !== undefined) {
      filtered = filtered.filter(p => (p.precio || 0) >= filters.minPrice!);
    }

    if (filters.maxPrice !== undefined) {
      filtered = filtered.filter(p => (p.precio || 0) <= filters.maxPrice!);
    }

    if (filters.minArea !== undefined) {
      filtered = filtered.filter(p => (p.areaConstruida || 0) >= filters.minArea!);
    }

    if (filters.maxArea !== undefined) {
      filtered = filtered.filter(p => (p.areaConstruida || 0) <= filters.maxArea!);
    }

    return filtered;
  }

  private sortData(data: Property[], field: string, order: 'asc' | 'desc'): Property[] {
    return [...data].sort((a, b) => {
      const aValue = a[field as keyof Property];
      const bValue = b[field as keyof Property];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return order === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return order === 'asc' ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });
  }

  private parseCSV(csvContent: string): { properties: Property[]; errors: string[] } {
    const lines = csvContent.split('\n').filter(line => line.trim());
    const errors: string[] = [];
    const properties: Property[] = [];

    if (lines.length < 2) {
      errors.push('El archivo CSV está vacío o no tiene datos');
      return { properties, errors };
    }

    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));

    // Mapeo de columnas CSV a campos de la interface
    const fieldMapping: { [key: string]: string } = {
      'Titulo': 'titulo',
      'Fecha Actualizacion': 'fechaActualizacion',
      'ID Propiedad': 'idPropiedad',
      'Link Propiedad': 'linkPropiedad',
      'Tipo Propiedad': 'tipoPropiedad',
      'Tipo Operacion': 'tipoOperacion',
      'Link Google Maps': 'linkGoogleMaps',
      'Direccion': 'direccion',
      'Ubicacion Principal': 'ubicacionPrincipal',
      'Estado': 'estado',
      'Ciudad': 'ciudad',
      'Localidad': 'localidad',
      'Comuna': 'comuna',
      'Zona': 'zona',
      'Region': 'region',
      'Barrios': 'barrios',
      'Piso N': 'pisoN',
      'Banos': 'banos',
      'Habitaciones': 'habitaciones',
      'Garages': 'garages',
      'Area Construida': 'areaConstruida',
      'Antiguedad': 'antiguedad',
      'Estrato': 'estrato',
      'Precio': 'precio',
      'Estado Construccion': 'estadoConstruccion',
      'Antiguedad_Categoria': 'antiguedadCategoria',
      'Localidad_Defi': 'localidadDefi',
      'Fecha_Captura': 'fechaCaptura'
    };

    const numericFields = ['banos', 'habitaciones', 'garages', 'areaConstruida', 'estrato', 'precio'];

    for (let i = 1; i < lines.length; i++) {
      try {
        const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
        const property: any = {};

        headers.forEach((header, index) => {
          const value = values[index];
          const mappedField = fieldMapping[header] || header;

          // Convertir tipos según el campo
          if (numericFields.includes(mappedField)) {
            const numValue = parseFloat(value);
            property[mappedField] = isNaN(numValue) ? undefined : numValue;
          } else {
            property[mappedField] = value || undefined;
          }
        });

        // Validar campos requeridos
        if (property.direccion && property.ciudad) {
          property.lastUpdated = new Date().toISOString().split('T')[0];
          properties.push(property as Property);
        } else {
          errors.push(`Línea ${i + 1}: Falta Direccion o Ciudad`);
        }
      } catch (error) {
        errors.push(`Línea ${i + 1}: Error al procesar`);
      }
    }

    return { properties, errors };
  }

  private generateCSV(properties: Property[]): string {
    const headers = [
      'Titulo', 'Fecha Actualizacion', 'ID Propiedad', 'Link Propiedad',
      'Tipo Propiedad', 'Tipo Operacion', 'Link Google Maps', 'Direccion',
      'Ubicacion Principal', 'Estado', 'Ciudad', 'Localidad', 'Comuna',
      'Zona', 'Region', 'Barrios', 'Piso N', 'Banos', 'Habitaciones',
      'Garages', 'Area Construida', 'Antiguedad', 'Estrato', 'Precio',
      'Estado Construccion', 'Antiguedad_Categoria', 'Localidad_Defi',
      'Fecha_Captura', 'Precio Predicho'
    ];

    const rows = properties.map(p => [
      p.titulo || '',
      p.fechaActualizacion || '',
      p.idPropiedad || p.id,
      p.linkPropiedad || '',
      p.tipoPropiedad || '',
      p.tipoOperacion || '',
      p.linkGoogleMaps || '',
      `"${p.direccion || ''}"`,
      p.ubicacionPrincipal || '',
      p.estado || '',
      p.ciudad || '',
      p.localidad || '',
      p.comuna || '',
      p.zona || '',
      p.region || '',
      p.barrios || '',
      p.pisoN || '',
      p.banos || '',
      p.habitaciones || '',
      p.garages || '',
      p.areaConstruida || '',
      p.antiguedad || '',
      p.estrato || '',
      p.precio || '',
      p.estadoConstruccion || '',
      p.antiguedadCategoria || '',
      p.localidadDefi || '',
      p.fechaCaptura || '',
      p.predictedPrice || ''
    ]);

    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  }

  private saveToLocalStorage(): void {
    localStorage.setItem('properties', JSON.stringify(this.mockData));
  }

  private generateId(): string {
    return 'P' + String(Math.max(...this.mockData.map(p => parseInt(p.id.slice(1))), 0) + 1).padStart(3, '0');
  }
}
