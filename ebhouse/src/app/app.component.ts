import { Component } from '@angular/core';

// import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';

// import { map, filter, scan } from 'rxjs/operators';
// import { Event as RouterEvent } from '@angular/router';
// declare var $: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  {
  title = 'ebhouse';

  constructor(
    // private router: Router,
    // private activatedRoute: ActivatedRoute
) { }
  // ngOnInit() {

  //   this.router.events.pipe(
  //     filter(event =>  event instanceof NavigationEnd),
  //     map(() => this.activatedRoute)
  //   )
  //     .subscribe((event) =>  {
  //       $.getScript('../assets/js/scripts.js'),
  //       $.getScript('../assets/js/metisMenu.min.js')
  //     });


  // }
  // ngAfterViewInit() { $("#menu").metisMenu(); }


}
