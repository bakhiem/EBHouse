import { Component, OnInit } from '@angular/core';
import { Calculating, Utility } from '../../models/utility';

import { LandlordService } from '../service/landlord-service.service';
import { ISubscription } from "rxjs/Subscription";
@Component({
  selector: 'app-utility',
  templateUrl: './utility.component.html',
  styleUrls: ['./utility.component.css']
})
export class UtilityComponent implements OnInit {
  listUtility: Utility[] = [
    {id: 1, name: 'Điện', calculating: [{id:3,name:"Theo số"}]},
    { id: 2, name: 'Nước', calculating: [{id:1,name:"Theo phòng"}, {id:2,name:"Theo người"}] },
    { id: 3, name: 'Internet', calculating: [{id:1,name:"Theo phòng"}, {id:2,name:"Theo người"}] },
    { id: 4, name: 'Vệ sinh', calculating: [{id:1,name:"Theo phòng"}, {id:2,name:"Theo người"}] }
  ]
  private subscription: ISubscription;
  currentBh : any;
constructor(private service: LandlordService) { }

ngOnInit() {
  this.subscription = this.service.currentBh.subscribe((data) => {
    this.currentBh = data;
    this.getUtility();
  })
}
private getUtility() {
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
      }
    }, err => {
      this.removeLoading();
      console.log(err);
    })
}
ngAfterViewInit() {
  this.formatCurrency();
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
  console.log( $(".input-price"))
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
    let removeComma = input.toString().replace(/[^0-9]/g, '');
    let currency = removeComma.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
    $this.val(function () {
      return (Number(currency) === 0) ? "" : currency;
    });
  });
}

}
