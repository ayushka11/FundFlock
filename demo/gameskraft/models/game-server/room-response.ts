export interface RoomResponse {
    id?: string,
    nm?: string,
    gt?: string,
    sb?: number,
    bb?: number,
    xb?: number,
    yb?: number,
    se?: number,
    as?: number,
    pc?: number,
    ir?: boolean,
    ip?: boolean,
    ia?: boolean,
    ev?: boolean,
    kv: {
        ats?: boolean,
        pr?: boolean
    },
    od?: number,
    uf?: Array<string>
}