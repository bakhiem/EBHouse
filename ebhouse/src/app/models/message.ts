export enum CommonMessage {
  defaultErrMess  = "Có lỗi xảy ra, vui lòng thử lại sau",
  notChangeMess  = "Dữ liệu chưa được sửa đổi",
  inputAllFiel  = "Điền đủ các trường vào phần nhập phòng bắt đầu và kết thúc",
  toSmallerThanFrom = "Phòng bắt đầu phải nhỏ hơn phòng kết thúc",
  vaildatorInputProfile = "Vui lòng kiểm tra lại các thông tin cá nhân",
  errGetProfile = "Có lỗi xảy ra, không thể lấy được thông tin cá nhân"
  }
  export class Message {
    content : string;
    type : Number
  }
