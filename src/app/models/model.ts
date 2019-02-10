export interface Todo {
  userId: number,
  id: number,
  title: string,
  completed: boolean
}

export enum TodoFilters {
  SHOW_ALL,
  SHOW_COMPLETED,
  SHOW_TODO
}

type Email = '';

type Phone = '';

type Website = '';

export interface User   {
  id: number,
  name: string,
  username: string,
  email: Email,
  address : Address
  geo: GeoLocation,
  phone: Phone,
  website: Website,
  company: Company
}

export interface Company {
  name: string,
  catchPhrase: string,
  bs: string
}

export interface Address {
  street: string,
  suite: string,
  city: string,
  zipcode: string,
  geo: GeoLocation
}

export interface GeoLocation {
  lat: number,
  lng: number
}