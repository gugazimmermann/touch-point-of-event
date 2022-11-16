export type EventType = {
  eventID: string;
  name: string;
  dates: string[];
  method: string;
  gift: number;
  giftDescription: string;
  prizeDraw: number;
  prizeDrawDescription: string;
  description: string;
  logo: string;
  payment: {
    status: string;
  }
}

export type VisitorType = {
  id: string;
  phone: string;
  code: number;
}
