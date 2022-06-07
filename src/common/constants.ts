import { EventType } from "../types/IEvent";

export const DEV_API = 'http://localhost:8080'

export const getTypeName = (type: EventType)=>{
    switch(type){
     case 0: return "Мероприятие";
     case 1: return "Аттракцион";
     case 2: return "Администрация";
     case 3: return "Спорт/активность";
   }
 }