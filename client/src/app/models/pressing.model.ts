import { CATEGORIES } from '../constant';

export class Pressing {
  _id: string;
  name: string;
  address: string;
  area: string;
  phoneNumber: string;
  latitude: string;
  longitude: string;
  products: Array<IProduct>;

  constructor(pressingData = {} as Pressing) {
    const {
      name,
      address,
      area,
      phoneNumber,
      products,
      latitude,
      longitude,
      _id,
    } = pressingData;
    this.name = name;
    this.address = address;
    this.area = area;
    this.phoneNumber = phoneNumber;
    this.products = products;
    this.latitude = latitude;
    this.longitude = longitude;
    this._id = _id;
  }
}

export interface IProduct {
  _id: string;
  name: string;
  price: string;
  category: CATEGORIES;
}
