import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Subscription } from "rxjs";
import { AuthService } from "src/app/auth/auth.service";
import { Post } from "../post.model";
import { PostsService } from "../post.service";
import { mimeType } from "./mime-type.validator";

@Component({
  selector: "app-post-create",
  templateUrl: "./post-create.component.html",
  styleUrls: ["./post-create.component.css"],
})
export class PostCreateComponent implements OnInit, OnDestroy {
  constructor(
    public postsService: PostsService,
    public route: ActivatedRoute,
    private authService: AuthService
  ) {}
  enteredTitle = "";
  enteredContent = "";
  private mode = "create";
  private postId: string;
  public post: Post;
  isLoading = false;
  form: FormGroup;
  imagePreview: string | ArrayBuffer;
  private authStatusSub: Subscription;

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    console.log(file);
    this.form.patchValue({ image: file });
    this.form.get("image").updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);
  }

  onSavePost() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === "create") {
      this.postsService.addPost(
        this.form.value.title,
        this.form.value.ingredients,
        this.form.value.recipe,
        this.form.value.image
      );
      this.form.reset();
    } else {
      this.postsService.updatePost(
        this.postId,
        this.form.value.title,
        this.form.value.ingredients,
        this.form.value.recipe,
        this.form.value.image
      );
      this.form.reset();
    }
  }

  ngOnInit() {
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((authStatus) => {
        this.isLoading = false;
      });
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)],
      }),
      ingredients: new FormControl(null, { validators: [Validators.required] }),
      recipe: new FormControl(null, { validators: [Validators.required] }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType],
      }),
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("postId")) {
        this.mode = "edit";
        this.postId = paramMap.get("postId");
        this.isLoading = true;
        this.postsService.getPost(this.postId).subscribe((postData) => {
          this.isLoading = false;
          this.post = {
            _id: postData._id,
            title: postData.title,
            ingredients: postData.ingredients,
            recipe: postData.recipe,
            imagePath: postData.imagePath,
            creator: postData.creator,
          };
          this.form.setValue({
            title: this.post.title,
            ingredients: this.post.ingredients,
            recipe: this.post.recipe,
            image: this.post.imagePath,
          });
        });
      } else {
        this.mode = "create";
        this.postId = null;
      }
    });
  }
  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
