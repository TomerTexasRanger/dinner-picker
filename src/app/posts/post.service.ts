import { Injectable } from "@angular/core";
import { Post } from "./post.model";
import { Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { environment } from "../../environments/environment";

const BACKEND_URL = environment.apiUrl;

@Injectable({ providedIn: "root" })
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{ posts: Post[]; postCount: number }>();
  constructor(private http: HttpClient, private router: Router) {}

  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    this.http
      .get<{ msg: string; posts: Post[]; maxPosts: number }>(
        `${BACKEND_URL}/posts` + queryParams
      )
      .subscribe((postData) => {
        this.posts = postData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: postData.maxPosts,
        });
      });
  }

  getPostUpdatedListener() {
    return this.postsUpdated.asObservable();
  }
  getPost(id: string) {
    return this.http.get<{
      _id: string;
      title: string;
      content: string;
      imagePath: string;
      creator: string;
    }>(`${BACKEND_URL}/posts/${id}`);
  }
  addPost(title: string, content: string, image: File) {
    const postData = new FormData();

    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", image, title);

    this.http
      .post<{ msg: string; post: Post }>(`${BACKEND_URL}/posts`, postData)
      .subscribe((responseData) => {
        this.router.navigate(["/"]);
      });
  }

  updatePost(
    _id: string,
    title: string,
    content: string,
    image: File | string
  ) {
    console.log(image);
    let postData: Post | FormData;
    if (typeof image === "object") {
      postData = new FormData();
      postData.append("_id", _id);
      postData.append("title", title);
      postData.append("content", content);
      postData.append("image", image, title);
      console.log(postData);
    } else {
      postData = {
        _id,
        title,
        content,
        imagePath: image,
        creator: null,
      };
      console.log(postData);
    }
    try {
      this.http
        .put<{ msg: string; post: Post }>(
          `${BACKEND_URL}/posts/${_id}`,
          postData
        )
        .subscribe((response) => {
          this.router.navigate(["/"]);
        });
    } catch (error) {
      console.log(error.message);
    }
  }

  deletePost(id: string) {
    return this.http.delete(`http://localhost:3000/api/posts/${id}`);
  }
}
