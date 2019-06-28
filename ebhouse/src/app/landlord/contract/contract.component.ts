import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { MatDialog, MatCheckboxModule } from '@angular/material';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';
import * as $AB from 'jquery';
import * as bootstrap from "bootstrap";
import { LandlordService } from '../service/landlord-service.service';

import { Landlord } from '../../models/landlord';
import { BoardingHouse } from '../../models/bh';
import { LandlordComponent } from '../landlord.component';

import { AuthenticationService } from '../../user/service/authentication.service';
import { User } from '../../user/models/user';
import { CommonMessage, Message } from '../../models/message';
import { Observable, throwError } from 'rxjs';
import { ISubscription } from "rxjs/Subscription";
@Component({
  selector: 'app-contract',
  templateUrl: './contract.component.html',
  styleUrls: ['./contract.component.css']
})
export class ContractComponent implements OnInit {
  constructor(){

  }
  ngOnInit(){

  }
  
};






