import { PostsApiClient } from "../src/api/posts";
import { PostFilters, Post } from "../src/types/post";
import { SiteConfig } from "../src/types/config";

export async function getPosts({
  site,
  filters,
}: {
  site: SiteConfig;
  filters?: PostFilters;
}): Promise<Post[]> {
  const client = new PostsApiClient(site);
  return client.getPosts(filters);
}
