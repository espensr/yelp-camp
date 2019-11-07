import UserCommentDto from "./userCommentDto";

export default interface CampgroundDto {
    name: string;
    price?: string;
    image: string;
    description: string;
    location?: string;
    lat?: number;
    lng?: number;
    author?: {
        id: string;
        username: string;
    };
    comments?: UserCommentDto[];
}