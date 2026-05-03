import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Property } from '../../interfaces/models.interface';

@Component({
  selector: 'app-data-table',
  imports: [CommonModule, FormsModule],
  templateUrl: './data-table.html',
})
export default class DataTable {
   searchTerm = '';
  filterCity = 'all';
  filterType = 'all';
  sortField: keyof Property = 'price';
  sortDirection: 'asc' | 'desc' = 'desc';
  currentPage = 1;
  itemsPerPage = 15;

  properties: Property[] = [
    { id: 'P001', address: 'Cra 7 #85-42', city: 'Bogotá', neighborhood: 'Chapinero', type: 'Apartamento', area: 95, bedrooms: 3, bathrooms: 2, price: 628, predictedPrice: 645, yearBuilt: 2018, lastUpdated: '2025-04-20' },
    { id: 'P002', address: 'Calle 10 #43A-28', city: 'Medellín', neighborhood: 'El Poblado', type: 'Penthouse', area: 168, bedrooms: 4, bathrooms: 3, price: 892, predictedPrice: 875, yearBuilt: 2020, lastUpdated: '2025-04-22' },
    { id: 'P003', address: 'Av Circunvalar #5-89', city: 'Cali', neighborhood: 'Granada', type: 'Casa', area: 205, bedrooms: 5, bathrooms: 4, price: 734, predictedPrice: 728, yearBuilt: 2015, lastUpdated: '2025-04-19' },
    { id: 'P004', address: 'Cra 15 #118-32', city: 'Bogotá', neighborhood: 'Usaquén', type: 'Apartamento', area: 82, bedrooms: 2, bathrooms: 2, price: 512, predictedPrice: 505, yearBuilt: 2019, lastUpdated: '2025-04-21' },
    { id: 'P005', address: 'Calle 70 #52-44', city: 'Barranquilla', neighborhood: 'El Prado', type: 'Apartamento', area: 108, bedrooms: 3, bathrooms: 2, price: 445, predictedPrice: 461, yearBuilt: 2017, lastUpdated: '2025-04-18' },
    { id: 'P006', address: 'Transversal 39A #75-105', city: 'Medellín', neighborhood: 'Laureles', type: 'Apartamento', area: 75, bedrooms: 2, bathrooms: 2, price: 468, predictedPrice: 472, yearBuilt: 2021, lastUpdated: '2025-04-23' },
    { id: 'P007', address: 'Calle 5 Norte #23N-45', city: 'Cali', neighborhood: 'San Fernando', type: 'Casa', area: 185, bedrooms: 4, bathrooms: 3, price: 612, predictedPrice: 598, yearBuilt: 2016, lastUpdated: '2025-04-20' },
    { id: 'P008', address: 'Cra 9 #72-35', city: 'Bogotá', neighborhood: 'Chapinero', type: 'Estudio', area: 45, bedrooms: 1, bathrooms: 1, price: 298, predictedPrice: 285, yearBuilt: 2022, lastUpdated: '2025-04-24' },
    { id: 'P009', address: 'Calle 10A #34-11', city: 'Medellín', neighborhood: 'El Poblado', type: 'Apartamento', area: 120, bedrooms: 3, bathrooms: 2, price: 592, predictedPrice: 582, yearBuilt: 2019, lastUpdated: '2025-04-22' },
    { id: 'P010', address: 'Av 3N #12-08', city: 'Cali', neighborhood: 'Granada', type: 'Apartamento', area: 95, bedrooms: 3, bathrooms: 2, price: 478, predictedPrice: 485, yearBuilt: 2018, lastUpdated: '2025-04-21' },
    { id: 'P011', address: 'Cra 84 #45-67', city: 'Barranquilla', neighborhood: 'Alto Prado', type: 'Casa', area: 230, bedrooms: 5, bathrooms: 4, price: 789, predictedPrice: 802, yearBuilt: 2014, lastUpdated: '2025-04-19' },
    { id: 'P012', address: 'Calle 93 #11A-28', city: 'Bogotá', neighborhood: 'Chicó', type: 'Penthouse', area: 255, bedrooms: 4, bathrooms: 4, price: 1245, predictedPrice: 1198, yearBuilt: 2021, lastUpdated: '2025-04-23' },
    { id: 'P013', address: 'Calle 77 Sur #48-90', city: 'Medellín', neighborhood: 'Sabaneta', type: 'Apartamento', area: 68, bedrooms: 2, bathrooms: 1, price: 312, predictedPrice: 325, yearBuilt: 2020, lastUpdated: '2025-04-20' },
    { id: 'P014', address: 'Av 6 #36N-25', city: 'Cali', neighborhood: 'Versalles', type: 'Apartamento', area: 88, bedrooms: 2, bathrooms: 2, price: 398, predictedPrice: 402, yearBuilt: 2017, lastUpdated: '2025-04-22' },
    { id: 'P015', address: 'Cra 53 #82-15', city: 'Barranquilla', neighborhood: 'El Prado', type: 'Estudio', area: 52, bedrooms: 1, bathrooms: 1, price: 245, predictedPrice: 238, yearBuilt: 2023, lastUpdated: '2025-04-24' }
  ];

  headers = [
    { field: 'id' as keyof Property, label: 'ID' },
    { field: 'address' as keyof Property, label: 'Dirección' },
    { field: 'city' as keyof Property, label: 'Ciudad' },
    { field: 'neighborhood' as keyof Property, label: 'Barrio' },
    { field: 'type' as keyof Property, label: 'Tipo' },
    { field: 'area' as keyof Property, label: 'Área (m²)' },
    { field: 'bedrooms' as keyof Property, label: 'Habs' },
    { field: 'bathrooms' as keyof Property, label: 'Baños' },
    { field: 'price' as keyof Property, label: 'Precio (M)' },
    { field: 'predictedPrice' as keyof Property, label: 'Predicho' },
    { field: 'yearBuilt' as keyof Property, label: 'Año' }
  ];

  filteredData: Property[] = [];
  paginatedData: Property[] = [];

  ngOnInit() {
    this.filterData();
  }

  filterData() {
    let filtered = this.properties;

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(
        p =>
          p.address.toLowerCase().includes(term) ||
          p.city.toLowerCase().includes(term) ||
          p.neighborhood.toLowerCase().includes(term)
      );
    }

    if (this.filterCity !== 'all') {
      filtered = filtered.filter(p => p.city === this.filterCity);
    }

    if (this.filterType !== 'all') {
      filtered = filtered.filter(p => p.type === this.filterType);
    }

    filtered.sort((a, b) => {
      const aValue = a[this.sortField];
      const bValue = b[this.sortField];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return this.sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return this.sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });

    this.filteredData = filtered;
    this.currentPage = 1;
    this.updatePaginatedData();
  }

  handleSort(field: keyof Property) {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'desc';
    }
    this.filterData();
  }

  updatePaginatedData() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedData = this.filteredData.slice(startIndex, startIndex + this.itemsPerPage);
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedData();
    }
  }

  nextPage() {
    if (this.currentPage < this.getTotalPages()) {
      this.currentPage++;
      this.updatePaginatedData();
    }
  }

  getTotalPages(): number {
    return Math.ceil(this.filteredData.length / this.itemsPerPage);
  }

  getStartIndex(): number {
    return (this.currentPage - 1) * this.itemsPerPage + 1;
  }

  getEndIndex(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.filteredData.length);
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

  getPriceDiffClass(property: Property): string {
    const diff = property.predictedPrice - property.price;
    if (diff > 0) return 'text-green-400';
    if (diff < 0) return 'text-red-400';
    return 'text-slate-400';
  }

  getPriceDiffPercentage(property: Property): string {
    const diff = property.predictedPrice - property.price;
    const percentage = ((diff / property.price) * 100).toFixed(1);
    return diff > 0 ? `+${percentage}%` : `${percentage}%`;
  }

  handleExport() {
    const headers = ['ID', 'Dirección', 'Ciudad', 'Barrio', 'Tipo', 'Área', 'Habitaciones', 'Baños', 'Precio', 'Precio Predicho', 'Año Construcción', 'Última Actualización'];
    const rows = this.filteredData.map(p => [
      p.id,
      `"${p.address}"`,
      p.city,
      p.neighborhood,
      p.type,
      p.area,
      p.bedrooms,
      p.bathrooms,
      p.price,
      p.predictedPrice,
      p.yearBuilt,
      p.lastUpdated
    ]);

    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'property-data.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  }
 }
