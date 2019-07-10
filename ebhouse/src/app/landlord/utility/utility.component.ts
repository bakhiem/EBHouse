import { Component, OnInit } from '@angular/core';
import { Calculating, Utility } from '../../models/utility';

import { LandlordService } from '../service/landlord-service.service';
import { ISubscription } from "rxjs/Subscription";

import { SharedServiceService } from '../../service/shared-service.service';
import { MatDialog, MatCheckboxModule } from '@angular/material';
import { CommonMessage, Message } from '../../models/message';

import { InformationDialogComponent } from '../../shared/info-dialog/information-dialog.component';
@Component({
  selector: 'app-utility',
  templateUrl: './utility.component.html',
  styleUrls: ['./utility.component.css']
})
export class UtilityComponent implements OnInit {
  listUtility: Utility[] = [
    { id: 1, name: 'Điện', calculating: [{ id: 3, name: "Theo số" }] },
    { id: 2, name: 'Nước', calculating: [{ id: 1, name: "Theo phòng" }, { id: 2, name: "Theo người" }] },
    { id: 3, name: 'Internet', calculating: [{ id: 1, name: "Theo phòng" }, { id: 2, name: "Theo người" }] },
    { id: 4, name: 'Vệ sinh', calculating: [{ id: 1, name: "Theo phòng" }, { id: 2, name: "Theo người" }] }
  ]
  //Message
  message: Message = {
    content: '',
    type: 0
  }

  private subscription: ISubscription;
  currentBh: any;
  list: any[];
  constructor(private service: LandlordService,
    private shareService: SharedServiceService,
    public dialog: MatDialog) { }

  ngOnInit() {
    this.subscription = this.shareService.currentBh.subscribe((data) => {
      this.currentBh = data;
      this.getUtility();
    })
  }
  displayDialog(message : string){
    this.dialog.open(InformationDialogComponent, {
      width: '400px',
      data: message
    });
  }
  private getUtility() {
    if (!this.currentBh || !this.currentBh.id) {
      return;
    }
    let data: any = {
      id: this.currentBh.id
    }
    this.addLoading();
    this.service.getUtility(data).subscribe(
      res => {
        this.removeLoading();
        let response = JSON.parse("" + res);
        if (response.type == 1) {
          let resData = JSON.parse(response.data);
          console.log(resData)
          this.list = resData;
          //if have list utility
          if (this.list.length > 0) {
            for (let index = 0; index < this.list.length; index++) {
              let currency = this.list[index].value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
              $('#price-' + this.list[index].utility).val(currency);
              $("#select-" + this.list[index].utility).val(this.list[index].calculatingMethod);
            }
            $("input[type=submit]").attr("disabled", "disabled");
          }
          
          //if bh didn't have list utility
          else{
            this.resetForm();
          }
        }
      }, err => {
        this.removeLoading();
        console.log(err);
      })
  }
  resetForm(){
    $("input[type=text]").val('');
    $("input[type=submit]").attr("disabled", "disabled");
  }
  ngAfterViewInit() {
    this.formatCurrency();
    this.jqueryCode();
  }

  jqueryCode() {
    $("input[type=submit]").attr("disabled", "disabled");
    $("select").change(() => {
      $("input[type=submit]").removeAttr("disabled");
    });
    $("input").keypress(function () {
      $("input[type=submit]").removeAttr("disabled");
    });
  }
  addLoading() {
    $('.customLoading').addClass('preloader');
    $('.customLoader').addClass('loader');
  }
  removeLoading() {
    $('.customLoading').removeClass('preloader');
    $('.customLoader').removeClass('loader');
  }
  formatCurrency() {
    var $input = $(".input-price");
    $input.on("keyup", function (event) {
      // When user select text in the document, also abort.
      var selection = window.getSelection().toString();
      if (selection !== '') {
        return;
      }
      // When the arrow keys are pressed, abort.
      if ($.inArray(event.keyCode, [38, 40, 37, 39]) !== -1) {
        return;
      }
      var $this = $(this);
      // Get the value.
      let input = $this.val();
      let removeZero = input.toString().replace(/^0+/, '');
      let removeComma = removeZero.replace(/[^0-9]/g, '');
      let currency = removeComma.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
      $this.val(function () {
        return (Number(currency) === 0) ? "0" : currency;
      });
    });
  }
  checkEmpty(): boolean {
    var notempty = true;
    $('input[type="text"]').each(function () {
      if ($(this).val() == "") {
        notempty = false;
        return notempty;
      }
    });
    return notempty;
  }
  save() {
    this.resetMess();
    if (this.checkEmpty() == false) {
      this.displayDialog(CommonMessage.Utility_InputAllField);
      return;
    }
    let listSendServer = []
    if (this.list.length == 0) {
      for (let index = 0; index < this.listUtility.length; index++) {
        let formatPrice = $('#price-' + this.listUtility[index].id).val().toString().split('.').join('');
        let utility = {
          utility: { id: this.listUtility[index].id },
          boardingHouse: { id: this.currentBh.id },
          value: Number(formatPrice),
          calculatingMethod: Number($('#select-' + this.listUtility[index].id).children("option:selected").val())
        }
        listSendServer.push(utility);
      }
    }
    else {
      for (let index = 0; index < this.list.length; index++) {
        let formatPrice = $('#price-' + this.list[index].utility).val().toString().split('.').join('');
        let utility = {
          id: this.list[index].id,
          utility: { id: this.list[index].utility },
          boardingHouse: { id: this.currentBh.id },
          value: Number(formatPrice),
          calculatingMethod: Number($('#select-' + this.list[index].utility).children("option:selected").val()),
          cDate: this.list[index].cDate
        }
        listSendServer.push(utility);
      }
    }



    let data = {
      data: listSendServer
    }
    console.log(data);
    this.addLoading();
    this.service.updateUtility(data).subscribe(
      res => {
        
        let response = JSON.parse("" + res);
        if (response.type == 1) {
          this.message.type = 1;
          this.message.content = response.message;
          this.getUtility();
        }
        else{
          this.removeLoading();
          this.message.type = 0;
          this.message.content = response.message;
        }
      }, err => {
        this.removeLoading();
        this.message.type = 0;
        this.message.content = CommonMessage.defaultErrMess;
        console.log(err);
      })
  }
  
  resetMess() {
    this.message.content = '';
    this.message.type = 0;
  }
}
