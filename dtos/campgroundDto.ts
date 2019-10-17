import UserCommentDto from "./userCommentDto";

export default interface CampgroundDto {
    name: string;
    image: string;
    description: string;
    comments?: UserCommentDto[];
}