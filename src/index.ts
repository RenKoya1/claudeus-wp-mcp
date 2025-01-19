#!/usr/bin/env node
import dotenv from 'dotenv';
import { McpServer } from './mcp/server.js';
import { loadSiteConfig } from './config/site-config.js';
import { PostsApiClient } from './api/posts.js';
import { PagesApiClient } from './api/pages.js';
import { MediaApiClient } from './api/media.js';
import { BlocksApiClient } from './api/blocks.js';
import { ThemeApiClient } from './api/themes.js';
import { ShopAPI } from './api/shop.js';
import { SecurityManager } from './security/SecurityManager.js';
import { SecurityConfig } from './types/security.js';
import { BaseApiClient } from './api/base-client.js';
import { registerTools } from './mcp/tools.js';

// Load environment variables
dotenv.config();

// Custom logger that ensures we only write to stderr for non-MCP communication
const log = {
    info: (...args: unknown[]) => console.error('\x1b[32m%s\x1b[0m', '[INFO]', ...args),
    error: (...args: unknown[]) => console.error('\x1b[31m%s\x1b[0m', '[ERROR]', ...args),
    debug: (...args: unknown[]) => console.error('\x1b[36m%s\x1b[0m', '[DEBUG]', ...args),
    warn: (...args: unknown[]) => console.error('\x1b[33m%s\x1b[0m', '[WARN]', ...args)
};

async function main() {
    try {
        // Load site configurations
        const siteConfig = await loadSiteConfig();
        log.info(`Loaded ${Object.keys(siteConfig).length} site configurations`);

        // Initialize API clients for each site
        const clients = new Map();
        for (const [alias, site] of Object.entries(siteConfig)) {
            try {
                // Initialize security manager for the site
                const securityConfig: SecurityConfig = {
                    requireExplicitConsent: true,
                    auditEnabled: true,
                    privacyControls: {
                        maskSensitiveData: true,
                        allowExternalDataSharing: false
                    }
                };
                const security = new SecurityManager(securityConfig);

                // Create base client for shop API
                const baseClient = new BaseApiClient(site);

                clients.set(alias, {
                    posts: new PostsApiClient(site),
                    pages: new PagesApiClient(site),
                    media: new MediaApiClient(site),
                    blocks: new BlocksApiClient(site),
                    themes: new ThemeApiClient(site),
                    shop: new ShopAPI(baseClient, security)
                });
                log.info(`Initialized API clients for site: ${alias}`);
            } catch (error) {
                log.error(`Failed to initialize API clients for site ${alias}:`, error);
                continue;
            }
        }

        if (clients.size === 0) {
            throw new Error('No valid API clients could be initialized');
        }

        // Initialize MCP server
        const mcpServer = new McpServer('claudeus-wp-mcp', '1.0.0');
        log.info('Initialized MCP server');

        // Register tools
        registerTools(mcpServer.getServer(), clients);
        log.info('Registered MCP tools');

        // Connect to transport based on environment
        const transportType = process.env.TRANSPORT_TYPE || 'stdio';
        const port = process.env.PORT ? parseInt(process.env.PORT) : 4000;
        const path = process.env.PATH || '/';

        if (transportType === 'stdio') {
            log.info('Starting server with stdio transport');
            await mcpServer.connectStdio();
        } else {
            log.info(`Starting server with SSE transport on port ${port}`);
            await mcpServer.connectSSE(port, path);
        }
    } catch (error) {
        if (error instanceof Error) {
            log.error('Failed to start server:', error.message);
            if (error.stack) {
                log.debug('Stack trace:', error.stack);
            }
        } else {
            log.error('Failed to start server:', String(error));
        }
        process.exit(1);
    }
}

// Handle uncaught errors
process.on('uncaughtException', (error) => {
    log.error('Uncaught exception:', error);
    process.exit(1);
});

process.on('unhandledRejection', (reason) => {
    log.error('Unhandled rejection:', reason);
    process.exit(1);
});

main();