import { BlocksApiClient } from "../api/blocks.js";
import { MediaApiClient } from "../api/media.js";
import { PagesApiClient } from "../api/pages.js";
import { PostsApiClient } from "../api/posts.js";
import { ShopAPI } from "../api/shop.js";
import { ThemeApiClient } from "../api/themes.js";
import { SiteConfig } from "../types.js";

export function getPostsClient(site: string, config: SiteConfig) {
  return new PostsApiClient(config);
}
export function getPagesClient(site: string, config: SiteConfig) {
  return new PagesApiClient(config);
}
export function getMediaClient(site: string, config: SiteConfig) {
  return new MediaApiClient(config);
}
export function getBlocksClient(site: string, config: SiteConfig) {
  return new BlocksApiClient(config);
}
export function getThemesClient(site: string, config: SiteConfig) {
  return new ThemeApiClient(config);
}
export function getShopClient(site: string, config: SiteConfig) {
  // ShopAPI expects a BaseApiClient and SecurityManager, but for demo, just pass ThemeApiClient
  return new ShopAPI(new ThemeApiClient(config), {} as any);
}
