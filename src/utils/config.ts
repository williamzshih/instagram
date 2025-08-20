import "server-only";
import { PinataSDK } from "pinata";

export const pinata = new PinataSDK({
  pinataGateway: `${process.env.NEXT_PUBLIC_GATEWAY_URL}`,
  pinataJwt: `${process.env.PINATA_JWT}`,
});
