import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { LandlordService } from '../service/landlord-service.service';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';

import { CustomDateAdapterMonth } from '../contract/customDate';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

import { SharedServiceService } from '../../service/shared-service.service';
import { CommonMessage, Message } from '../../models/message';
import { ISubscription } from "rxjs/Subscription";
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'vi-vn' },
    { provide: DateAdapter, useClass: CustomDateAdapterMonth }
  ]
})
export class LandlordDashboardComponent implements OnInit, OnDestroy {

  public barChartOptions: ChartOptions = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      xAxes: [{}], yAxes: [{
        ticks: {
          beginAtZero: true,
          callback: function (value, index, values) {
            if (parseInt(value) >= 1000) {
              return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            } else {
              return value;
            }
          }
        }
      }]
    },
    tooltips: {
      enabled: true,
      mode: 'single',
      callbacks: {
        label: function (tooltipItem, data) {
          let label = data.datasets[tooltipItem.datasetIndex].label;
          let datasetLabel = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
          if (Number(datasetLabel) >= 1000) {
            return label + ': ' + datasetLabel.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
          } else {
            return label + ': ' + datasetLabel;
          }
        }
      }
    },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      }
    },
  };
  public barChartLabels: Label[] = [];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartData: ChartDataSets[] = [
    { data: [], label: 'Doanh thu' },
    { data: [], label: 'Chi phí' }
  ];
  public pieChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: 'top',
    },
    plugins: {
      datalabels: {
        formatter: (value, ctx) => {
          const label = ctx.chart.data.labels[ctx.dataIndex];
          return label;
        },
      },
    }
  };
  public pieChartLabels: Label[] = ['Phòng đã thuê', 'Phòng trống'];
  public pieChartData: number[] = [];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartColors = [
    {
      backgroundColor: ['rgba(255,0,0,0.3)', 'rgba(0,255,0,0.3)', 'rgba(0,0,255,0.3)'],
    },
  ];
  maxDate = new Date();
  currentBhPie: any;
  currentBhContract : any;
  listBh: any[] = [];
  monthPie: FormControl;
  monthBar: FormControl;
  monthContract: FormControl;
  listDataPie: any[];
  listContract : any[] = [];
  private subscription: ISubscription;
  constructor(private service: LandlordService,
    private toastr: ToastrService,
    private shareService: SharedServiceService) { }

    displayedColumns = ['name','startDate','endDate']
  chooseMonthBar(params, datepicker) {
    params.setDate(1);
    this.monthBar.setValue(params);
    this.getFinancial();
    datepicker.close();
  }
  chooseMonthPie(params, datepicker) {
    params.setDate(1);
    this.monthPie.setValue(params);
    this.getRoomsInfo();
    datepicker.close();
  }
  chooseMonthContract(params, datepicker) {
    params.setDate(1);
    this.monthContract.setValue(params);
    this.getContracts();
    datepicker.close();
  }
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  ngOnInit() {
    this.monthPie = new FormControl({ value: new Date(), disabled: true });
    this.monthBar = new FormControl({ value: new Date(), disabled: true });
    this.monthContract = new FormControl({ value: new Date(), disabled: true });
    this.getFinancial();

    this.subscription = this.shareService.currentBh.subscribe((data) => {
      this.listBh = this.shareService.bhList;
      
      if(this.listBh && this.listBh.length > 0){
        this.currentBhContract = this.listBh[0];
        this.getContracts();
        this.getRoomsInfo();
      }
    })
  }

  showSuccess(mess) {
    this.toastr.success(mess, 'Thành công');
  }
  showErr(mess) {
    this.toastr.error(mess, 'Lỗi !');
  }

  //contract
  onChangeBhContract(){
    this.getContracts();
  }
  getContracts() {
    let data: any = {
      date: this.formatDate(3) + '-01',
      boardingHouseID : this.currentBhContract.id
    }
    this.service.getReportContract(data).subscribe(
      res => {
        let response = JSON.parse("" + res);
        if (response.type == 1) {
          console.log(response.data)
          this.listContract = response.data
        }
        else{
          this.listContract = []
        }
      },
      err => {
        this.showErr(CommonMessage.defaultErrMess);
        console.log(err);
      }
    );
  }

    // end contract
  addLoading() {
    $('.customLoading').addClass('preloader');
    $('.customLoader').addClass('loader');
  }
  removeLoading() {
    $('.customLoading').removeClass('preloader');
    $('.customLoader').removeClass('loader');
  }
  getFinancial() {
    let data: any = {
      date: this.formatDate(1) + '-01'
    }
    console.log(data)
    this.service.getReportFinancial(data).subscribe(
      res => {
        this.removeLoading();
        let response = JSON.parse("" + res);
        if (response.type == 1) {
          console.log(response.data)
          this.handleBarChart(response.data);
        }
      },
      err => {
        this.showErr(CommonMessage.defaultErrMess);
        console.log(err);
      }
    );
  }

  formatDate(type: number): string {
    if (type == 1) {
      let month = this.monthBar.value.getMonth() + 1;
      let year = this.monthBar.value.getFullYear();
      return year + '-' + month
    }
    else if (type == 2) {
      let month = this.monthPie.value.getMonth() + 1;
      let year = this.monthPie.value.getFullYear();
      return year + '-' + month
    }
    else if (type == 3) {
      let month = this.monthContract.value.getMonth() + 1;
      let year = this.monthContract.value.getFullYear();
      return year + '-' + month
    }

  }
  getRoomsInfo() {
    let data: any = {
      date: this.formatDate(2) + '-01'
    }
    this.addLoading();
    this.service.getReportRooms(data).subscribe(
      res => {
        this.removeLoading();
        let response = JSON.parse("" + res);
        if (response.type == 1) {
          this.handleRoomsInfo(response.data)
        }
      },
      err => {
        this.removeLoading();
        this.showErr(CommonMessage.defaultErrMess);
        console.log(err);
      }
    );
  }
  onChangeBhPie() {
    this.setPieChart(this.currentBhPie.id)
  }
  setPieChart(id) {
    for (let index = 0; index < this.listDataPie.length; index++) {
      const element = this.listDataPie[index];
      if (id == element.boardingHouseID) {
        let emptyRoom = element.roomCreated - element.roomUsing;
        this.pieChartData = [element.roomUsing, emptyRoom];
      }
    }
    // let emptyRoom = obj.roomCreated - obj.roomUsing;
    // this.pieChartData = [obj.roomUsing,emptyRoom];
  }
  handleRoomsInfo(resData) {
    this.listDataPie = resData;
    for (let index = 0; index < resData.length; index++) {
      const element = resData[index];

      if (index == 0) {
        this.setPieChart(element.boardingHouseID);
      }
    }
    this.currentBhPie = this.listBh[0];

  }
  handleBarChart(resData) {
    let data1 = [];
    let data2 = [];
    let labels = [];
    for (let index = 0; index < resData.length; index++) {
      const element = resData[index];
      data1.push(element.totalFinancial);
      data2.push(element.totalExpense);
      labels.push(element.boardingHouseName);
    }
    this.barChartData[0].data = data1;
    this.barChartData[1].data = data2;
    this.barChartLabels = labels;
  }
  // events
  public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }

  public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }
}

