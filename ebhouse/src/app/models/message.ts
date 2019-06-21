export enum CommonMessage {
  defaultErrMess  = "Có lỗi xảy ra, vui lòng thử lại sau",
  notChangeMess  = "Dữ liệu chưa được sửa đổi",
  inputAllFiel  = "Điền đủ các trường vào phần nhập phòng bắt đầu và kết thúc",
  toSmallerThanFrom = "Phòng bắt đầu phải nhỏ hơn phòng kết thúc"
  }
  export class Message {
    content : string;
    type : Number
  }