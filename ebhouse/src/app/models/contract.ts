export class Contract{
    contractImg  ?: string;
    deposit?: string;
    description?: string;
    endDate?: string;
    cDate?: string;
    startDate?: string;
    id?: number;
    lstContractLog ?: [];
    lstContractTenant?: ContractTenant[];
    room ?:any;
    roomPrice ?:string;
    status ?: number;
  }
  export class Tenant{
    imgArnBack  ?: string;
    imgArnFront?: string;
    id?: number;
    user ?: User;
  }
  export class User{
    address  ?: string;
    name?: string;
    phone?: string;
    sex?: string;
    status?: string;
    token?: number;
    cDate?: string;
    dDate?: string;
    dateOfBirth?: number;
    flagLogin?: number;
    mDate?: string;  
    id?: number;
  }
  export class ContractTenant{
    isOwner  ?: number;
    status?: number;
    id?: number;
    tenant?:Tenant;
  }