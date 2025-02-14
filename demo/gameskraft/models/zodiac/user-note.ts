export interface GetUserNotesRequest {
    referenceUserIds: string[];
}

export interface GetUserNotesPayload {
    reference_user_ids: string[];
}

export interface CreateUserNoteRequest {
    referenceUserId: string;
    note: string;
    colorId: number;
}

export interface CreateUserNoteRequestV2 {
    referenceUser: ReferenceUser;
    note: string;
    colorId: number;
}

export interface ReferenceUser {
    userId:number,
    vendorId:number
}

export interface CreateUserNotePayload {
    reference_user_id: string;
    note: string;
    color_id: number;
}

export interface UserNoteResponse {
    data: UserNote;
}

export interface UserNotesResponse {
    data: Array<UserNote>;
}

export interface UserNote {
    user_id: string;
    created_at: string;
	updated_at: string;
	reference_user_id: string;
    note: string;
    color_id: number | null;
    color_name: string | null;
    color_key: string | null;
    color_hex_code: string | null;
    color_tag: string | null;
}

export interface IUserNotes {
    createdAt: string;
	updatedAt: string;
    note: string;
    colorId: number | null;
    colorName: string | null;
    colorKey: string | null;
    colorHexCode: string | null;
    colorTag: string | null;
    displayPicture: string;
}

export interface IUserNotesV2 {
    createdAt: string;
	updatedAt: string;
    note: string;
    colorId: number | null;
    colorName: string | null;
    colorKey: string | null;
    colorHexCode: string | null;
    colorTag: string | null; 
}

export interface IUserNote {
    userId: string;
    createdAt: string;
	updatedAt: string;
	referenceUserId: string;
    note: string;
    colorId: number | null;
    colorName: string | null;
    colorKey: string | null;
    colorHexCode: string | null;
    colorTag: string | null;
}

export interface UserNoteColorsResponse {
    user_id: number;
    gameplay_note_colors: Array<UserNoteColor>
}

export interface UserNoteColor {
    id: number;
    color_name: string;
    color_key: string;
    color_hex_code: string;
    color_tag: string;
    is_color_tag_editable: boolean;
}

export interface IUserNoteColor {
    colorId: number;
    colorName: string;
    colorKey: string;
    colorHexCode: string;
    colorTag: string;
    isColorTagEditable: boolean;
}

export interface UpdateUserNoteColorRequest {
    colorId: number;
    colorTag: string;
}

export interface UpdateUserNoteColorPayload {
    color_id: number;
    color_tag: string;
}