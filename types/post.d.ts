declare global {
    interface PostComment {
        id: number;
        postId: number;
        createdDate: string;
        createdUserId: User["id"];
        content: string;
        likeCount: number;
        isHidden: boolean;
        ReplyId: number;
        relations: {
            parentCommentId?: number;
            isLiked?: boolean;
            // subComments: PostComment[];
            subCommentIds?: number[];
        };
    }

    interface Post {
        commentCount: number;
        content: string;
        createdDate: string;
        createdUserId: User["id"];
        isHidden: boolean;
        likeCount: number;
        id: number | string;
        title: string;
        viewCount: number;
        introduction: string;
        monfVoteInfoId: string;
        headerImage?: string;
        in;
        relations: {
            MONFDetailVotedId?: number;
            MONFVoted?: boolean;
            categoryIds: number[];
            commentIds: [];
            commentEnd?: boolean;
            isLiked?: boolean;
            postLikeUserId: User["id"][];
        };
    }
}
export {};
