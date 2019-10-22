import UserCommentDto from "./userCommentDto";

export default interface CampgroundDto {
    name: string;
    image: string;
    description: string;
    author?: {
        id: string;
        username: string;
    };
    comments?: UserCommentDto[];
}