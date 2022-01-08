export type ClientDto = {
    id?: ClientID,
    tgid: ClientTGID,
    username: Username,
    uuid?: string
}

export type ClientID = number;
export type ClientTGID = number;
export type Username = string;