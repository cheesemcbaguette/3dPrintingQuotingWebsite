import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';

import {Filament} from "../../model/filament";
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import {MatDialog} from "@angular/material/dialog";
import {CurrencyService} from "../../service/currency.service";
import {AddFilamentDialogComponent} from "../../components/dialogs/add-filament-dialog/add-filament-dialog.component";
import {FilamentsService} from "../../service/filaments.service";
import {
  DeleteFilamentDialogComponent
} from "../../components/dialogs/delete-filament-dialog/delete-filament-dialog.component";
import {Currency} from "../../model/currency";
import {FILAMENTS} from "../../../assets/filaments-data";
import {FileUtils} from "../../utils/FileUtils";

@Component({
  selector: 'filament-page',
  templateUrl: './filament-page.component.html',
  styleUrls: ['./filament-page.component.css']
})
export class FilamentPageComponent implements AfterViewInit {
  dataSource!: MatTableDataSource<Filament>;
  displayedColumns: string[] = ['manufacturer', 'materialDiameter', 'spoolPrice', 'spoolSize', 'nozzleTemp', 'bedTemp', 'actions'];

  selectedCurrency: Currency;

  @ViewChild(MatSort) sort = new MatSort ;

  @ViewChild('fileInput') fileInput!: ElementRef;

  constructor(private dialog: MatDialog, private currencyService: CurrencyService, private filamentsService: FilamentsService) {
    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(filamentsService.getAllFilaments());
    this.selectedCurrency = currencyService.getCurrency();
  }

  ngAfterViewInit(): void {
    if(this.dataSource) {
      this.dataSource.sort = this.sort;
    }
  }

  openAddFilamentDialog() {
    let dialog = this.dialog.open(AddFilamentDialogComponent, {
      width: '600px',
      data: { title: "Add new filament" },
    });
    dialog.afterClosed()
      .subscribe(newFilament => {
        if (newFilament && this.dataSource) {
          const newData = [ ...this.dataSource.data ];
          newData.push(newFilament);
          this.dataSource.data = newData;

          this.filamentsService.editFilaments(newData)
        } else {
          // User clicked 'Cancel' or clicked outside the dialog
        }
      });
  }

  openEditFilamentDialog(index: number) {
    let filament : Filament = this.dataSource.data[index];
    let dialog = this.dialog.open(AddFilamentDialogComponent, {

      data: { title: "Edit filament", filament: filament },
    });
    dialog.afterClosed()
      .subscribe(newFilament => {
        if (newFilament && this.dataSource) {
          const newData = [ ...this.dataSource.data ];
          newData[index] = newFilament;

          this.dataSource.data = newData;

          this.filamentsService.editFilaments(newData)
        } else {
          // User clicked 'Cancel' or clicked outside the dialog
        }
      });
  }

  openDeleteFilamentDialog(index: number) {
    let dialog = this.dialog.open(DeleteFilamentDialogComponent, {data: {filamentName: this.dataSource.data[index].name}});
    dialog.afterClosed()
      .subscribe(doDelete => {
        if (doDelete) {
          this.dataSource.data = this.dataSource.data.filter((item, datasourceIndex) => datasourceIndex !== index);

          this.filamentsService.editFilaments(this.dataSource.data)
        } else {
          // User clicked 'Cancel' or clicked outside the dialog
        }
      });
  }

  resetFilamentList() {
    this.dataSource.data = FILAMENTS

    this.filamentsService.editFilaments(this.dataSource.data)
  }

  importFilamentList(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = () => {
        try {
          const resultAsJson = reader.result as string
          this.dataSource.data = JSON.parse(resultAsJson)

          this.filamentsService.editFilaments(this.dataSource.data)

          console.log('Filaments imported'); // JSON data is now stored in the jsonData variable
        } catch (e) {
          console.error('Error parsing JSON', e);
        }
      };
    }
  }

  exportFilamentList() {
    const jsonString = JSON.stringify(this.dataSource.data, null, 2); // Convert JSON object to string
    FileUtils.createAndDownloadFile(jsonString, "filaments.json")
  }
}
