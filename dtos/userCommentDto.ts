export default interface UserCommentDto {
    text: String;
    author: {
        id: string,
        username: string
    };
}