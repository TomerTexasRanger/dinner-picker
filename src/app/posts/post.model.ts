export interface Post {
  _id: string;
  title: string;
  ingredients: string;
  recipe: string;
  imagePath: string | File;
  creator: string;
}
