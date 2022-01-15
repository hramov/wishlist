import Logger from "../../modules/logger";

export function Timing(
  target: any,
  propertyKey: string | symbol,
  descriptor: PropertyDescriptor
) {
  const value = descriptor.value;
  descriptor.value = function (...args: any[]) {
    const start = Date.now();
    const result = value.apply(this, args);
    const elapsed = (Date.now() - start) / 1000; //sec.
    Logger.log("debug", `Function ${propertyKey as String} take ${elapsed} sec.`);
    return result;
  };
}
