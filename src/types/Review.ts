export type Review = {
  id: number;
  title: string;
  text: string;
  rating: string;
  created_at: string;
  movie: {
    title: string;
    image_url?: string;
  };
};