import { ToolSet } from "ai";
import { z } from "zod";
import {
  getPostsClient,
  getPagesClient,
  getMediaClient,
  getBlocksClient,
  getThemesClient,
  getShopClient,
} from "./clients.js";
import { SiteConfig } from "../types.js";

const siteConfigs: SiteConfig = {
  url: "https://example.com",
  username: "user",
  auth: "pass",
  authType: "basic",
};

export const tools: ToolSet = {
  wp_content__get_posts: {
    description: "Get a list of posts with optional filters.",
    inputSchema: z.object({
      site: z
        .string()
        .describe("Site alias (defaults to default_test)")
        .default("default_test"),
      filters: z.any().optional().describe("Optional filters for posts query"),
    }),
    execute: async ({ site, filters }) => {
      const client = getPostsClient(site, siteConfigs);
      return await client.getPosts(filters);
    },
  },
  wp_content__create_post: {
    description: "Create a new post.",
    inputSchema: z.object({
      site: z
        .string()
        .describe("Site alias (defaults to default_test)")
        .default("default_test"),
      data: z.any(),
    }),
    execute: async ({ site, data }) => {
      const client = getPostsClient(site, siteConfigs);
      return await client.createPost(data);
    },
  },
  wp_content__update_post: {
    description: "Update an existing post.",
    inputSchema: z.object({
      site: z.string().describe("Site alias"),
      id: z.number().describe("Post ID"),
      data: z.any().describe("Updated post data"),
    }),
    execute: async ({ site, id, data }) => {
      const client = getPostsClient(site, siteConfigs);
      return await client.updatePost(id, data);
    },
  },
  wp_content__delete_post: {
    description: "Delete a post.",
    inputSchema: z.object({
      site: z.string().describe("Site alias"),
      id: z.number().describe("Post ID"),
    }),
    execute: async ({ site, id }) => {
      const client = getPostsClient(site, siteConfigs);
      return await client.deletePost(id);
    },
  },
  wp_content__get_pages: {
    description: "Get a list of pages with optional filters.",
    inputSchema: z.object({
      site: z.string().describe("Site alias"),
      filters: z.any().optional().describe("Optional filters for pages query"),
    }),
    execute: async ({ site, filters }) => {
      const client = getPagesClient(site, siteConfigs);
      return await client.getPages(filters);
    },
  },
  wp_content__create_page: {
    description: "Create a new page.",
    inputSchema: z.object({
      site: z.string().describe("Site alias"),
      data: z.any().describe("Page data"),
    }),
    execute: async ({ site, data }) => {
      const client = getPagesClient(site, siteConfigs);
      return await client.createPage(data);
    },
  },
  wp_content__update_page: {
    description: "Update an existing page.",
    inputSchema: z.object({
      site: z.string().describe("Site alias"),
      id: z.number().describe("Page ID"),
      data: z.any().describe("Updated page data"),
    }),
    execute: async ({ site, id, data }) => {
      const client = getPagesClient(site, siteConfigs);
      return await client.updatePage(id, data);
    },
  },
  wp_content__delete_page: {
    description: "Delete a page.",
    inputSchema: z.object({
      site: z.string().describe("Site alias"),
      id: z.number().describe("Page ID"),
    }),
    execute: async ({ site, id }) => {
      const client = getPagesClient(site, siteConfigs);
      return await client.deletePage(id);
    },
  },
  wp_media__get_media: {
    description: "Get a list of media items with optional filters.",
    inputSchema: z.object({
      site: z.string().describe("Site alias"),
      filters: z.any().optional().describe("Optional filters for media query"),
    }),
    execute: async ({ site, filters }) => {
      const client = getMediaClient(site, siteConfigs);
      return await client.getMedia(filters);
    },
  },
  wp_media__upload: {
    description: "Upload a new media file.",
    inputSchema: z.object({
      site: z.string().describe("Site alias"),
      file: z.string().describe("File buffer (base64 or binary)"),
      filename: z.string().describe("Name of the file"),
      data: z.any().optional().describe("Optional media metadata"),
    }),
    execute: async ({ site, file, filename, data }) => {
      const client = getMediaClient(site, siteConfigs);
      // decode base64 if needed
      let base64 = file;
      if (file.startsWith("data:")) {
        base64 = file.split(",")[1];
      }
      const buf = Buffer.from(base64, "base64");
      return await client.uploadMedia(buf, filename, data);
    },
  },
  wp_media__update: {
    description: "Update media item metadata.",
    inputSchema: z.object({
      site: z.string().describe("Site alias"),
      id: z.number().describe("Media ID"),
      data: z.any().describe("Updated media metadata"),
    }),
    execute: async ({ site, id, data }) => {
      const client = getMediaClient(site, siteConfigs);
      return await client.updateMedia(id, data);
    },
  },
  wp_media__delete: {
    description: "Delete a media item.",
    inputSchema: z.object({
      site: z.string().describe("Site alias"),
      id: z.number().describe("Media ID"),
      force: z.boolean().optional().describe("Whether to bypass trash"),
    }),
    execute: async ({ site, id, force }) => {
      const client = getMediaClient(site, siteConfigs);
      return await client.deleteMedia(id, force);
    },
  },
  wp_content__get_blocks: {
    description: "Get a list of blocks with optional filters.",
    inputSchema: z.object({
      site: z.string().describe("Site alias"),
      filters: z.any().optional().describe("Optional filters for blocks query"),
    }),
    execute: async ({ site, filters }) => {
      const client = getBlocksClient(site, siteConfigs);
      return await client.getBlocks(filters);
    },
  },
  wp_content__create_block: {
    description: "Create a new block.",
    inputSchema: z.object({
      site: z.string().describe("Site alias"),
      data: z.any().describe("Block data"),
    }),
    execute: async ({ site, data }) => {
      const client = getBlocksClient(site, siteConfigs);
      return await client.createBlock(data);
    },
  },
  wp_content__update_block: {
    description: "Update an existing block.",
    inputSchema: z.object({
      site: z.string().describe("Site alias"),
      id: z.number().describe("Block ID"),
      data: z.any().describe("Updated block data"),
    }),
    execute: async ({ site, id, data }) => {
      const client = getBlocksClient(site, siteConfigs);
      return await client.updateBlock(id, data);
    },
  },
  wp_content__delete_block: {
    description: "Delete a block.",
    inputSchema: z.object({
      site: z.string().describe("Site alias"),
      id: z.number().describe("Block ID"),
    }),
    execute: async ({ site, id }) => {
      const client = getBlocksClient(site, siteConfigs);
      return await client.deleteBlock(id);
    },
  },
  wp_content__get_block_revisions: {
    description: "Get revisions of a block.",
    inputSchema: z.object({
      site: z.string().describe("Site alias"),
      id: z.number().describe("Block ID"),
    }),
    execute: async ({ site, id }) => {
      const client = getBlocksClient(site, siteConfigs);
      return await client.getBlockRevisions(id);
    },
  },
  wp_theme__list: {
    description: "Get a list of installed themes.",
    inputSchema: z.object({
      site: z.string().describe("Site alias"),
      filters: z.any().optional().describe("Optional filters for themes query"),
    }),
    execute: async ({ site, filters }) => {
      const client = getThemesClient(site, siteConfigs);
      return await client.getThemes(filters);
    },
  },
  wp_theme__get_active: {
    description: "Get the currently active theme.",
    inputSchema: z.object({
      site: z.string().describe("Site alias"),
    }),
    execute: async ({ site }) => {
      const client = getThemesClient(site, siteConfigs);
      return await client.getActiveTheme();
    },
  },
  wp_theme__activate: {
    description: "Activate a theme.",
    inputSchema: z.object({
      site: z.string().describe("Site alias"),
      stylesheet: z.string().describe("Theme stylesheet name"),
    }),
    execute: async ({ site, stylesheet }) => {
      const client = getThemesClient(site, siteConfigs);
      return await client.activateTheme(stylesheet);
    },
  },
  wp_theme__get_customization: {
    description: "Get theme customization settings.",
    inputSchema: z.object({
      site: z.string().describe("Site alias"),
    }),
    execute: async ({ site }) => {
      const client = getThemesClient(site, siteConfigs);
      return await client.getThemeCustomization();
    },
  },
  wp_theme__update_customization: {
    description: "Update theme customization settings.",
    inputSchema: z.object({
      site: z.string().describe("Site alias"),
      updates: z.any().describe("Customization updates to apply"),
    }),
    execute: async ({ site, updates }) => {
      const client = getThemesClient(site, siteConfigs);
      return await client.updateThemeCustomization(updates);
    },
  },
  wp_theme__get_custom_css: {
    description: "Get theme custom CSS.",
    inputSchema: z.object({
      site: z.string().describe("Site alias"),
    }),
    execute: async ({ site }) => {
      const client = getThemesClient(site, siteConfigs);
      return await client.getCustomCss();
    },
  },
  wp_theme__update_custom_css: {
    description: "Update theme custom CSS.",
    inputSchema: z.object({
      site: z.string().describe("Site alias"),
      css: z.string().describe("Custom CSS code"),
    }),
    execute: async ({ site, css }) => {
      const client = getThemesClient(site, siteConfigs);
      return await client.updateCustomCss(css);
    },
  },
  wp_shop__get_products: {
    description: "Get a list of products with optional filters.",
    inputSchema: z.object({
      site: z
        .string()
        .describe("Site alias (defaults to default_test)")
        .default("default_test"),
      filters: z
        .any()
        .optional()
        .describe("Optional filters for products query"),
    }),
    execute: async ({ site, filters }) => {
      const client = getShopClient(site, siteConfigs);
      return await client.getProducts(filters);
    },
  },
  wp_shop__get_orders: {
    description: "Get a list of orders with optional filters.",
    inputSchema: z.object({
      site: z
        .string()
        .describe("Site alias (defaults to default_test)")
        .default("default_test"),
      filters: z.any().optional().describe("Optional filters for orders query"),
    }),
    execute: async ({ site, filters }) => {
      const client = getShopClient(site, siteConfigs);
      return await client.getOrders(filters);
    },
  },
  wp_shop__get_sales: {
    description: "Get sales statistics with optional filters.",
    inputSchema: z.object({
      site: z
        .string()
        .describe("Site alias (defaults to default_test)")
        .default("default_test"),
      filters: z
        .any()
        .optional()
        .describe("Optional filters for sales statistics"),
    }),
    execute: async ({ site, filters }) => {
      const client = getShopClient(site, siteConfigs);
      return await client.getSalesStats(filters);
    },
  },
};
