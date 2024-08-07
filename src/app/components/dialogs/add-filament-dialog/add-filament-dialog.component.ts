import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MyErrorStateMatcher} from "../../../utils/MyErrorStateMatcher";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Filament} from "../../../model/filament";
import {CurrencyService} from "../../../service/currency.service";

@Component({
  selector: 'app-add-filament-dialog',
  templateUrl: './add-filament-dialog.component.html',
  styleUrls: ['./add-filament-dialog.component.scss']
})
export class AddFilamentDialogComponent implements OnInit {

  /*Form validations*/
  addFilamentForm = new FormGroup({
    nameFormControl: new FormControl(this.data.filament ? this.data.filament.name : "", [Validators.required,]),
    filamentDiameterFormControl: new FormControl(this.data.filament ? this.data.filament.materialDiameter : "", [Validators.required,]),
    priceFormControl: new FormControl(this.data.filament ? this.data.filament.spoolPrice : "", [Validators.required,]),
    filamentWeightFormControl: new FormControl(this.data.filament ? this.data.filament.filamentWeight : "", [Validators.required,]),
    densityFormControl: new FormControl(this.data.filament ? this.data.filament.density : "", [Validators.required,]),
    nozzleTempFormControl: new FormControl(this.data.filament ? this.data.filament.nozzleTemp : "", []),
    bedTempFormControl: new FormControl(this.data.filament ? this.data.filament.bedTemp : "", []),
  });

  matcher = new MyErrorStateMatcher();
  selectedCurrency: string;

  constructor(public dialogRef: MatDialogRef<AddFilamentDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: {filament : Filament, title: string}, private currencyService: CurrencyService) {
    this.selectedCurrency = currencyService.getCurrency();
  }

  ngOnInit(): void {
  }

  addFilament(): void {
    const name: string = this.addFilamentForm.get('nameFormControl')!.value!;
    const filamentDiameter = Number(this.addFilamentForm.get('filamentDiameterFormControl')?.value);
    const price = Number(this.addFilamentForm.get('priceFormControl')?.value);
    const filamentWeight = Number(this.addFilamentForm.get('filamentWeightFormControl')?.value);
    const density = Number(this.addFilamentForm.get('densityFormControl')?.value);
    const nozzleTemp = Number(this.addFilamentForm.get('nozzleTempFormControl')?.value);
    const bedTemp = Number(this.addFilamentForm.get('bedTempFormControl')?.value);

    let newFilament : Filament = {name: name, materialDiameter: filamentDiameter, spoolPrice: price, filamentWeight: filamentWeight, density: density, nozzleTemp: nozzleTemp, bedTemp: bedTemp};

    this.dialogRef.close(newFilament);
  }
}
