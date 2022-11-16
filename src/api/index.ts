import axios from "axios";
import { EventType } from "../types";
import { VisitorType } from "../types/index";

const API_URL = process.env.REACT_APP_API || "";

const AxiosInstance = axios.create({ baseURL: API_URL });

export const getEvent = async (eventID: string): Promise<EventType> => {
  const { data } = await AxiosInstance.get(`/poe/${eventID}`);
  return data.data;
};

export const postPhone = async (
  eventID: string,
  phone: string
): Promise<VisitorType> => {
  const { data } = await AxiosInstance.post("/poe/phone", {
    eventID,
    phone,
  });
  return data.data;
};

export const postCode = async (
  visitorID: string,
  eventID: string,
  phone: string,
  code: number
): Promise<VisitorType> => {
  const { data } = await AxiosInstance.post("/poe/code", {
    visitorID,
    eventID,
    phone,
    code
  });
  return data.data;
};
