import request from "@/utils/request";

export interface PostsBody {
    includes: {
        users: User[];
        categories: Categorie[];
    };
    post: Post[];
    totalPostCount: number;
}
export interface PostBody {
    includes: {
        users: User[];
        categories: Categorie[];
        comments: PostComment[];
    };

    post: Post;
}
export interface Pagination {
    page?: string | number;
    pageSize?: string | number;
}
export interface PostsParams extends Pagination {
    postUserId?: User["id"];
    sort?: string | number;
    content?: string;
    categorieId?: string | number;
    sortField?: "createdDate" | "likeCount";
    sortType?: "asc" | "desc";
}

export interface PostParams {
    sortField?: "createdDate" | "likeCount";
    sortType?: "asc" | "desc";
    content?: string;
    page?: string | number;
    pageSize?: string | number;
}

export function getPosts(params: PostsParams) {
    return request.Get<InstanceBody<PostsBody>>(`post`, {
        params,
        name: "getPosts",
    });
}
// 获取帖子详情
export function getPost(id: string | number, params?: PostParams) {
    return request.Get<InstanceBody<PostBody>>(`post/${id}`, {
        params,
        name: "getPost",
    }).send(true);
}
// 帖子列表和帖子详情共享一个配置
export function getPostComments(id: string | number, params?: PostParams) {
    return request.Get<InstanceBody<PostBody>>(`post/${id}`, {
        params,
        name: "getComment",
    });
}

/**
 * @POST 点赞
 * @param id 帖子id
 */
export async function postLikeAPI(id: Post["id"], cancel?: boolean) {
    return await request.Get<InstanceBody>(
        `like/post/${id}`,
        {
            meta: {
                requiredLogin: true,
            },
            params: { cancel },
            hitSource: ["getMonfs", "getPosts"],
        },
    ).send(true);
}

export interface setPostParams {
    title: string;
    content: string;
    categoryId: (number | null)[];
    isMONFVote: boolean;
    headerImage?: string;
}

/**
 * @POST 发帖
 * @param title 帖子标题
 */
export function setPost(data: setPostParams) {
    return request.Post<InstanceBody<PostBody>>(
        "post/publish",
        data,
        {
            meta: {
                errorCode: {
                    62: "发帖失败,请选择正确的分区",
                },
            },
        },
    ).send(true);
}

/**
 * @POST 点赞评论
 * @param commentId 评论id
 */
export function postCommentLike(
    commentId: PostComment["id"],
    cancel?: boolean,
) {
    return request.Get<InstanceBody<PostComment>>(`like/comment/${commentId}`, {
        params: { cancel },
        meta: {
            requiredLogin: true,
        },
    });
}
/**
 * @POST 评论
 * @param postId 帖子id
 * @param content 内容
 * @param parentCommentId 回复id
 */
export function postComment(
    postId: Post["id"],
    content: string,
    parentCommentId?: string | number,
) {
    return request.Post<
        InstanceBody<{
            comment: PostComment;
            includes: {
                users: User[];
            };
        }>
    >(`/comment/publish`, {
        postId,
        content,
        parentCommentId,
    }, {
        meta: {
            requiredLogin: true,
        },
    }).send(true);
}
