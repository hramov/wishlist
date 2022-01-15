import { ClientTGID } from "../client/types.client";

export interface WishDto {
    id?: number
    client_id?: ClientTGID,
    title?: string,
    price?: number,
    href?: string,
    img_url?: string
}

export type WishID = number;