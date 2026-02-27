import { HighLevel } from '@cbnsndwch/ghl-sdk';

let _client: HighLevel | null = null;

/**
 * Initialize the HighLevel SDK client with a Private Integration token.
 */
export function initGhlClient(privateIntegrationToken: string): HighLevel {
    _client = new HighLevel({
        privateIntegrationToken
    });
    return _client;
}

/**
 * Get the initialized HighLevel SDK client. Throws if not initialized.
 */
export function getGhlClient(): HighLevel {
    if (!_client) {
        throw new Error(
            'GHL client not initialized. Call initGhlClient() first.'
        );
    }
    return _client;
}
