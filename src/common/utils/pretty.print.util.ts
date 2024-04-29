import { inspect } from 'util';

export const prettyPrint = (obj: any) => console.log(inspect(obj, false, null, true));
