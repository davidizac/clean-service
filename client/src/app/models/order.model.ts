import { IProduct } from './pressing.model';

export class Order {
  _id: string;
  user: any;
  products: Array<IProduct | string>;
  status: 'NEW' | 'PICKUP' | 'CLEANING' | 'DROPOFF';
  dropOffAddress: string;
  pickUpAddress: string;
  pickUpDate: any;
  dropOffDate: any;
  comment: string;
  addressDetails?: string;
  addressDetails2?: string;
  displayedId: string;
  price: string;
  phoneNumber: string;
  pressing:any

  constructor(orderData = {} as Order) {
    const {
      _id,
      products,
      status,
      dropOffAddress,
      dropOffDate,
      pickUpAddress,
      pickUpDate,
      comment,
      addressDetails,
      displayedId,
      user,
      price,
      addressDetails2,
      phoneNumber,
      pressing
    } = orderData;
    this._id = _id;
    this.products = products;
    this.status = status;
    this.dropOffAddress = dropOffAddress;
    this.dropOffDate = dropOffDate;
    this.pickUpAddress = pickUpAddress;
    this.pickUpDate = pickUpDate;
    this.comment = comment;
    this.addressDetails = addressDetails;
    this.displayedId = displayedId;
    this.user = user;
    this.price = price;
    this.addressDetails2 = addressDetails2;
    this.phoneNumber = phoneNumber;
    this.pressing = pressing
  }
}
