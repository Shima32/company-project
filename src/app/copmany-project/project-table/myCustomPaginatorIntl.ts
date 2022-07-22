import { MatPaginatorIntl } from "@angular/material/paginator";

export class MyCustomPaginatorIntl extends MatPaginatorIntl {
    showPlus: boolean;
  
    getRangeLabel = (page: number, pageSize: number, length: number) => {
      if (length == 0 || pageSize == 0) { return `0 of ${length}`; }
  
      length = Math.max(length, 0);
  
      const startIndex = page * pageSize;
      const endIndex = startIndex < length ?
          Math.min(startIndex + pageSize, length) :
          startIndex + pageSize;
  
          // - ${startIndex + 1} - ${endIndex} of ${length} Total
      return `Total number of records: ${length}` ;
    }
  }