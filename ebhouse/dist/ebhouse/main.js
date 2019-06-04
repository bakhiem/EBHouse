(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["main"],{

/***/ "./src/$$_lazy_route_resource lazy recursive":
/*!**********************************************************!*\
  !*** ./src/$$_lazy_route_resource lazy namespace object ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncaught exception popping up in devtools
	return Promise.resolve().then(function() {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = "./src/$$_lazy_route_resource lazy recursive";

/***/ }),

/***/ "./src/app/app-routing.module.ts":
/*!***************************************!*\
  !*** ./src/app/app-routing.module.ts ***!
  \***************************************/
/*! exports provided: AppRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppRoutingModule", function() { return AppRoutingModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _dashboard_dashboard_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./dashboard/dashboard.component */ "./src/app/dashboard/dashboard.component.ts");
/* harmony import */ var _user_login_login_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./user/login/login.component */ "./src/app/user/login/login.component.ts");
/* harmony import */ var _user_register_register_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./user/register/register.component */ "./src/app/user/register/register.component.ts");
/* harmony import */ var _user_confirm_phone_confirm_phone_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./user/confirm-phone/confirm-phone.component */ "./src/app/user/confirm-phone/confirm-phone.component.ts");







var routes = [
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: _dashboard_dashboard_component__WEBPACK_IMPORTED_MODULE_3__["DashboardComponent"] },
    { path: 'login', component: _user_login_login_component__WEBPACK_IMPORTED_MODULE_4__["LoginComponent"] },
    { path: 'register', component: _user_register_register_component__WEBPACK_IMPORTED_MODULE_5__["RegisterComponent"] },
    { path: 'verify', component: _user_confirm_phone_confirm_phone_component__WEBPACK_IMPORTED_MODULE_6__["ConfirmPhoneComponent"] },
];
var AppRoutingModule = /** @class */ (function () {
    function AppRoutingModule() {
    }
    AppRoutingModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            imports: [_angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"].forRoot(routes)],
            exports: [_angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"]]
        })
    ], AppRoutingModule);
    return AppRoutingModule;
}());



/***/ }),

/***/ "./src/app/app.component.css":
/*!***********************************!*\
  !*** ./src/app/app.component.css ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2FwcC5jb21wb25lbnQuY3NzIn0= */"

/***/ }),

/***/ "./src/app/app.component.html":
/*!************************************!*\
  !*** ./src/app/app.component.html ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n<router-outlet></router-outlet>\n"

/***/ }),

/***/ "./src/app/app.component.ts":
/*!**********************************!*\
  !*** ./src/app/app.component.ts ***!
  \**********************************/
/*! exports provided: AppComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppComponent", function() { return AppComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _user_service_authentication_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./user/service/authentication.service */ "./src/app/user/service/authentication.service.ts");
/* harmony import */ var _user_models_role__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./user/models/role */ "./src/app/user/models/role.ts");





var AppComponent = /** @class */ (function () {
    function AppComponent(router, authenticationService) {
        var _this = this;
        this.router = router;
        this.authenticationService = authenticationService;
        this.title = 'ebhouse';
        this.authenticationService.currentUser.subscribe(function (x) { return _this.currentUser = x; });
    }
    Object.defineProperty(AppComponent.prototype, "isLandlord", {
        get: function () {
            return this.currentUser && this.currentUser.role === _user_models_role__WEBPACK_IMPORTED_MODULE_4__["Role"].Lanlord;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppComponent.prototype, "isTenant", {
        get: function () {
            return this.currentUser && this.currentUser.role === _user_models_role__WEBPACK_IMPORTED_MODULE_4__["Role"].Tenant;
        },
        enumerable: true,
        configurable: true
    });
    AppComponent.prototype.logout = function () {
        this.authenticationService.logout();
        this.router.navigate(['/login']);
    };
    AppComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-root',
            template: __webpack_require__(/*! ./app.component.html */ "./src/app/app.component.html"),
            styles: [__webpack_require__(/*! ./app.component.css */ "./src/app/app.component.css")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"],
            _user_service_authentication_service__WEBPACK_IMPORTED_MODULE_3__["AuthenticationService"]])
    ], AppComponent);
    return AppComponent;
}());



/***/ }),

/***/ "./src/app/app.module.ts":
/*!*******************************!*\
  !*** ./src/app/app.module.ts ***!
  \*******************************/
/*! exports provided: AppModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppModule", function() { return AppModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/fesm5/platform-browser.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _app_routing_module__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app-routing.module */ "./src/app/app-routing.module.ts");
/* harmony import */ var _app_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./app.component */ "./src/app/app.component.ts");
/* harmony import */ var _user_user_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./user/user.component */ "./src/app/user/user.component.ts");
/* harmony import */ var _dashboard_dashboard_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./dashboard/dashboard.component */ "./src/app/dashboard/dashboard.component.ts");
/* harmony import */ var _user_login_login_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./user/login/login.component */ "./src/app/user/login/login.component.ts");
/* harmony import */ var _user_register_register_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./user/register/register.component */ "./src/app/user/register/register.component.ts");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var _user_service_user_service__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./user/service/user.service */ "./src/app/user/service/user.service.ts");
/* harmony import */ var _user_confirm_phone_confirm_phone_component__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./user/confirm-phone/confirm-phone.component */ "./src/app/user/confirm-phone/confirm-phone.component.ts");
/* harmony import */ var _not_found_not_found_component__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./not-found/not-found.component */ "./src/app/not-found/not-found.component.ts");
/* harmony import */ var _helpers_jwt_interceptor__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./helpers/jwt.interceptor */ "./src/app/helpers/jwt.interceptor.ts");
/* harmony import */ var _landlord_landlord_module__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./landlord/landlord.module */ "./src/app/landlord/landlord.module.ts");
/* harmony import */ var _tenant_tenant_module__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./tenant/tenant.module */ "./src/app/tenant/tenant.module.ts");














//import {  ErrorInterceptor } from './helpers/error.interceptor';



var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["NgModule"])({
            declarations: [
                _app_component__WEBPACK_IMPORTED_MODULE_4__["AppComponent"],
                _user_user_component__WEBPACK_IMPORTED_MODULE_5__["UserComponent"],
                _dashboard_dashboard_component__WEBPACK_IMPORTED_MODULE_6__["DashboardComponent"],
                _user_login_login_component__WEBPACK_IMPORTED_MODULE_7__["LoginComponent"],
                _user_register_register_component__WEBPACK_IMPORTED_MODULE_8__["RegisterComponent"],
                _user_confirm_phone_confirm_phone_component__WEBPACK_IMPORTED_MODULE_12__["ConfirmPhoneComponent"],
                _not_found_not_found_component__WEBPACK_IMPORTED_MODULE_13__["NotFoundComponent"]
            ],
            imports: [
                _angular_forms__WEBPACK_IMPORTED_MODULE_9__["ReactiveFormsModule"],
                _angular_platform_browser__WEBPACK_IMPORTED_MODULE_1__["BrowserModule"],
                _app_routing_module__WEBPACK_IMPORTED_MODULE_3__["AppRoutingModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_9__["FormsModule"],
                _angular_common_http__WEBPACK_IMPORTED_MODULE_10__["HttpClientModule"],
                _landlord_landlord_module__WEBPACK_IMPORTED_MODULE_15__["LandlordModule"],
                _tenant_tenant_module__WEBPACK_IMPORTED_MODULE_16__["TenantModule"]
            ],
            providers: [
                { provide: _angular_common_http__WEBPACK_IMPORTED_MODULE_10__["HTTP_INTERCEPTORS"], useClass: _helpers_jwt_interceptor__WEBPACK_IMPORTED_MODULE_14__["JwtInterceptor"], multi: true },
                // { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
                _user_service_user_service__WEBPACK_IMPORTED_MODULE_11__["UserService"]
            ],
            bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_4__["AppComponent"]]
        })
    ], AppModule);
    return AppModule;
}());



/***/ }),

/***/ "./src/app/dashboard/dashboard.component.css":
/*!***************************************************!*\
  !*** ./src/app/dashboard/dashboard.component.css ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".slimScrollDiv{\r\n    \r\n}\r\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvZGFzaGJvYXJkL2Rhc2hib2FyZC5jb21wb25lbnQuY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQUVBIiwiZmlsZSI6InNyYy9hcHAvZGFzaGJvYXJkL2Rhc2hib2FyZC5jb21wb25lbnQuY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLnNsaW1TY3JvbGxEaXZ7XHJcbiAgICBcclxufSJdfQ== */"

/***/ }),

/***/ "./src/app/dashboard/dashboard.component.html":
/*!****************************************************!*\
  !*** ./src/app/dashboard/dashboard.component.html ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/dashboard/dashboard.component.ts":
/*!**************************************************!*\
  !*** ./src/app/dashboard/dashboard.component.ts ***!
  \**************************************************/
/*! exports provided: DashboardComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DashboardComponent", function() { return DashboardComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _user_service_authentication_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../user/service/authentication.service */ "./src/app/user/service/authentication.service.ts");
/* harmony import */ var _user_models_role__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../user/models/role */ "./src/app/user/models/role.ts");





var DashboardComponent = /** @class */ (function () {
    function DashboardComponent(router, authenticationService) {
        var _this = this;
        this.router = router;
        this.authenticationService = authenticationService;
        this.authenticationService.currentUser.subscribe(function (x) { return _this.currentUser = x; });
    }
    Object.defineProperty(DashboardComponent.prototype, "isLandlord", {
        get: function () {
            return (this.currentUser && this.currentUser.role === _user_models_role__WEBPACK_IMPORTED_MODULE_4__["Role"].Lanlord);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DashboardComponent.prototype, "isTenant", {
        get: function () {
            return (this.currentUser && this.currentUser.role === _user_models_role__WEBPACK_IMPORTED_MODULE_4__["Role"].Tenant);
        },
        enumerable: true,
        configurable: true
    });
    DashboardComponent.prototype.deleteDataInLocal = function () {
        this.authenticationService.logout();
    };
    DashboardComponent.prototype.ngOnInit = function () {
        if (this.isLandlord) {
            this.router.navigate(['/landlord/dashboard']);
        }
        else if (this.isTenant) {
            this.router.navigate(['/tenant/dashboard']);
        }
        else {
            console.log("delete");
            this.deleteDataInLocal();
            this.router.navigate(['/login']);
        }
    };
    DashboardComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-dashboard',
            template: __webpack_require__(/*! ./dashboard.component.html */ "./src/app/dashboard/dashboard.component.html"),
            styles: [__webpack_require__(/*! ./dashboard.component.css */ "./src/app/dashboard/dashboard.component.css")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"],
            _user_service_authentication_service__WEBPACK_IMPORTED_MODULE_3__["AuthenticationService"]])
    ], DashboardComponent);
    return DashboardComponent;
}());



/***/ }),

/***/ "./src/app/guard/auth.guard.ts":
/*!*************************************!*\
  !*** ./src/app/guard/auth.guard.ts ***!
  \*************************************/
/*! exports provided: AuthGuard */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AuthGuard", function() { return AuthGuard; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _user_service_authentication_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../user/service/authentication.service */ "./src/app/user/service/authentication.service.ts");




var AuthGuard = /** @class */ (function () {
    function AuthGuard(router, authenticationService) {
        this.router = router;
        this.authenticationService = authenticationService;
    }
    AuthGuard.prototype.canActivate = function (route, state) {
        var currentUser = this.authenticationService.currentUserValue;
        if (currentUser) {
            // check if route is restricted by role
            if (route.data.roles && route.data.roles.indexOf(currentUser.role) === -1) {
                // role not authorised so redirect to home page
                this.router.navigate(['/login']);
                return false;
            }
            // authorised so return true
            return true;
        }
        // not logged in so redirect to login page with the return url
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return false;
    };
    AuthGuard = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({ providedIn: 'root' }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"],
            _user_service_authentication_service__WEBPACK_IMPORTED_MODULE_3__["AuthenticationService"]])
    ], AuthGuard);
    return AuthGuard;
}());



/***/ }),

/***/ "./src/app/helpers/jwt.interceptor.ts":
/*!********************************************!*\
  !*** ./src/app/helpers/jwt.interceptor.ts ***!
  \********************************************/
/*! exports provided: JwtInterceptor */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "JwtInterceptor", function() { return JwtInterceptor; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _user_service_authentication_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../user/service/authentication.service */ "./src/app/user/service/authentication.service.ts");



var JwtInterceptor = /** @class */ (function () {
    function JwtInterceptor(authenticationService) {
        this.authenticationService = authenticationService;
    }
    JwtInterceptor.prototype.intercept = function (request, next) {
        // add authorization header with jwt token if available
        var currentUser = this.authenticationService.currentUserValue;
        if (currentUser && currentUser.token) {
            request = request.clone({
                setHeaders: {
                    Authorization: "" + currentUser.token
                }
            });
        }
        return next.handle(request);
    };
    JwtInterceptor = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])(),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_user_service_authentication_service__WEBPACK_IMPORTED_MODULE_2__["AuthenticationService"]])
    ], JwtInterceptor);
    return JwtInterceptor;
}());



/***/ }),

/***/ "./src/app/landlord/dashboard/dashboard.component.css":
/*!************************************************************!*\
  !*** ./src/app/landlord/dashboard/dashboard.component.css ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2xhbmRsb3JkL2Rhc2hib2FyZC9kYXNoYm9hcmQuY29tcG9uZW50LmNzcyJ9 */"

/***/ }),

/***/ "./src/app/landlord/dashboard/dashboard.component.html":
/*!*************************************************************!*\
  !*** ./src/app/landlord/dashboard/dashboard.component.html ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<h1>dashboard</h1>"

/***/ }),

/***/ "./src/app/landlord/dashboard/dashboard.component.ts":
/*!***********************************************************!*\
  !*** ./src/app/landlord/dashboard/dashboard.component.ts ***!
  \***********************************************************/
/*! exports provided: LandlordDashboardComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LandlordDashboardComponent", function() { return LandlordDashboardComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");


var LandlordDashboardComponent = /** @class */ (function () {
    function LandlordDashboardComponent() {
    }
    LandlordDashboardComponent.prototype.ngOnInit = function () {
    };
    LandlordDashboardComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-dashboard',
            template: __webpack_require__(/*! ./dashboard.component.html */ "./src/app/landlord/dashboard/dashboard.component.html"),
            styles: [__webpack_require__(/*! ./dashboard.component.css */ "./src/app/landlord/dashboard/dashboard.component.css")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [])
    ], LandlordDashboardComponent);
    return LandlordDashboardComponent;
}());



/***/ }),

/***/ "./src/app/landlord/landlord-routing.module.ts":
/*!*****************************************************!*\
  !*** ./src/app/landlord/landlord-routing.module.ts ***!
  \*****************************************************/
/*! exports provided: LandlordRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LandlordRoutingModule", function() { return LandlordRoutingModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _dashboard_dashboard_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./dashboard/dashboard.component */ "./src/app/landlord/dashboard/dashboard.component.ts");
/* harmony import */ var _profile_profile_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./profile/profile.component */ "./src/app/landlord/profile/profile.component.ts");
/* harmony import */ var _landlord_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./landlord.component */ "./src/app/landlord/landlord.component.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _guard_auth_guard__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../guard/auth.guard */ "./src/app/guard/auth.guard.ts");
/* harmony import */ var _user_models_role__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../user/models/role */ "./src/app/user/models/role.ts");








var LandlordChildRouters = [
    {
        //path: 'landlord/dashboard', component: LandlordComponent 
        path: 'landlord',
        component: _landlord_component__WEBPACK_IMPORTED_MODULE_4__["LandlordComponent"],
        canActivate: [_guard_auth_guard__WEBPACK_IMPORTED_MODULE_6__["AuthGuard"]], data: { roles: [_user_models_role__WEBPACK_IMPORTED_MODULE_7__["Role"].Lanlord] },
        children: [
            {
                path: 'dashboard',
                component: _dashboard_dashboard_component__WEBPACK_IMPORTED_MODULE_2__["LandlordDashboardComponent"]
            },
            {
                path: 'profile',
                component: _profile_profile_component__WEBPACK_IMPORTED_MODULE_3__["LandlordProfileComponent"]
            }
        ]
    }
];
var LandlordRoutingModule = /** @class */ (function () {
    function LandlordRoutingModule() {
    }
    LandlordRoutingModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            imports: [
                _angular_router__WEBPACK_IMPORTED_MODULE_5__["RouterModule"].forChild(LandlordChildRouters)
            ],
            exports: [
                _angular_router__WEBPACK_IMPORTED_MODULE_5__["RouterModule"]
            ]
        })
    ], LandlordRoutingModule);
    return LandlordRoutingModule;
}());



/***/ }),

/***/ "./src/app/landlord/landlord.component.css":
/*!*************************************************!*\
  !*** ./src/app/landlord/landlord.component.css ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2xhbmRsb3JkL2xhbmRsb3JkLmNvbXBvbmVudC5jc3MifQ== */"

/***/ }),

/***/ "./src/app/landlord/landlord.component.html":
/*!**************************************************!*\
  !*** ./src/app/landlord/landlord.component.html ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<!-- <div id=\"preloader\">\n    <div class=\"loader\"></div>\n</div> -->\n<!-- preloader area end -->\n<!-- page container area start -->\n<div class=\"page-container\">\n  <!-- sidebar menu area start -->\n  <div class=\"sidebar-menu\">\n      <div class=\"sidebar-header\">\n          <div class=\"logo\">\n              <a routerLink=\"/dashboard\"><img src=\"assets/images/icon/logo.png\" alt=\"logo\"></a>\n          </div>\n      </div>\n      <div class=\"main-menu\">\n          <div class=\"menu-inner\">\n              <nav>\n                  <ul class=\"metismenu\" id=\"menu\">\n                      <li>\n                          <a href=\"javascript:void(0)\" aria-expanded=\"true\"><i class=\"ti-dashboard\"></i><span>Quản lý chung</span></a>\n                          <ul class=\"collapse\">\n                              <li><a href=\"index.html\">ICO dashboard</a></li>\n                              <li><a href=\"index2.html\">Ecommerce dashboard</a></li>\n                              <li><a href=\"index3.html\">SEO dashboard</a></li>\n                          </ul>\n                      </li>\n                      <li>\n                          <a href=\"javascript:void(0)\" aria-expanded=\"true\"><i class=\"ti-layout-sidebar-left\"></i><span>Thông tin nhà trọ\n                              </span></a>\n                         \n                      </li>\n                      <li>\n                          <a href=\"javascript:void(0)\" aria-expanded=\"true\"><i class=\"ti-pie-chart\"></i><span>Quản lý loại phòng</span></a>\n                          <ul class=\"collapse\">\n                              <li><a href=\"barchart.html\">bar chart</a></li>\n                              <li><a href=\"linechart.html\">line Chart</a></li>\n                              <li><a href=\"piechart.html\">pie chart</a></li>\n                          </ul>\n                      </li>\n                      <li>\n                          <a href=\"javascript:void(0)\" aria-expanded=\"true\"><i class=\"ti-palette\"></i><span>Quản lý phòng</span></a>\n                          <ul class=\"collapse\">\n                              <li><a href=\"accordion.html\">Thông tin phòng</a></li>\n                              <li><a href=\"alert.html\">Hoạt động phòng</a></li>\n                          </ul>\n                      </li>\n                      <li>\n                          <a href=\"javascript:void(0)\" aria-expanded=\"true\"><i class=\"ti-slice\"></i><span>Quản lý hợp đồng</span></a>\n                          <ul class=\"collapse\">\n                              <li><a href=\"fontawesome.html\">fontawesome icons</a></li>\n                              <li><a href=\"themify.html\">themify icons</a></li>\n                          </ul>\n                      </li>\n                      <li>\n                          <a href=\"javascript:void(0)\" aria-expanded=\"true\"><i class=\"fa fa-table\"></i>\n                              <span>Tiện ích</span></a>\n                          <ul class=\"collapse\">\n                              <li><a href=\"table-basic.html\">basic table</a></li>\n                              <li><a href=\"table-layout.html\">table layout</a></li>\n                              <li><a href=\"datatable.html\">datatable</a></li>\n                          </ul>\n                      </li>\n                      <li><a href=\"maps.html\"><i class=\"ti-map-alt\"></i> <span>Chỉ số điện</span></a></li>\n                      <li><a href=\"invoice.html\"><i class=\"ti-receipt\"></i> <span>Quản lý thông báo</span></a></li>\n                      <li>\n                          <a href=\"javascript:void(0)\" aria-expanded=\"true\"><i class=\"ti-layers-alt\"></i> <span>Quản lý tài chính</span></a>\n                          <ul class=\"collapse\">\n                              <li><a href=\"login.html\">Login</a></li>\n                              <li><a href=\"login2.html\">Login 2</a></li>\n                              <li><a href=\"login3.html\">Login 3</a></li>\n                              <li><a href=\"register.html\">Register</a></li>\n                              <li><a href=\"register2.html\">Register 2</a></li>\n                              <li><a href=\"register3.html\">Register 3</a></li>\n                              <li><a href=\"register4.html\">Register 4</a></li>\n                              <li><a href=\"screenlock.html\">Lock Screen</a></li>\n                              <li><a href=\"screenlock2.html\">Lock Screen 2</a></li>\n                              <li><a href=\"reset-pass.html\">reset password</a></li>\n                              <li><a href=\"pricing.html\">Pricing</a></li>\n                          </ul>\n                      </li>\n                      <li routerLink=\"/landlord/profile\" routerLinkActive=\"active\">\n                          <a href=\"javascript:void(0)\" aria-expanded=\"true\" ><i class=\"fa fa-user\"></i>\n                              <span>Thông tin cá nhân</span></a>\n                          <ul class=\"collapse\">\n                              <li><a href=\"404.html\">Error 404</a></li>\n                              <li><a href=\"403.html\">Error 403</a></li>\n                              <li><a href=\"500.html\">Error 500</a></li>\n                          </ul>\n                      </li>\n                      <li>\n                          <a href=\"javascript:void(0)\" aria-expanded=\"true\"><i class=\"fa fa-align-left\"></i> <span>Multi\n                                  level menu</span></a>\n                          <ul class=\"collapse\">\n                              <li><a href=\"#\">Item level (1)</a></li>\n                              <li><a href=\"#\">Item level (1)</a></li>\n                              <li><a href=\"#\" aria-expanded=\"true\">Item level (1)</a>\n                                  <ul class=\"collapse\">\n                                      <li><a href=\"#\">Item level (2)</a></li>\n                                      <li><a href=\"#\">Item level (2)</a></li>\n                                      <li><a href=\"#\">Item level (2)</a></li>\n                                  </ul>\n                              </li>\n                              <li><a href=\"#\">Item level (1)</a></li>\n                          </ul>\n                      </li>\n                  </ul>\n              </nav>\n          </div>\n      </div>\n  </div>\n  <!-- sidebar menu area end -->\n  <!-- main content area start -->\n  <div class=\"main-content\">\n      <!-- header area start -->\n      <div class=\"header-area\">\n          <div class=\"row align-items-center\">\n              <!-- nav and search button -->\n              <div class=\"col-md-6 col-sm-8 clearfix\">\n                  <div class=\"nav-btn pull-left\">\n                      <span></span>\n                      <span></span>\n                      <span></span>\n                  </div>\n                  \n              </div>\n              <!-- profile info & task notification -->\n              <div class=\"col-md-6 col-sm-4 clearfix\">\n                  <ul class=\"notification-area pull-right\">\n                      <li id=\"full-view\"><i class=\"ti-fullscreen\"></i></li>\n                      <li id=\"full-view-exit\"><i class=\"ti-zoom-out\"></i></li>\n                      <li class=\"dropdown\">\n                          <i class=\"ti-bell dropdown-toggle\" data-toggle=\"dropdown\">\n                              <span>2</span>\n                          </i>\n                          <div class=\"dropdown-menu bell-notify-box notify-box\">\n                              <span class=\"notify-title\">You have 3 new notifications <a href=\"#\">view all</a></span>\n                              <div class=\"nofity-list\">\n                                  <a href=\"#\" class=\"notify-item\">\n                                      <div class=\"notify-thumb\"><i class=\"ti-key btn-danger\"></i></div>\n                                      <div class=\"notify-text\">\n                                          <p>You have Changed Your Password</p>\n                                          <span>Just Now</span>\n                                      </div>\n                                  </a>\n                                  <a href=\"#\" class=\"notify-item\">\n                                      <div class=\"notify-thumb\"><i class=\"ti-comments-smiley btn-info\"></i></div>\n                                      <div class=\"notify-text\">\n                                          <p>New Commetns On Post</p>\n                                          <span>30 Seconds ago</span>\n                                      </div>\n                                  </a>\n                                  <a href=\"#\" class=\"notify-item\">\n                                      <div class=\"notify-thumb\"><i class=\"ti-key btn-primary\"></i></div>\n                                      <div class=\"notify-text\">\n                                          <p>Some special like you</p>\n                                          <span>Just Now</span>\n                                      </div>\n                                  </a>\n                                  <a href=\"#\" class=\"notify-item\">\n                                      <div class=\"notify-thumb\"><i class=\"ti-comments-smiley btn-info\"></i></div>\n                                      <div class=\"notify-text\">\n                                          <p>New Commetns On Post</p>\n                                          <span>30 Seconds ago</span>\n                                      </div>\n                                  </a>\n                                  <a href=\"#\" class=\"notify-item\">\n                                      <div class=\"notify-thumb\"><i class=\"ti-key btn-primary\"></i></div>\n                                      <div class=\"notify-text\">\n                                          <p>Some special like you</p>\n                                          <span>Just Now</span>\n                                      </div>\n                                  </a>\n                                  <a href=\"#\" class=\"notify-item\">\n                                      <div class=\"notify-thumb\"><i class=\"ti-key btn-danger\"></i></div>\n                                      <div class=\"notify-text\">\n                                          <p>You have Changed Your Password</p>\n                                          <span>Just Now</span>\n                                      </div>\n                                  </a>\n                                  <a href=\"#\" class=\"notify-item\">\n                                      <div class=\"notify-thumb\"><i class=\"ti-key btn-danger\"></i></div>\n                                      <div class=\"notify-text\">\n                                          <p>You have Changed Your Password</p>\n                                          <span>Just Now</span>\n                                      </div>\n                                  </a>\n                              </div>\n                          </div>\n                      </li>\n                      <li class=\"dropdown\">\n                          <i class=\"fa fa-envelope-o dropdown-toggle\" data-toggle=\"dropdown\"><span>3</span></i>\n                          <div class=\"dropdown-menu notify-box nt-enveloper-box\">\n                              <span class=\"notify-title\">You have 3 new notifications <a href=\"#\">view all</a></span>\n                              <div class=\"nofity-list\">\n                                  <a href=\"#\" class=\"notify-item\">\n                                      <div class=\"notify-thumb\">\n                                          <img src=\"assets/images/author/author-img1.jpg\" alt=\"image\">\n                                      </div>\n                                      <div class=\"notify-text\">\n                                          <p>Aglae Mayer</p>\n                                          <span class=\"msg\">Hey I am waiting for you...</span>\n                                          <span>3:15 PM</span>\n                                      </div>\n                                  </a>\n                                  <a href=\"#\" class=\"notify-item\">\n                                      <div class=\"notify-thumb\">\n                                          <img src=\"assets/images/author/author-img2.jpg\" alt=\"image\">\n                                      </div>\n                                      <div class=\"notify-text\">\n                                          <p>Aglae Mayer</p>\n                                          <span class=\"msg\">When you can connect with me...</span>\n                                          <span>3:15 PM</span>\n                                      </div>\n                                  </a>\n                                  <a href=\"#\" class=\"notify-item\">\n                                      <div class=\"notify-thumb\">\n                                          <img src=\"assets/images/author/author-img3.jpg\" alt=\"image\">\n                                      </div>\n                                      <div class=\"notify-text\">\n                                          <p>Aglae Mayer</p>\n                                          <span class=\"msg\">I missed you so much...</span>\n                                          <span>3:15 PM</span>\n                                      </div>\n                                  </a>\n                                  <a href=\"#\" class=\"notify-item\">\n                                      <div class=\"notify-thumb\">\n                                          <img src=\"assets/images/author/author-img4.jpg\" alt=\"image\">\n                                      </div>\n                                      <div class=\"notify-text\">\n                                          <p>Aglae Mayer</p>\n                                          <span class=\"msg\">Your product is completely Ready...</span>\n                                          <span>3:15 PM</span>\n                                      </div>\n                                  </a>\n                                  <a href=\"#\" class=\"notify-item\">\n                                      <div class=\"notify-thumb\">\n                                          <img src=\"assets/images/author/author-img2.jpg\" alt=\"image\">\n                                      </div>\n                                      <div class=\"notify-text\">\n                                          <p>Aglae Mayer</p>\n                                          <span class=\"msg\">Hey I am waiting for you...</span>\n                                          <span>3:15 PM</span>\n                                      </div>\n                                  </a>\n                                  <a href=\"#\" class=\"notify-item\">\n                                      <div class=\"notify-thumb\">\n                                          <img src=\"assets/images/author/author-img1.jpg\" alt=\"image\">\n                                      </div>\n                                      <div class=\"notify-text\">\n                                          <p>Aglae Mayer</p>\n                                          <span class=\"msg\">Hey I am waiting for you...</span>\n                                          <span>3:15 PM</span>\n                                      </div>\n                                  </a>\n                                  <a href=\"#\" class=\"notify-item\">\n                                      <div class=\"notify-thumb\">\n                                          <img src=\"assets/images/author/author-img3.jpg\" alt=\"image\">\n                                      </div>\n                                      <div class=\"notify-text\">\n                                          <p>Aglae Mayer</p>\n                                          <span class=\"msg\">Hey I am waiting for you...</span>\n                                          <span>3:15 PM</span>\n                                      </div>\n                                  </a>\n                              </div>\n                          </div>\n                      </li>\n                     \n                  </ul>\n              </div>\n          </div>\n      </div>\n      <!-- header area end -->\n      <!-- page title area start -->\n      <div class=\"page-title-area\">\n          <div class=\"row align-items-center\">\n              <div class=\"col-sm-6\">\n                \n              </div>\n              <div class=\"col-sm-6 clearfix\">\n                  <div class=\"user-profile pull-right\">\n                      <h4 class=\"user-name dropdown-toggle\" data-toggle=\"dropdown\">Chọn khu trọ <i class=\"fa fa-angle-down\"></i></h4>\n                      <div class=\"dropdown-menu\">\n                          <a class=\"dropdown-item\" href=\"#\">Message</a>\n                          <a class=\"dropdown-item\" href=\"#\">Settings</a>\n                          <a class=\"dropdown-item\" href=\"#\">Log Out</a>\n                      </div>\n                  </div>\n              </div>\n          </div>\n      </div>\n      <!-- page title area end -->\n      <div class=\"main-content-inner\">\n        <router-outlet></router-outlet>\n      </div>\n \n  <!-- main content area end -->\n  <!-- footer area start-->\n  <footer>\n      <div class=\"footer-area\">\n          <p>Template được sử dụng của <a href=\"https://colorlib.com/wp/\">Colorlib</a>.</p>\n          <p>Bản quyền phần mềm <a href=\"https://facebook.com/bakhiem1997\">EBHouse</a>.</p>\n      </div>\n  </footer>\n  <!-- footer area end-->\n</div>\n<!-- page container area end -->\n\n\n\n<!-- start chart js -->\n<script src=\"https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.7.2/Chart.min.js\"></script>\n<!-- start highcharts js -->\n<script src=\"https://code.highcharts.com/highcharts.js\"></script>\n<!-- start zingchart js -->\n<script src=\"https://cdn.zingchart.com/zingchart.min.js\"></script>\n<script>\nzingchart.MODULESDIR = \"https://cdn.zingchart.com/modules/\";\nZC.LICENSE = [\"569d52cefae586f634c54f86dc99e6a9\", \"ee6b7db5b51705a13dc2339db3edaf6d\"];\n</script>\n<!-- all line chart activation -->\n<script src=\"assets/js/line-chart.js\"></script>\n<!-- all pie chart -->\n<script src=\"assets/js/pie-chart.js\"></script>"

/***/ }),

/***/ "./src/app/landlord/landlord.component.ts":
/*!************************************************!*\
  !*** ./src/app/landlord/landlord.component.ts ***!
  \************************************************/
/*! exports provided: LandlordComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LandlordComponent", function() { return LandlordComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");


var LandlordComponent = /** @class */ (function () {
    function LandlordComponent() {
    }
    LandlordComponent.prototype.ngOnInit = function () {
    };
    LandlordComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-landlord',
            template: __webpack_require__(/*! ./landlord.component.html */ "./src/app/landlord/landlord.component.html"),
            styles: [__webpack_require__(/*! ./landlord.component.css */ "./src/app/landlord/landlord.component.css")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [])
    ], LandlordComponent);
    return LandlordComponent;
}());



/***/ }),

/***/ "./src/app/landlord/landlord.module.ts":
/*!*********************************************!*\
  !*** ./src/app/landlord/landlord.module.ts ***!
  \*********************************************/
/*! exports provided: LandlordModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LandlordModule", function() { return LandlordModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _landlord_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./landlord.component */ "./src/app/landlord/landlord.component.ts");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _profile_profile_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./profile/profile.component */ "./src/app/landlord/profile/profile.component.ts");
/* harmony import */ var _dashboard_dashboard_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./dashboard/dashboard.component */ "./src/app/landlord/dashboard/dashboard.component.ts");
/* harmony import */ var _landlord_routing_module__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./landlord-routing.module */ "./src/app/landlord/landlord-routing.module.ts");








var LandlordModule = /** @class */ (function () {
    function LandlordModule() {
    }
    LandlordModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            declarations: [
                _landlord_component__WEBPACK_IMPORTED_MODULE_3__["LandlordComponent"],
                _profile_profile_component__WEBPACK_IMPORTED_MODULE_5__["LandlordProfileComponent"],
                _dashboard_dashboard_component__WEBPACK_IMPORTED_MODULE_6__["LandlordDashboardComponent"]
            ],
            imports: [
                _angular_common__WEBPACK_IMPORTED_MODULE_2__["CommonModule"],
                _landlord_routing_module__WEBPACK_IMPORTED_MODULE_7__["LandlordRoutingModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_4__["ReactiveFormsModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_4__["FormsModule"]
            ]
        })
    ], LandlordModule);
    return LandlordModule;
}());



/***/ }),

/***/ "./src/app/landlord/profile/profile.component.css":
/*!********************************************************!*\
  !*** ./src/app/landlord/profile/profile.component.css ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".form-group .col-form-label:after {\r\n    content:\"*\";\r\n    color:red;\r\n  }\r\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvbGFuZGxvcmQvcHJvZmlsZS9wcm9maWxlLmNvbXBvbmVudC5jc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7SUFDSSxXQUFXO0lBQ1gsU0FBUztFQUNYIiwiZmlsZSI6InNyYy9hcHAvbGFuZGxvcmQvcHJvZmlsZS9wcm9maWxlLmNvbXBvbmVudC5jc3MiLCJzb3VyY2VzQ29udGVudCI6WyIuZm9ybS1ncm91cCAuY29sLWZvcm0tbGFiZWw6YWZ0ZXIge1xyXG4gICAgY29udGVudDpcIipcIjtcclxuICAgIGNvbG9yOnJlZDtcclxuICB9Il19 */"

/***/ }),

/***/ "./src/app/landlord/profile/profile.component.html":
/*!*********************************************************!*\
  !*** ./src/app/landlord/profile/profile.component.html ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"profile-area\">\r\n    \r\n        <form [formGroup]=\"profileFormGroup\" (ngSubmit)=\"onSubmit()\">\r\n            \r\n                <div class=\"row\">\r\n                    <!-- Textual inputs start -->\r\n                    <div class=\"col-12 mt-5\">\r\n                        <div class=\"card\">\r\n                            <div class=\"card-body\">\r\n                                <h4 class=\"header-title\">Thông tin cá nhân</h4>\r\n                                <p class=\"text-muted font-14 mb-4\">Bạn vui lòng điền đầy đủ thông tin cá nhân</p>\r\n                                <div class=\"form-group row\">\r\n                                    <div class=\"col-sm-6\">\r\n                                        <label for=\"example-text-input\" class=\"col-form-label\">Họ tên</label>\r\n                                        <input class=\"form-control\" type=\"text\" id=\"example-text-input\"\r\n                                            formControlName=\"fullname\">\r\n                                        <div *ngIf=\"profileFormGroup.controls['fullname'].hasError('required') && (profileFormGroup.controls['fullname'].dirty || profileFormGroup.controls['fullname'].touched)\"\r\n                                            class=\"alert alert-danger\">\r\n                                            Họ tên là bắt buộc\r\n                                        </div>\r\n                                    </div>\r\n                                </div>\r\n                                <div class=\"form-group row\">\r\n                                    <div class=\"col-sm-6\">\r\n                                        <label for=\"example-tel-input\" class=\"col-form-label\">Số điện thoại</label>\r\n                                        <input class=\"form-control\" type=\"tel\" id=\"example-tel-input\"\r\n                                            formControlName=\"phone\">\r\n                                        <div *ngIf=\"profileFormGroup.controls['phone'].hasError('required') && (profileFormGroup.controls['phone'].dirty || profileFormGroup.controls['phone'].touched)\"\r\n                                            class=\"alert alert-danger\">\r\n                                            Số điện thoại là bắt buộc\r\n                                        </div>\r\n                                        <div *ngIf=\"profileFormGroup.controls['phone'].hasError('pattern') && (profileFormGroup.controls['phone'].dirty || profileFormGroup.controls['phone'].touched)\"\r\n                                            class=\"alert alert-danger\">\r\n                                            Số điện thoại không đúng định dạng\r\n                                        </div>\r\n                                    </div>\r\n\r\n                                </div>\r\n                                <div class=\"form-group row\">\r\n                                    <div class=\"col-sm-6\">\r\n                                        <label for=\"example-date-input\" class=\"col-form-label\">Ngày sinh</label>\r\n                                        <input class=\"form-control\" type=\"date\" id=\"example-date-input\" formControlName=\"date\"  >\r\n                                    </div>\r\n\r\n                                </div>\r\n                                <!-- begin radio -->\r\n\r\n                                <b class=\"text-muted mb-3 mt-4 d-block\">Giới tính :</b>\r\n                                <div class=\"custom-control custom-radio custom-control-inline\">\r\n                                    <input type=\"radio\" id=\"customRadio1\" class=\"custom-control-input\" value=\"Male\"\r\n                                        formControlName=\"sex\">\r\n                                    <label class=\"custom-control-label\" for=\"customRadio1\">Nam</label>\r\n                                </div>\r\n                                <div class=\"custom-control custom-radio custom-control-inline\">\r\n                                    <input type=\"radio\" id=\"customRadio2\" class=\"custom-control-input\" value=\"Female\"\r\n                                        formControlName=\"sex\">\r\n                                    <label class=\"custom-control-label\" for=\"customRadio2\">Nữ</label>\r\n                                </div>\r\n                                <div class=\"custom-control custom-radio custom-control-inline\">\r\n                                    <input type=\"radio\" id=\"customRadio3\" class=\"custom-control-input\" value=\"Other\"\r\n                                        formControlName=\"sex\">\r\n                                    <label class=\"custom-control-label\" for=\"customRadio3\">Khác</label>\r\n                                </div>\r\n                                <!-- end radio -->\r\n                                <div class=\"form-group row\">\r\n                                    <div class=\"col-sm-3\">\r\n                                        <label class=\"col-form-label\">Tỉnh / Thành phố </label>\r\n                                        <select class=\"custom-select\"  formControlName=\"province\" required (change)=\"onChangeProvince()\"  >\r\n                                            <option  *ngFor=\"let aprovince of dataProvince\" [selected]=\"aprovince.code  == 01\" [ngValue] = \"aprovince\" >\r\n                                                {{aprovince.name}}\r\n                                            </option>\r\n                                        </select>\r\n                                        <div *ngIf=\"profileFormGroup.controls['province'].hasError('required') && (profileFormGroup.controls['province'].dirty || profileFormGroup.controls['province'].touched)\"\r\n                                            class=\"alert alert-danger\">\r\n                                            Tỉnh / Thành phố là bắt buộc\r\n                                        </div>\r\n                                    </div>\r\n                                    <div class=\"col-sm-3\">\r\n                                        <label class=\"col-form-label\">Quận / Huyện</label>\r\n                                        <select class=\"custom-select\"  formControlName=\"distric\" (change)=\"onChangeDistric()\">\r\n                                                <option  *ngFor=\"let adistric of dataDistric\" [ngValue] = \"adistric\" >\r\n                                                    {{adistric.name}}\r\n                                                </option>\r\n                                            </select>\r\n                                            <div *ngIf=\"profileFormGroup.controls['distric'].hasError('required') && (profileFormGroup.controls['distric'].dirty || profileFormGroup.controls['distric'].touched)\"\r\n                                            class=\"alert alert-danger\">\r\n                                            Quận / Huyện là bắt buộc\r\n                                        </div>\r\n                                    </div>\r\n                                    <div class=\"col-sm-3\">\r\n                                        <label class=\"col-form-label\">Xã / Phường</label>\r\n                                        <select class=\"custom-select\"  formControlName=\"wards\">\r\n                                                <option  *ngFor=\"let awards of dataWards\" [ngValue] = \"awards\" >\r\n                                                    {{awards.name}}\r\n                                                </option>\r\n                                            </select>\r\n                                            <div *ngIf=\"profileFormGroup.controls['wards'].hasError('required') && (profileFormGroup.controls['wards'].dirty || profileFormGroup.controls['wards'].touched)\"\r\n                                            class=\"alert alert-danger\">\r\n                                            Xã / Phường là bắt buộc\r\n                                        </div>\r\n                                    </div>\r\n                                </div>\r\n                                <div class=\"form-group row\">\r\n                                    <div class=\"col-sm-6\">\r\n                                        <label for=\"example-tel-input\" class=\"col-form-label\">Thôn xóm/ Số nhà</label>\r\n                                        <input class=\"form-control\" type=\"tel\" id=\"example-tel-input\"\r\n                                            formControlName=\"address\">\r\n                                        <div *ngIf=\"profileFormGroup.controls['address'].hasError('required') && (profileFormGroup.controls['address'].dirty || profileFormGroup.controls['address'].touched)\"\r\n                                            class=\"alert alert-danger\">\r\n                                            Thôn xóm/ số nhà không được để trống\r\n                                        </div>\r\n                                    </div>\r\n                                </div>\r\n\r\n\r\n\r\n                                <input class=\"btn btn-info mb-3\" type=\"submit\" value=\"Lưu\"  >\r\n                                <!-- [disabled]=\"profileFormGroup.invalid\" -->\r\n                            </div>\r\n\r\n                        </div>\r\n\r\n                    </div>\r\n                    <!-- Textual inputs end -->\r\n                </div>\r\n          \r\n        </form>\r\n\r\n</div>\r\n<!-- login area end -->"

/***/ }),

/***/ "./src/app/landlord/profile/profile.component.ts":
/*!*******************************************************!*\
  !*** ./src/app/landlord/profile/profile.component.ts ***!
  \*******************************************************/
/*! exports provided: LandlordProfileComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LandlordProfileComponent", function() { return LandlordProfileComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _user_service_data_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../user/service/data.service */ "./src/app/user/service/data.service.ts");
/* harmony import */ var _service_place_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../service/place.service */ "./src/app/service/place.service.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");






var LandlordProfileComponent = /** @class */ (function () {
    function LandlordProfileComponent(fb, data, router, placeService) {
        this.fb = fb;
        this.data = data;
        this.router = router;
        this.placeService = placeService;
        this.message = "";
        this.roleDefault = 1;
        this.phonePattern = "((09|03|07|08|05)+([0-9]{8}))";
    }
    LandlordProfileComponent.prototype.ngOnInit = function () {
        var _this = this;
        //get tinh/tp 
        this.placeService.getProvince().subscribe(function (response) {
            var arr = [];
            for (var key in response) {
                arr.push(response[key]);
            }
            _this.dataProvince = arr;
        });
        this.profileFormGroup = this.fb.group({
            fullname: this.fb.control('', _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].compose([
                _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required
            ])),
            phone: this.fb.control('', _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].compose([
                _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required,
                _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].pattern(this.phonePattern)
            ])),
            date: this.fb.control('2018-03-05', _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].compose([
                _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required
            ])),
            sex: this.fb.control('Male', _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].compose([
                _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required
            ])),
            province: this.fb.control('', _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].compose([
                _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required
            ])),
            distric: this.fb.control('', _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].compose([
                _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required
            ])),
            wards: this.fb.control('', _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].compose([
                _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required
            ])),
            address: this.fb.control('', _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].compose([
                _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required
            ])),
        });
    };
    LandlordProfileComponent.prototype.onChangeProvince = function () {
        var _this = this;
        this.placeService.getDistric(this.profileFormGroup.value.province.code).subscribe(function (response) {
            var arr = [];
            for (var key in response) {
                arr.push(response[key]);
            }
            _this.dataDistric = arr;
        });
    };
    ;
    LandlordProfileComponent.prototype.onChangeDistric = function () {
        var _this = this;
        this.placeService.getWards(this.profileFormGroup.value.distric.code).subscribe(function (response) {
            var arr = [];
            for (var key in response) {
                arr.push(response[key]);
            }
            _this.dataWards = arr;
        });
    };
    ;
    LandlordProfileComponent.prototype.onSubmit = function () {
        var fullAddress = this.profileFormGroup.value.address + " , " + this.profileFormGroup.value.wards.name + " , " + this.profileFormGroup.value.distric.name + " , " + this.profileFormGroup.value.province.name;
        console.log(fullAddress);
        console.log(this.profileFormGroup.value);
    };
    LandlordProfileComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-profile',
            template: __webpack_require__(/*! ./profile.component.html */ "./src/app/landlord/profile/profile.component.html"),
            styles: [__webpack_require__(/*! ./profile.component.css */ "./src/app/landlord/profile/profile.component.css")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormBuilder"],
            _user_service_data_service__WEBPACK_IMPORTED_MODULE_3__["DataService"],
            _angular_router__WEBPACK_IMPORTED_MODULE_5__["Router"],
            _service_place_service__WEBPACK_IMPORTED_MODULE_4__["PlaceService"]])
    ], LandlordProfileComponent);
    return LandlordProfileComponent;
}());



/***/ }),

/***/ "./src/app/not-found/not-found.component.css":
/*!***************************************************!*\
  !*** ./src/app/not-found/not-found.component.css ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL25vdC1mb3VuZC9ub3QtZm91bmQuY29tcG9uZW50LmNzcyJ9 */"

/***/ }),

/***/ "./src/app/not-found/not-found.component.html":
/*!****************************************************!*\
  !*** ./src/app/not-found/not-found.component.html ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"error-area ptb--100 text-center\">\n  <div class=\"container\">\n      <div class=\"error-content\">\n          <h2><i class=\"fa fa-exclamation-triangle\"></i></h2>\n          <p>Có lỗi xảy ra, mong bạn thông cảm</p>\n          <a  routerLink=\"\">Trở về trang chủ</a>\n      </div>\n  </div>\n</div>\n"

/***/ }),

/***/ "./src/app/not-found/not-found.component.ts":
/*!**************************************************!*\
  !*** ./src/app/not-found/not-found.component.ts ***!
  \**************************************************/
/*! exports provided: NotFoundComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NotFoundComponent", function() { return NotFoundComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");


var NotFoundComponent = /** @class */ (function () {
    function NotFoundComponent() {
    }
    NotFoundComponent.prototype.ngOnInit = function () {
    };
    NotFoundComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-not-found',
            template: __webpack_require__(/*! ./not-found.component.html */ "./src/app/not-found/not-found.component.html"),
            styles: [__webpack_require__(/*! ./not-found.component.css */ "./src/app/not-found/not-found.component.css")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [])
    ], NotFoundComponent);
    return NotFoundComponent;
}());



/***/ }),

/***/ "./src/app/service/place.service.ts":
/*!******************************************!*\
  !*** ./src/app/service/place.service.ts ***!
  \******************************************/
/*! exports provided: PlaceService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PlaceService", function() { return PlaceService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");



var PlaceService = /** @class */ (function () {
    function PlaceService(http) {
        this.http = http;
    }
    PlaceService.prototype.getProvince = function () {
        return this.http.get("../../assets/place/tinh_tp.json");
    };
    PlaceService.prototype.getDistric = function (code) {
        return this.http.get("../../assets/place/quan-huyen/" + code + ".json");
    };
    PlaceService.prototype.getWards = function (code) {
        return this.http.get("../../assets/place/xa-phuong/" + code + ".json");
    };
    PlaceService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({
            providedIn: 'root'
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"]])
    ], PlaceService);
    return PlaceService;
}());



/***/ }),

/***/ "./src/app/tenant/dashboard/dashboard.component.css":
/*!**********************************************************!*\
  !*** ./src/app/tenant/dashboard/dashboard.component.css ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL3RlbmFudC9kYXNoYm9hcmQvZGFzaGJvYXJkLmNvbXBvbmVudC5jc3MifQ== */"

/***/ }),

/***/ "./src/app/tenant/dashboard/dashboard.component.html":
/*!***********************************************************!*\
  !*** ./src/app/tenant/dashboard/dashboard.component.html ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<p>\n  dashboard works!\n</p>\n"

/***/ }),

/***/ "./src/app/tenant/dashboard/dashboard.component.ts":
/*!*********************************************************!*\
  !*** ./src/app/tenant/dashboard/dashboard.component.ts ***!
  \*********************************************************/
/*! exports provided: TenantDashboardComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TenantDashboardComponent", function() { return TenantDashboardComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");


var TenantDashboardComponent = /** @class */ (function () {
    function TenantDashboardComponent() {
    }
    TenantDashboardComponent.prototype.ngOnInit = function () {
    };
    TenantDashboardComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-dashboard',
            template: __webpack_require__(/*! ./dashboard.component.html */ "./src/app/tenant/dashboard/dashboard.component.html"),
            styles: [__webpack_require__(/*! ./dashboard.component.css */ "./src/app/tenant/dashboard/dashboard.component.css")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [])
    ], TenantDashboardComponent);
    return TenantDashboardComponent;
}());



/***/ }),

/***/ "./src/app/tenant/profile/profile.component.css":
/*!******************************************************!*\
  !*** ./src/app/tenant/profile/profile.component.css ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL3RlbmFudC9wcm9maWxlL3Byb2ZpbGUuY29tcG9uZW50LmNzcyJ9 */"

/***/ }),

/***/ "./src/app/tenant/profile/profile.component.html":
/*!*******************************************************!*\
  !*** ./src/app/tenant/profile/profile.component.html ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<p>\n  profile works!\n</p>\n"

/***/ }),

/***/ "./src/app/tenant/profile/profile.component.ts":
/*!*****************************************************!*\
  !*** ./src/app/tenant/profile/profile.component.ts ***!
  \*****************************************************/
/*! exports provided: TenantProfileComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TenantProfileComponent", function() { return TenantProfileComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");


var TenantProfileComponent = /** @class */ (function () {
    function TenantProfileComponent() {
    }
    TenantProfileComponent.prototype.ngOnInit = function () {
    };
    TenantProfileComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-profile',
            template: __webpack_require__(/*! ./profile.component.html */ "./src/app/tenant/profile/profile.component.html"),
            styles: [__webpack_require__(/*! ./profile.component.css */ "./src/app/tenant/profile/profile.component.css")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [])
    ], TenantProfileComponent);
    return TenantProfileComponent;
}());



/***/ }),

/***/ "./src/app/tenant/tenant.component.css":
/*!*********************************************!*\
  !*** ./src/app/tenant/tenant.component.css ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL3RlbmFudC90ZW5hbnQuY29tcG9uZW50LmNzcyJ9 */"

/***/ }),

/***/ "./src/app/tenant/tenant.component.html":
/*!**********************************************!*\
  !*** ./src/app/tenant/tenant.component.html ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<p>\n  tenant works!\n</p>\n"

/***/ }),

/***/ "./src/app/tenant/tenant.component.ts":
/*!********************************************!*\
  !*** ./src/app/tenant/tenant.component.ts ***!
  \********************************************/
/*! exports provided: TenantComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TenantComponent", function() { return TenantComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");


var TenantComponent = /** @class */ (function () {
    function TenantComponent() {
    }
    TenantComponent.prototype.ngOnInit = function () {
    };
    TenantComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-tenant',
            template: __webpack_require__(/*! ./tenant.component.html */ "./src/app/tenant/tenant.component.html"),
            styles: [__webpack_require__(/*! ./tenant.component.css */ "./src/app/tenant/tenant.component.css")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [])
    ], TenantComponent);
    return TenantComponent;
}());



/***/ }),

/***/ "./src/app/tenant/tenant.module.ts":
/*!*****************************************!*\
  !*** ./src/app/tenant/tenant.module.ts ***!
  \*****************************************/
/*! exports provided: TenantModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TenantModule", function() { return TenantModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _profile_profile_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./profile/profile.component */ "./src/app/tenant/profile/profile.component.ts");
/* harmony import */ var _dashboard_dashboard_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./dashboard/dashboard.component */ "./src/app/tenant/dashboard/dashboard.component.ts");
/* harmony import */ var _tenant_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./tenant.component */ "./src/app/tenant/tenant.component.ts");






var TenantModule = /** @class */ (function () {
    function TenantModule() {
    }
    TenantModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            declarations: [_profile_profile_component__WEBPACK_IMPORTED_MODULE_3__["TenantProfileComponent"],
                _dashboard_dashboard_component__WEBPACK_IMPORTED_MODULE_4__["TenantDashboardComponent"],
                _tenant_component__WEBPACK_IMPORTED_MODULE_5__["TenantComponent"]],
            imports: [
                _angular_common__WEBPACK_IMPORTED_MODULE_2__["CommonModule"]
            ]
        })
    ], TenantModule);
    return TenantModule;
}());



/***/ }),

/***/ "./src/app/user/confirm-phone/confirm-phone.component.css":
/*!****************************************************************!*\
  !*** ./src/app/user/confirm-phone/confirm-phone.component.css ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".form-control{\r\n    border : 1px solid rgba(170, 170, 170, .3);\r\n}\r\n.focused label{\r\n    top : -20px;\r\n}\r\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvdXNlci9jb25maXJtLXBob25lL2NvbmZpcm0tcGhvbmUuY29tcG9uZW50LmNzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtJQUNJLDBDQUEwQztBQUM5QztBQUNBO0lBQ0ksV0FBVztBQUNmIiwiZmlsZSI6InNyYy9hcHAvdXNlci9jb25maXJtLXBob25lL2NvbmZpcm0tcGhvbmUuY29tcG9uZW50LmNzcyIsInNvdXJjZXNDb250ZW50IjpbIi5mb3JtLWNvbnRyb2x7XHJcbiAgICBib3JkZXIgOiAxcHggc29saWQgcmdiYSgxNzAsIDE3MCwgMTcwLCAuMyk7XHJcbn1cclxuLmZvY3VzZWQgbGFiZWx7XHJcbiAgICB0b3AgOiAtMjBweDtcclxufSJdfQ== */"

/***/ }),

/***/ "./src/app/user/confirm-phone/confirm-phone.component.html":
/*!*****************************************************************!*\
  !*** ./src/app/user/confirm-phone/confirm-phone.component.html ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n<div class=\"login-area\">\n  <div class=\"container\">\n    <div class=\"login-box ptb--100\">\n      <form [formGroup]=\"verifyFormGroup\">\n        <div class=\"login-form-head\">\n          <h4>Xác thực số điện thoại</h4>\n          <p>Mời nhập mã OTP vừa được gửi kèm qua tin nhắn đến số điện thoại đã đăng ký</p>\n        </div>\n        <div *ngIf=\"message\" class=\"alert alert-danger\" role=\"alert\">\n          <a  class=\"alert-link\">{{message}}</a>\n        </div>\n\n        <div class=\"login-form-body\">\n          <div class=\"form-gp focused\">\n            <label for=\"exampleInputEmail1\">Số điện thoại</label>\n            <input type=\"text\" id=\"exampleInputEmail1\" formControlName=\"phone\">\n            <i class=\"ti-agenda\"></i>\n          </div>\n          <div id=\"recaptcha-container\" data-callback=\"imNotARobot\"></div>\n          <div *ngIf=\"windowRef.recaptchaVerifier\">\n            <button class=\"btn btn-outline-secondary mb-3 mt-3\" (click)=\"sendLoginCode()\">Gửi mã OTP về điện\n              thoại</button>\n          </div>\n          <div *ngIf=\"windowRef.confirmationResult\">\n            <div class=\"form-gp focused\">\n              <label for=\"exampleInputEmail1\">Nhập mã OTP</label>\n              <input type=\"text\" class=\"form-control mt-3\" formControlName=\"otpcode\">\n            </div>\n            <button class=\"btn btn-outline-secondary mb-3\" (click)=\"verifyLoginCode()\">Xác nhận</button>\n          </div>\n        </div>\n      </form>\n\n\n    </div>\n  </div>\n</div>\n"

/***/ }),

/***/ "./src/app/user/confirm-phone/confirm-phone.component.ts":
/*!***************************************************************!*\
  !*** ./src/app/user/confirm-phone/confirm-phone.component.ts ***!
  \***************************************************************/
/*! exports provided: ConfirmPhoneComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ConfirmPhoneComponent", function() { return ConfirmPhoneComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _service_data_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../service/data.service */ "./src/app/user/service/data.service.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _service_window_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../service/window.service */ "./src/app/user/service/window.service.ts");
/* harmony import */ var _service_user_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../service/user.service */ "./src/app/user/service/user.service.ts");
/* harmony import */ var firebase_app__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! firebase/app */ "./node_modules/firebase/app/dist/index.cjs.js");
/* harmony import */ var firebase_app__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(firebase_app__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var firebase_auth__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! firebase/auth */ "./node_modules/firebase/auth/dist/index.esm.js");
/* harmony import */ var firebase_firestore__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! firebase/firestore */ "./node_modules/firebase/firestore/dist/index.esm.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");










var ConfirmPhoneComponent = /** @class */ (function () {
    function ConfirmPhoneComponent(win, router, fb, data, userService) {
        this.win = win;
        this.router = router;
        this.fb = fb;
        this.data = data;
        this.userService = userService;
    }
    ConfirmPhoneComponent.prototype.ngAfterViewInit = function () {
        disableButtonOTPBeforeVerify();
    };
    ConfirmPhoneComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.data.currentUser.subscribe(function (user) { return _this.user = user; });
        //after register, add user to data service, if don't have data service is fake url and redirect to login.
        if (this.user == null) {
            this.router.navigate(['/login']);
        }
        this.verifyFormGroup = this.fb.group({
            phone: { value: (this.user) ? formatPhone(this.user.phone) : "", disabled: true },
            otpcode: ''
        });
        var firebaseConfig = {
            apiKey: "AIzaSyByYbJ4m91-JrXamkGSmAP6sQbePsjb0Sc",
            authDomain: "ebhouse-666d3.firebaseapp.com",
            databaseURL: "https://ebhouse-666d3.firebaseio.com",
            projectId: "ebhouse-666d3",
            storageBucket: "ebhouse-666d3.appspot.com",
            messagingSenderId: "37350427217",
            appId: "1:37350427217:web:b58c559557f49517"
        };
        if (!firebase_app__WEBPACK_IMPORTED_MODULE_6__["apps"].length) {
            firebase_app__WEBPACK_IMPORTED_MODULE_6__["initializeApp"](firebaseConfig);
        }
        this.windowRef = this.win.windowRef;
        this.windowRef.recaptchaVerifier = new firebase_app__WEBPACK_IMPORTED_MODULE_6__["auth"].RecaptchaVerifier('recaptcha-container', {
            'callback': function (response) {
                enableButtonOTPBeforeVerify();
            },
            'expired-callback': function () {
                // Response expired. Ask user to solve reCAPTCHA again.
            }
        });
        this.windowRef.recaptchaVerifier.render();
    };
    ConfirmPhoneComponent.prototype.sendLoginCode = function () {
        var _this = this;
        disableButton();
        var appVerifier = this.windowRef.recaptchaVerifier;
        var num = "" + formatPhone(this.user.phone);
        console.log(num);
        firebase_app__WEBPACK_IMPORTED_MODULE_6__["auth"]().signInWithPhoneNumber(num, appVerifier)
            .then(function (result) {
            _this.windowRef.confirmationResult = result;
        })
            .catch(function (error) { return console.log(error); });
    };
    ConfirmPhoneComponent.prototype.verifyLoginCode = function () {
        var _this = this;
        this.windowRef.confirmationResult
            .confirm(this.verifyFormGroup.value.otpcode)
            .then(function (result) {
            if (result.user != null) {
                _this.submit();
            }
        })
            .catch(function (error) {
            _this.message = "Sai mã OTP";
            console.log(error, "Incorrect code entered?");
        });
    };
    ConfirmPhoneComponent.prototype.submit = function () {
        var _this = this;
        this.userService
            .submit(this.user)
            .subscribe(function (res) {
            var mess;
            mess = JSON.parse("" + res);
            console.log(mess);
            if (mess.type == 1) {
                _this.message = mess.message;
                _this.router.navigate(['/login']);
            }
            if (mess.type == 0) {
                _this.message = mess.message;
            }
        }, function (err) {
            console.log(err);
            _this.message = "Có lỗi xảy ra";
        });
    };
    ConfirmPhoneComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-confirm-phone',
            template: __webpack_require__(/*! ./confirm-phone.component.html */ "./src/app/user/confirm-phone/confirm-phone.component.html"),
            styles: [__webpack_require__(/*! ./confirm-phone.component.css */ "./src/app/user/confirm-phone/confirm-phone.component.css")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_service_window_service__WEBPACK_IMPORTED_MODULE_4__["WindowService"],
            _angular_router__WEBPACK_IMPORTED_MODULE_3__["Router"],
            _angular_forms__WEBPACK_IMPORTED_MODULE_9__["FormBuilder"],
            _service_data_service__WEBPACK_IMPORTED_MODULE_2__["DataService"],
            _service_user_service__WEBPACK_IMPORTED_MODULE_5__["UserService"]])
    ], ConfirmPhoneComponent);
    return ConfirmPhoneComponent;
}());

function disableButtonOTPBeforeVerify() {
    var button = document.querySelector("button.btn.btn-outline-secondary");
    button.disabled = true;
}
function enableButtonOTPBeforeVerify() {
    var button = document.querySelector("button.btn.btn-outline-secondary");
    button.disabled = false;
}
function disableButton() {
    var button = document.querySelector("button.btn.btn-outline-secondary");
    button.disabled = true;
    incTimer();
    setTimeout(function () {
        button.disabled = false;
    }, 30000);
}
function formatPhone(phone) {
    var formatPhone = phone;
    formatPhone = formatPhone.slice(1);
    formatPhone = "+84" + formatPhone;
    return formatPhone;
}
var countdownNum = 30;
function incTimer() {
    setTimeout(function () {
        if (countdownNum != 0) {
            countdownNum--;
            document.querySelector('button.btn.btn-outline-secondary').innerHTML = 'Thời gian còn lại ' + countdownNum + ' giây';
            incTimer();
        }
        else {
            document.querySelector('button.btn.btn-outline-secondary').innerHTML = 'Gửi lại mã';
            countdownNum = 30;
        }
    }, 1000);
}


/***/ }),

/***/ "./src/app/user/login/login.component.css":
/*!************************************************!*\
  !*** ./src/app/user/login/login.component.css ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".login-form-body .alert.alert-danger{\r\n    padding : 0;\r\n    background: none;\r\n    color: red;\r\n    position: relative;\r\n    top: -20px;\r\n}\r\n.form-group.choose-role label{\r\n    color: #7e74ff;\r\n}\r\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvdXNlci9sb2dpbi9sb2dpbi5jb21wb25lbnQuY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0lBQ0ksV0FBVztJQUNYLGdCQUFnQjtJQUNoQixVQUFVO0lBQ1Ysa0JBQWtCO0lBQ2xCLFVBQVU7QUFDZDtBQUNBO0lBQ0ksY0FBYztBQUNsQiIsImZpbGUiOiJzcmMvYXBwL3VzZXIvbG9naW4vbG9naW4uY29tcG9uZW50LmNzcyIsInNvdXJjZXNDb250ZW50IjpbIi5sb2dpbi1mb3JtLWJvZHkgLmFsZXJ0LmFsZXJ0LWRhbmdlcntcclxuICAgIHBhZGRpbmcgOiAwO1xyXG4gICAgYmFja2dyb3VuZDogbm9uZTtcclxuICAgIGNvbG9yOiByZWQ7XHJcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XHJcbiAgICB0b3A6IC0yMHB4O1xyXG59XHJcbi5mb3JtLWdyb3VwLmNob29zZS1yb2xlIGxhYmVse1xyXG4gICAgY29sb3I6ICM3ZTc0ZmY7XHJcbn0iXX0= */"

/***/ }),

/***/ "./src/app/user/login/login.component.html":
/*!*************************************************!*\
  !*** ./src/app/user/login/login.component.html ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<!-- <div id=\"preloader\">\n  <div class=\"loader\"></div>\n</div> -->\n<!-- preloader area end -->\n<!-- login area start -->\n<div class=\"login-area\">\n  <div class=\"container\">\n      <div class=\"login-box ptb--100\">\n          <form [formGroup]=\"loginFormGroup\" (ngSubmit)=\"onSubmit()\">\n              <div class=\"login-form-head\">\n                  <h4>Đăng nhập</h4>\n              </div>\n              <div *ngIf=\"message\" class=\"alert alert-danger\" role=\"alert\">\n                <a  class=\"alert-link\">{{message}}</a>\n              </div>\n              <div class=\"login-form-body\">\n                  <div class=\"form-gp focused\">\n                      <label for=\"exampleInputEmail1\">Số điện thoại</label>\n                      <input type=\"text\" id=\"exampleInputEmail1\" formControlName=\"phone\">\n                      <i class=\"ti-agenda\"></i>\n                  </div>\n                  <!-- <div *ngIf=\"loginFormGroup.controls['phone'].hasError('required') && (loginFormGroup.controls['phone'].dirty || loginFormGroup.controls['phone'].touched)\"\n                        class=\"alert alert-danger\">\n                        Số điện thoại là bắt buộc\n                    </div>\n                    <div *ngIf=\"loginFormGroup.controls['phone'].hasError('pattern') && (loginFormGroup.controls['phone'].dirty || loginFormGroup.controls['phone'].touched)\"\n                        class=\"alert alert-danger\">\n                        Số điện thoại không đúng định dạng\n                    </div> -->\n                  <div class=\"form-gp focused\">\n                      <label for=\"exampleInputPassword1\">Mật khẩu</label>\n                      <input type=\"password\" id=\"exampleInputPassword1\" formControlName=\"password\">\n                      <i class=\"ti-lock\"></i>\n                  </div>\n                  <!-- <div *ngIf=\"loginFormGroup.get('password')?.errors?.required && (loginFormGroup.get('password').dirty || loginFormGroup.get('password').touched)\"\n                            class=\"alert alert-danger\">\n                            Mật khẩu là bắt buộc\n                        </div>\n                        <div *ngIf=\"loginFormGroup.get('password')?.errors?.minlength && (loginFormGroup.get('password').dirty || loginFormGroup.get('password').touched)\"\n                            class=\"alert alert-danger\">\n                            Mật khẩu phải nhiều hơn 8 ký tự\n                        </div> -->\n                  <div class=\"row mb-4 rmber-area\">\n                      <div class=\"col-6\">\n                          <div class=\"custom-control custom-checkbox mr-sm-2\">\n                              <input type=\"checkbox\" class=\"custom-control-input\" id=\"customControlAutosizing\">\n                              <label class=\"custom-control-label\" for=\"customControlAutosizing\">Nhớ tài khoản</label>\n                          </div>\n                      </div>\n                      <div class=\"col-6 text-right\">\n                          <a href=\"#\">Quên mật khẩu</a>\n                      </div>\n                  </div>\n                  <div class=\"submit-btn-area\">\n                      <button id=\"form_submit\" type=\"submit\" [disabled]=\"loginFormGroup.invalid\">Đăng nhập <i class=\"ti-arrow-right\"></i></button>\n                  </div>\n                  <div class=\"form-footer text-center mt-5\">\n                      <p class=\"text-muted\">Chưa có tài khoản<a routerLink=\"/register\">Đăng ký</a></p>\n                  </div>\n              </div>\n          </form>\n      </div>\n  </div>\n</div>"

/***/ }),

/***/ "./src/app/user/login/login.component.ts":
/*!***********************************************!*\
  !*** ./src/app/user/login/login.component.ts ***!
  \***********************************************/
/*! exports provided: LoginComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LoginComponent", function() { return LoginComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _service_user_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../service/user.service */ "./src/app/user/service/user.service.ts");
/* harmony import */ var _service_data_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../service/data.service */ "./src/app/user/service/data.service.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _service_authentication_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../service/authentication.service */ "./src/app/user/service/authentication.service.ts");







var LoginComponent = /** @class */ (function () {
    function LoginComponent(userService, fb, authenticationService, router, data) {
        this.userService = userService;
        this.fb = fb;
        this.authenticationService = authenticationService;
        this.router = router;
        this.data = data;
        this.message = "";
        this.roleDefault = 1;
        this.phonePattern = "((09|03|07|08|05)+([0-9]{8}))";
        if (this.authenticationService.currentUserValue) {
            this.router.navigate(['/']);
        }
    }
    LoginComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.data.currentUser.subscribe(function (user) { return _this.user = user; });
        this.loginFormGroup = this.fb.group({
            phone: this.fb.control((this.user) ? this.user.phone : "", _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].compose([
                _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required,
                _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].pattern(this.phonePattern)
            ])),
            password: this.fb.control((this.user) ? this.user.password : "", _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].compose([
                _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required,
                _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].minLength(8)
            ]))
        });
    };
    LoginComponent.prototype.onSubmit = function () {
        var _this = this;
        console.log(toUser(this.loginFormGroup.value));
        this.authenticationService
            .login(toUser(this.loginFormGroup.value))
            .subscribe(function (res) {
            var mess;
            mess = JSON.parse("" + res);
            if (mess.type == 1) {
                _this.message = mess.message;
            }
            if (mess.type == 0) {
                _this.message = mess.message;
            }
        }, function (err) {
            _this.message = "Có lỗi xảy ra";
            console.log(err);
        });
    };
    LoginComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-login',
            template: __webpack_require__(/*! ./login.component.html */ "./src/app/user/login/login.component.html"),
            styles: [__webpack_require__(/*! ./login.component.css */ "./src/app/user/login/login.component.css")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_service_user_service__WEBPACK_IMPORTED_MODULE_3__["UserService"],
            _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormBuilder"],
            _service_authentication_service__WEBPACK_IMPORTED_MODULE_6__["AuthenticationService"],
            _angular_router__WEBPACK_IMPORTED_MODULE_5__["Router"],
            _service_data_service__WEBPACK_IMPORTED_MODULE_4__["DataService"]])
    ], LoginComponent);
    return LoginComponent;
}());

function toUser(r) {
    var user = ({
        password: r.password,
        phone: r.phone
    });
    return user;
}


/***/ }),

/***/ "./src/app/user/models/role.ts":
/*!*************************************!*\
  !*** ./src/app/user/models/role.ts ***!
  \*************************************/
/*! exports provided: Role */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Role", function() { return Role; });
var Role;
(function (Role) {
    Role["Lanlord"] = "1";
    Role["Tenant"] = "2";
})(Role || (Role = {}));


/***/ }),

/***/ "./src/app/user/register/register.component.css":
/*!******************************************************!*\
  !*** ./src/app/user/register/register.component.css ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".login-form-body .alert.alert-danger{\r\n    padding : 0;\r\n    background: none;\r\n    color: red;\r\n    position: relative;\r\n    top: -20px;\r\n}\r\n.form-group.choose-role label{\r\n    color: #7e74ff;\r\n}\r\n#exampleFormControlSelect1{\r\n    padding:0;\r\n    border: 1px solid #7e74ff;\r\n}\r\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvdXNlci9yZWdpc3Rlci9yZWdpc3Rlci5jb21wb25lbnQuY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0lBQ0ksV0FBVztJQUNYLGdCQUFnQjtJQUNoQixVQUFVO0lBQ1Ysa0JBQWtCO0lBQ2xCLFVBQVU7QUFDZDtBQUNBO0lBQ0ksY0FBYztBQUNsQjtBQUNBO0lBQ0ksU0FBUztJQUNULHlCQUF5QjtBQUM3QiIsImZpbGUiOiJzcmMvYXBwL3VzZXIvcmVnaXN0ZXIvcmVnaXN0ZXIuY29tcG9uZW50LmNzcyIsInNvdXJjZXNDb250ZW50IjpbIi5sb2dpbi1mb3JtLWJvZHkgLmFsZXJ0LmFsZXJ0LWRhbmdlcntcclxuICAgIHBhZGRpbmcgOiAwO1xyXG4gICAgYmFja2dyb3VuZDogbm9uZTtcclxuICAgIGNvbG9yOiByZWQ7XHJcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XHJcbiAgICB0b3A6IC0yMHB4O1xyXG59XHJcbi5mb3JtLWdyb3VwLmNob29zZS1yb2xlIGxhYmVse1xyXG4gICAgY29sb3I6ICM3ZTc0ZmY7XHJcbn1cclxuI2V4YW1wbGVGb3JtQ29udHJvbFNlbGVjdDF7XHJcbiAgICBwYWRkaW5nOjA7XHJcbiAgICBib3JkZXI6IDFweCBzb2xpZCAjN2U3NGZmO1xyXG59Il19 */"

/***/ }),

/***/ "./src/app/user/register/register.component.html":
/*!*******************************************************!*\
  !*** ./src/app/user/register/register.component.html ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<!-- <div id=\"preloader\">\n  <div class=\"loader\"></div>\n</div> -->\n<!-- preloader area end -->\n<!-- login area start -->\n<div class=\"login-area\">\n    <div class=\"container\">\n        <div class=\"login-box ptb--100\">\n            <form [formGroup]=\"userFormGroup\" (ngSubmit)=\"onSubmit()\">\n                <div class=\"login-form-head\">\n                    <h4>Đăng ký</h4>\n                </div>\n                  <div *ngIf=\"message\" class=\"alert alert-danger\" role=\"alert\">\n                    <a  class=\"alert-link\">{{message}}</a>\n                  </div>\n                <div class=\"login-form-body\">\n                    <div class=\"form-gp focused\">\n                        <label for=\"exampleInputName1\">Họ và tên</label>\n                        <input type=\"text\" id=\"exampleInputName1\" formControlName=\"fullname\">\n                        <i class=\"ti-user\"></i>\n                    </div>\n                    <div *ngIf=\"userFormGroup.controls['fullname'].hasError('required') && (userFormGroup.controls['fullname'].dirty || userFormGroup.controls['fullname'].touched)\"\n                        class=\"alert alert-danger\">\n                        Bạn phải nhập họ và tên\n                    </div>\n                    <div *ngIf=\"userFormGroup.controls['fullname'].hasError('minlength') && (userFormGroup.controls['fullname'].dirty || userFormGroup.controls['fullname'].touched)\"\n                        class=\"alert alert-danger\">\n\n                    </div>\n                    <div class=\"form-gp focused\">\n                        <label for=\"exampleInputEmail1\">Số điện thoại</label>\n                        <input type=\"text\" id=\"exampleInputEmail1\" formControlName=\"phone\">\n                        <i class=\"ti-agenda\"></i>\n                    </div>\n\n                    <div *ngIf=\"userFormGroup.controls['phone'].hasError('required') && (userFormGroup.controls['phone'].dirty || userFormGroup.controls['phone'].touched)\"\n                        class=\"alert alert-danger\">\n                        Số điện thoại là bắt buộc\n                    </div>\n                    <div *ngIf=\"userFormGroup.controls['phone'].hasError('pattern') && (userFormGroup.controls['phone'].dirty || userFormGroup.controls['phone'].touched)\"\n                        class=\"alert alert-danger\">\n                        Số điện thoại không đúng định dạng\n                    </div>\n                    <div formGroupName=\"pw\">\n                        <div class=\"form-gp focused\">\n                            <label for=\"exampleInputPassword1\">Mật khẩu</label>\n                            <input type=\"password\" id=\"exampleInputPassword1\" formControlName=\"password\">\n                            <i class=\"ti-lock\"></i>\n                        </div>\n                        <div *ngIf=\"userFormGroup.get('pw.password')?.errors?.required && (userFormGroup.get('pw.password').dirty || userFormGroup.get('pw.password').touched)\"\n                            class=\"alert alert-danger\">\n                            Mật khẩu là bắt buộc\n                        </div>\n                        <div *ngIf=\"userFormGroup.get('pw.password')?.errors?.minlength && (userFormGroup.get('pw.password').dirty || userFormGroup.get('pw.password').touched)\"\n                            class=\"alert alert-danger\">\n                            Mật khẩu phải nhiều hơn 8 ký tự\n                        </div>\n                        <div class=\"form-gp focused\">\n                            <label for=\"exampleInputPassword2\">Nhập lại mật khẩu</label>\n                            <input type=\"password\" id=\"exampleInputPassword2\" formControlName=\"passwordConfirm\">\n                            <i class=\"ti-lock\"></i>\n                        </div>\n                        <div *ngIf=\"userFormGroup.hasError('passwordnotmatch', ['pw']) && (userFormGroup.get('pw').dirty || userFormGroup.get('pw').touched)\"\n                            class=\"alert alert-danger\">\n                            Mật khẩu phải trùng nhau\n                        </div>\n                    </div>\n                    <div class=\"form-group choose-role\">\n                        <label for=\"exampleFormControlSelect1\">Chọn chức năng</label>\n                        <select class=\"form-control\" id=\"exampleFormControlSelect1\" formControlName=\"role\" >\n                            <option value=\"1\">Chủ trọ</option>\n                            <option value=\"2\">Khách thuê</option>\n                        </select>\n                    </div>\n                    \n\n\n                    <div class=\"submit-btn-area\">\n                        <button id=\"form_submit\" type=\"submit\" [disabled]=\"userFormGroup.invalid\">Đăng ký <i\n                                class=\"ti-arrow-right\"></i></button>\n                    </div>\n                    <div class=\"form-footer text-center mt-5\">\n                        <p class=\"text-muted\">Đã có tài khoản <a routerLink=\"/login\">Đăng nhập</a></p>\n                    </div>\n                </div>\n            </form>\n        </div>\n    </div>\n</div>\n<!-- login area end -->"

/***/ }),

/***/ "./src/app/user/register/register.component.ts":
/*!*****************************************************!*\
  !*** ./src/app/user/register/register.component.ts ***!
  \*****************************************************/
/*! exports provided: RegisterComponent, passwordMatch */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RegisterComponent", function() { return RegisterComponent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "passwordMatch", function() { return passwordMatch; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _service_user_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../service/user.service */ "./src/app/user/service/user.service.ts");
/* harmony import */ var _service_data_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../service/data.service */ "./src/app/user/service/data.service.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");






var RegisterComponent = /** @class */ (function () {
    //passwordPattern = '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}';
    function RegisterComponent(userService, fb, data, router) {
        this.userService = userService;
        this.fb = fb;
        this.data = data;
        this.router = router;
        this.message = "";
        this.roleDefault = 1;
        this.phonePattern = "((09|03|07|08|05)+([0-9]{8}))";
    }
    RegisterComponent.prototype.ngOnInit = function () {
        this.userFormGroup = this.fb.group({
            pw: this.fb.group({
                passwordConfirm: this.fb.control('', _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].minLength(8)),
                password: this.fb.control('', _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].compose([
                    _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required,
                    _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].minLength(8)
                ])),
            }, {
                validator: passwordMatch
            }),
            role: [this.roleDefault],
            phone: this.fb.control('', _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].compose([
                _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required,
                _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].pattern(this.phonePattern)
            ])),
            fullname: this.fb.control('', _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required)
        });
    };
    RegisterComponent.prototype.onSubmit = function () {
        var _this = this;
        this.userService
            .register(toUser(this.userFormGroup.value))
            .subscribe(function (res) {
            var mess;
            mess = JSON.parse("" + res);
            console.log(mess);
            if (mess.type == 1) {
                _this.message = mess.message;
                _this.data.changeUser(toUser(_this.userFormGroup.value));
                _this.router.navigate(['/verify']);
            }
            if (mess.type == 0) {
                _this.message = mess.message;
            }
        }, function (err) {
            _this.message = "Có lỗi xảy ra";
            console.log(err);
        });
    };
    RegisterComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-register',
            template: __webpack_require__(/*! ./register.component.html */ "./src/app/user/register/register.component.html"),
            styles: [__webpack_require__(/*! ./register.component.css */ "./src/app/user/register/register.component.css")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_service_user_service__WEBPACK_IMPORTED_MODULE_3__["UserService"],
            _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormBuilder"],
            _service_data_service__WEBPACK_IMPORTED_MODULE_4__["DataService"],
            _angular_router__WEBPACK_IMPORTED_MODULE_5__["Router"]])
    ], RegisterComponent);
    return RegisterComponent;
}());

function passwordMatch(c) {
    var v = c.value;
    return (v.password === v.passwordConfirm) ? null : {
        passwordnotmatch: true
    };
}
function toUser(r) {
    var user = ({
        name: r.fullname,
        password: r.pw.password,
        role: r.role,
        phone: r.phone
    });
    return user;
}


/***/ }),

/***/ "./src/app/user/service/authentication.service.ts":
/*!********************************************************!*\
  !*** ./src/app/user/service/authentication.service.ts ***!
  \********************************************************/
/*! exports provided: AuthenticationService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AuthenticationService", function() { return AuthenticationService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../environments/environment */ "./src/environments/environment.ts");






var httpOptions = {
    headers: new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpHeaders"]({
        'Content-Type': 'application/json',
    }),
    withCredentials: true,
    responseType: 'text'
};
var AuthenticationService = /** @class */ (function () {
    function AuthenticationService(http) {
        this.http = http;
        this.baseUrl = _environments_environment__WEBPACK_IMPORTED_MODULE_5__["environment"].baseUrl;
        this.currentUserSubject = new rxjs__WEBPACK_IMPORTED_MODULE_3__["BehaviorSubject"](JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }
    Object.defineProperty(AuthenticationService.prototype, "currentUserValue", {
        get: function () {
            return this.currentUserSubject.value;
        },
        enumerable: true,
        configurable: true
    });
    AuthenticationService.prototype.login = function (user) {
        var _this = this;
        return this.http.post(this.baseUrl + "/api/login", user, httpOptions)
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["map"])(function (res) {
            //login successful if there's a jwt token in the response
            console.log(res);
            var resObject = JSON.parse(res);
            console.log(resObject.data);
            if (resObject && resObject.data) {
                var resDataObject = JSON.parse(resObject.data);
                console.log(typeof (resDataObject));
                if (resDataObject && resDataObject.token) {
                    //console.log(resObject);
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(resDataObject));
                    _this.currentUserSubject.next(resDataObject);
                }
            }
            // var saveUser : User = {
            //   phone : user.phone,
            //   token : res
            // };
            //console.log(res);
            // localStorage.setItem('currentUser', JSON.stringify(saveUser));
            return res;
        }));
    };
    AuthenticationService.prototype.logout = function () {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    };
    AuthenticationService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({ providedIn: 'root' }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"]])
    ], AuthenticationService);
    return AuthenticationService;
}());



/***/ }),

/***/ "./src/app/user/service/data.service.ts":
/*!**********************************************!*\
  !*** ./src/app/user/service/data.service.ts ***!
  \**********************************************/
/*! exports provided: DataService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DataService", function() { return DataService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");



var DataService = /** @class */ (function () {
    function DataService() {
        this.userSource = new rxjs__WEBPACK_IMPORTED_MODULE_2__["BehaviorSubject"](null);
        this.currentUser = this.userSource.asObservable();
    }
    DataService.prototype.changeUser = function (user) {
        this.userSource.next(user);
    };
    DataService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({
            providedIn: 'root'
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [])
    ], DataService);
    return DataService;
}());



/***/ }),

/***/ "./src/app/user/service/user.service.ts":
/*!**********************************************!*\
  !*** ./src/app/user/service/user.service.ts ***!
  \**********************************************/
/*! exports provided: UserService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UserService", function() { return UserService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../environments/environment */ "./src/environments/environment.ts");




var httpOptions = {
    headers: new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpHeaders"]({
        'Content-Type': 'application/json',
    }),
    withCredentials: true,
    responseType: 'text'
};
var UserService = /** @class */ (function () {
    function UserService(http) {
        this.http = http;
        this.baseUrl = _environments_environment__WEBPACK_IMPORTED_MODULE_3__["environment"].baseUrl;
    }
    UserService.prototype.register = function (user) {
        return this.http.post(this.baseUrl + "/api/register", user, httpOptions);
    };
    ;
    //after verify otp call this function
    UserService.prototype.submit = function (user) {
        return this.http.post(this.baseUrl + "/api/register/submit", user, httpOptions);
    };
    ;
    UserService.prototype.login = function (user) {
        return this.http.post(this.baseUrl + "/api/login", user, httpOptions);
    };
    ;
    UserService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({
            providedIn: 'root'
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"]])
    ], UserService);
    return UserService;
}());



/***/ }),

/***/ "./src/app/user/service/window.service.ts":
/*!************************************************!*\
  !*** ./src/app/user/service/window.service.ts ***!
  \************************************************/
/*! exports provided: WindowService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WindowService", function() { return WindowService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");


var WindowService = /** @class */ (function () {
    function WindowService() {
    }
    Object.defineProperty(WindowService.prototype, "windowRef", {
        get: function () {
            return window;
        },
        enumerable: true,
        configurable: true
    });
    WindowService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({
            providedIn: 'root'
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [])
    ], WindowService);
    return WindowService;
}());



/***/ }),

/***/ "./src/app/user/user.component.css":
/*!*****************************************!*\
  !*** ./src/app/user/user.component.css ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL3VzZXIvdXNlci5jb21wb25lbnQuY3NzIn0= */"

/***/ }),

/***/ "./src/app/user/user.component.html":
/*!******************************************!*\
  !*** ./src/app/user/user.component.html ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/user/user.component.ts":
/*!****************************************!*\
  !*** ./src/app/user/user.component.ts ***!
  \****************************************/
/*! exports provided: UserComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UserComponent", function() { return UserComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");


var UserComponent = /** @class */ (function () {
    function UserComponent() {
    }
    UserComponent.prototype.ngOnInit = function () {
    };
    UserComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-user',
            template: __webpack_require__(/*! ./user.component.html */ "./src/app/user/user.component.html"),
            styles: [__webpack_require__(/*! ./user.component.css */ "./src/app/user/user.component.css")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [])
    ], UserComponent);
    return UserComponent;
}());



/***/ }),

/***/ "./src/environments/environment.ts":
/*!*****************************************!*\
  !*** ./src/environments/environment.ts ***!
  \*****************************************/
/*! exports provided: environment */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "environment", function() { return environment; });
// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
var environment = {
    production: false,
    baseUrl: "http://ec2-54-255-244-234.ap-southeast-1.compute.amazonaws.com:8888/ebhouse"
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.


/***/ }),

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/platform-browser-dynamic */ "./node_modules/@angular/platform-browser-dynamic/fesm5/platform-browser-dynamic.js");
/* harmony import */ var _app_app_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app/app.module */ "./src/app/app.module.ts");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./environments/environment */ "./src/environments/environment.ts");




if (_environments_environment__WEBPACK_IMPORTED_MODULE_3__["environment"].production) {
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["enableProdMode"])();
}
Object(_angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_1__["platformBrowserDynamic"])().bootstrapModule(_app_app_module__WEBPACK_IMPORTED_MODULE_2__["AppModule"])
    .catch(function (err) { return console.error(err); });


/***/ }),

/***/ 0:
/*!***************************!*\
  !*** multi ./src/main.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! D:\FPT\ki9\capston\Frontend\ebhouse\src\main.ts */"./src/main.ts");


/***/ })

},[[0,"runtime","vendor"]]]);
//# sourceMappingURL=main.js.map