import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PaginationParams, Property, PropertyFilters } from '../../interfaces/models.interface';
import { PropertyService } from '../../../services/property.service';
import { LucideAngularModule, CircleCheck, X, CircleAlert, AlertTriangle, Search, Filter, ChevronUp, ChevronDown, Upload, Download, ChevronLeft, ChevronRight } from 'lucide-angular';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './data-table.html',
})
export default class DataTable implements OnInit {
  readonly successIcon = CircleCheck;
  readonly closeIcon = X;
  readonly alertIcon = CircleAlert;
  readonly warningIcon = AlertTriangle;
  readonly searchIcon = Search;
  readonly filterIcon = Filter;
  readonly chevronUpIcon = ChevronUp;
  readonly chevronDownIcon = ChevronDown;
  readonly uploadIcon = Upload;
  readonly downloadIcon = Download;
  readonly previousIcon = ChevronLeft;
  readonly nextIcon = ChevronRight;

  searchTerm = '';
  filterCity = '';
  filterType = 'all';
  minPrice: number | null = null;
  maxPrice: number | null = null;
  filterBedrooms = 'all';
  filterBathrooms = 'all';
  sortField: keyof Property = 'precio';
  sortDirection: 'asc' | 'desc' = 'desc';
  currentPage = 1;
  itemsPerPage = 15;

  isLoading = false;
  loadingMessage = '';
  successMessage = '';
  errorMessage = '';
  importErrors: string[] = [];
  showFilters = false;

  totalRecords = 0;

  headers = [
    { field: 'id' as keyof Property, label: 'ID' },
    { field: 'titulo' as keyof Property, label: 'Título' },
    { field: 'direccion' as keyof Property, label: 'Dirección' },
    { field: 'ciudad' as keyof Property, label: 'Ciudad' },
    { field: 'barrios' as keyof Property, label: 'Barrio' },
    { field: 'tipoPropiedad' as keyof Property, label: 'Tipo' },
    { field: 'tipoOperacion' as keyof Property, label: 'Operación' },
    { field: 'areaConstruida' as keyof Property, label: 'Área (m²)' },
    { field: 'habitaciones' as keyof Property, label: 'Habs' },
    { field: 'banos' as keyof Property, label: 'Baños' },
    { field: 'estrato' as keyof Property, label: 'Estrato' },
    { field: 'precio' as keyof Property, label: 'Precio' },
    { field: 'predictedPrice' as keyof Property, label: 'Predicho' },
    { field: 'antiguedad' as keyof Property, label: 'Antigüedad' }
  ];

  filteredData: Property[] = [];
  paginatedData: Property[] = [];

  constructor(private propertyService: PropertyService) { }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    this.loadingMessage = 'Cargando propiedades...';

    const filters: PropertyFilters = {};
    if (this.searchTerm) filters.search = this.searchTerm;
    if (this.filterCity) filters.city = this.filterCity;
    if (this.filterType !== 'all') filters.type = this.filterType;
    if (this.minPrice !== null && this.minPrice > 0) filters.minPrice = this.minPrice * 1000000; // Convertir millones a pesos
    if (this.maxPrice !== null && this.maxPrice > 0) filters.maxPrice = this.maxPrice * 1000000;

    if (this.filterBedrooms !== 'all') {
      const bedrooms = parseInt(this.filterBedrooms);
      if (!isNaN(bedrooms)) {
        filters.bedrooms = bedrooms;
      }
    }
    if (this.filterBathrooms !== 'all') {
      const bathrooms = parseInt(this.filterBathrooms);
      if (!isNaN(bathrooms)) {
        filters.bathrooms = bathrooms;
      }
    }

    const pagination: PaginationParams = {
      page: this.currentPage,
      pageSize: this.itemsPerPage,
      sortBy: this.sortField as string,
      sortOrder: this.sortDirection
    };

    this.propertyService.getProperties(filters, pagination).subscribe({
      next: (response) => {
        this.paginatedData = response.items;
        this.filteredData = response.items;
        this.totalRecords = response.total;
        this.isLoading = false;
        this.loadingMessage = '';
      },
      error: (error) => {
        this.errorMessage = 'Error al cargar las propiedades';
        this.isLoading = false;
        this.loadingMessage = '';
        console.error('Error loading properties:', error);
      }
    });
  }

  filterData() {
    this.currentPage = 1;
    this.loadData();
  }

  clearFilters() {
    this.searchTerm = '';
    this.filterCity = '';
    this.filterType = 'all';
    this.minPrice = null;
    this.maxPrice = null;
    this.filterBedrooms = 'all';
    this.filterBathrooms = 'all';
    this.filterData();
  }

  handleSort(field: keyof Property) {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'desc';
    }
    this.loadData();
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadData();
    }
  }

  nextPage() {
    if (this.currentPage < this.getTotalPages()) {
      this.currentPage++;
      this.loadData();
    }
  }

  getTotalPages(): number {
    return Math.ceil(this.totalRecords / this.itemsPerPage);
  }

  getStartIndex(): number {
    return this.totalRecords === 0 ? 0 : (this.currentPage - 1) * this.itemsPerPage + 1;
  }

  getEndIndex(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.totalRecords);
  }

  getVisiblePages(): number[] {
    const totalPages = this.getTotalPages();
    const maxVisible = 5;
    const pages: number[] = [];

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else if (this.currentPage <= 3) {
      for (let i = 1; i <= maxVisible; i++) {
        pages.push(i);
      }
    } else if (this.currentPage >= totalPages - 2) {
      for (let i = totalPages - 4; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      for (let i = this.currentPage - 2; i <= this.currentPage + 2; i++) {
        pages.push(i);
      }
    }

    return pages;
  }

  formatPrice(price?: number): string {
    if (!price) return 'N/A';
    if (price >= 1000000) {
      return `$${(price / 1000000).toFixed(1)}M`;
    }
    return `$${price.toLocaleString('es-CO')}`;
  }

  getPriceDiffClass(property: Property): string {
    if (!property.precio || !property.predictedPrice) return 'text-slate-400';
    const diff = property.predictedPrice - property.precio;
    if (diff > 0) return 'text-green-400';
    if (diff < 0) return 'text-red-400';
    return 'text-slate-400';
  }

  getPriceDiffPercentage(property: Property): string {
    if (!property.precio || !property.predictedPrice) return 'N/A';
    const diff = property.predictedPrice - property.precio;
    const percentage = ((diff / property.precio) * 100).toFixed(1);
    return diff > 0 ? `+${percentage}%` : `${percentage}%`;
  }

  handleImport() {
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];

    // Validate file type
    if (!file.name.endsWith('.csv')) {
      this.errorMessage = 'Por favor selecciona un archivo CSV válido';
      return;
    }

    this.isLoading = true;
    this.loadingMessage = `Importando ${file.name}...`;
    this.successMessage = '';
    this.errorMessage = '';
    this.importErrors = [];

    this.propertyService.importFromCSV(file).subscribe({
      next: (result) => {
        this.isLoading = false;
        this.loadingMessage = '';

        if (result.imported > 0) {
          this.successMessage = `¡Éxito! Se importaron ${result.imported} propiedades`;
          this.loadData(); // Refresh table
        }

        if (result.errors.length > 0) {
          this.importErrors = result.errors;
        }

        // Clear file input
        input.value = '';
      },
      error: (error) => {
        this.isLoading = false;
        this.loadingMessage = '';
        this.errorMessage = error.error || 'Error al importar el archivo CSV';
        input.value = '';
      }
    });
  }

  handleExport() {
    const filters: PropertyFilters = {};
    if (this.searchTerm) filters.search = this.searchTerm;
    if (this.filterCity) filters.city = this.filterCity;
    if (this.filterType !== 'all') filters.type = this.filterType;
    if (this.minPrice !== null && this.minPrice > 0) filters.minPrice = this.minPrice * 1000000; // Convertir a pesos
    if (this.maxPrice !== null && this.maxPrice > 0) filters.maxPrice = this.maxPrice * 1000000;
    if (this.filterBedrooms !== 'all') {
      const bedrooms = parseInt(this.filterBedrooms);
      if (!isNaN(bedrooms)) filters.bedrooms = bedrooms;
    }
    if (this.filterBathrooms !== 'all') {
      const bathrooms = parseInt(this.filterBathrooms);
      if (!isNaN(bathrooms)) filters.bathrooms = bathrooms;
    }

    this.isLoading = true;
    this.loadingMessage = 'Generando archivo CSV...';

    this.propertyService.exportToCSV(filters).subscribe({
      next: (blob) => {
        this.isLoading = false;
        this.loadingMessage = '';

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `propiedades-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);

        this.successMessage = 'Archivo CSV exportado exitosamente';
      },
      error: (error) => {
        this.isLoading = false;
        this.loadingMessage = '';
        this.errorMessage = 'Error al exportar el archivo CSV';
      }
    });
  }
}
