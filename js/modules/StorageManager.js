/**
 * StorageManager.js
 * Handles all local storage operations with encryption and versioning
 */

export class StorageManager {
    constructor(config = {}) {
        this.config = {
            prefix: 'patricia_',
            version: '1.0.0',
            encrypt: false,
            compress: true,
            maxSize: 5 * 1024 * 1024, // 5MB limit
            ...config
        };
        
        this.storage = this.getAvailableStorage();
        this.cache = new Map();
        this.init();
    }
    
    init() {
        // Check storage availability and quota
        this.checkStorageQuota();
        
        // Clean up old/expired data
        this.cleanup();
        
        // Migrate old data if needed
        this.migrate();
    }
    
    getAvailableStorage() {
        // Check for available storage mechanisms
        try {
            // Prefer localStorage
            if (typeof localStorage !== 'undefined') {
                localStorage.setItem('__test', '1');
                localStorage.removeItem('__test');
                return localStorage;
            }
        } catch (e) {
            console.warn('localStorage not available:', e);
        }
        
        try {
            // Fallback to sessionStorage
            if (typeof sessionStorage !== 'undefined') {
                sessionStorage.setItem('__test', '1');
                sessionStorage.removeItem('__test');
                return sessionStorage;
            }
        } catch (e) {
            console.warn('sessionStorage not available:', e);
        }
        
        // Fallback to in-memory storage
        console.warn('Using in-memory storage (data will not persist)');
        return this.createMemoryStorage();
    }
    
    createMemoryStorage() {
        const storage = new Map();
        
        return {
            getItem: (key) => storage.get(key) || null,
            setItem: (key, value) => storage.set(key, value),
            removeItem: (key) => storage.delete(key),
            clear: () => storage.clear(),
            key: (index) => Array.from(storage.keys())[index],
            get length() { return storage.size; }
        };
    }
    
    set(key, value, options = {}) {
        try {
            const fullKey = this.getFullKey(key);
            
            // Create storage object with metadata
            const storageObject = {
                version: this.config.version,
                timestamp: Date.now(),
                expires: options.expires || null,
                data: value
            };
            
            // Serialize the data
            let serialized = JSON.stringify(storageObject);
            
            // Compress if enabled and beneficial
            if (this.config.compress && serialized.length > 1024) {
                serialized = this.compress(serialized);
                storageObject.compressed = true;
            }
            
            // Encrypt if enabled
            if (this.config.encrypt) {
                serialized = this.encrypt(serialized);
                storageObject.encrypted = true;
            }
            
            // Check size limit
            if (serialized.length > this.config.maxSize) {
                throw new Error(`Data exceeds maximum size limit of ${this.config.maxSize} bytes`);
            }
            
            // Store in localStorage
            this.storage.setItem(fullKey, serialized);
            
            // Update cache
            this.cache.set(key, value);
            
            return true;
            
        } catch (error) {
            console.error(`Failed to store data for key "${key}":`, error);
            
            // Handle quota exceeded error
            if (error.name === 'QuotaExceededError') {
                this.handleQuotaExceeded();
            }
            
            return false;
        }
    }
    
    get(key, defaultValue = null) {
        try {
            // Check cache first
            if (this.cache.has(key)) {
                return this.cache.get(key);
            }
            
            const fullKey = this.getFullKey(key);
            let data = this.storage.getItem(fullKey);
            
            if (!data) {
                return defaultValue;
            }
            
            // Decrypt if needed
            if (this.config.encrypt) {
                data = this.decrypt(data);
            }
            
            // Decompress if needed
            if (data.compressed) {
                data = this.decompress(data);
            }
            
            // Parse the data
            const storageObject = JSON.parse(data);
            
            // Check expiration
            if (storageObject.expires && Date.now() > storageObject.expires) {
                this.remove(key);
                return defaultValue;
            }
            
            // Check version compatibility
            if (storageObject.version !== this.config.version) {
                const migrated = this.migrateData(storageObject);
                if (!migrated) {
                    return defaultValue;
                }
            }
            
            // Update cache
            this.cache.set(key, storageObject.data);
            
            return storageObject.data;
            
        } catch (error) {
            console.error(`Failed to retrieve data for key "${key}":`, error);
            return defaultValue;
        }
    }
    
    remove(key) {
        try {
            const fullKey = this.getFullKey(key);
            this.storage.removeItem(fullKey);
            this.cache.delete(key);
            return true;
        } catch (error) {
            console.error(`Failed to remove data for key "${key}":`, error);
            return false;
        }
    }
    
    clear(prefix = null) {
        try {
            if (prefix) {
                // Clear only items with specific prefix
                const keys = this.getAllKeys();
                keys.forEach(key => {
                    if (key.startsWith(this.config.prefix + prefix)) {
                        this.storage.removeItem(key);
                    }
                });
            } else {
                // Clear all items with our prefix
                const keys = this.getAllKeys();
                keys.forEach(key => {
                    if (key.startsWith(this.config.prefix)) {
                        this.storage.removeItem(key);
                    }
                });
            }
            
            this.cache.clear();
            return true;
            
        } catch (error) {
            console.error('Failed to clear storage:', error);
            return false;
        }
    }
    
    has(key) {
        const fullKey = this.getFullKey(key);
        return this.storage.getItem(fullKey) !== null;
    }
    
    getAllKeys() {
        const keys = [];
        for (let i = 0; i < this.storage.length; i++) {
            const key = this.storage.key(i);
            if (key && key.startsWith(this.config.prefix)) {
                keys.push(key);
            }
        }
        return keys;
    }
    
    getSize() {
        let totalSize = 0;
        const keys = this.getAllKeys();
        
        keys.forEach(key => {
            const value = this.storage.getItem(key);
            if (value) {
                totalSize += key.length + value.length;
            }
        });
        
        return totalSize;
    }
    
    async checkStorageQuota() {
        if (navigator.storage && navigator.storage.estimate) {
            try {
                const estimate = await navigator.storage.estimate();
                const percentUsed = (estimate.usage / estimate.quota) * 100;
                
                if (percentUsed > 90) {
                    console.warn(`Storage quota nearly exceeded: ${percentUsed.toFixed(2)}% used`);
                    this.cleanup();
                }
                
                return {
                    usage: estimate.usage,
                    quota: estimate.quota,
                    percentUsed
                };
            } catch (error) {
                console.error('Failed to check storage quota:', error);
            }
        }
        
        return null;
    }
    
    cleanup() {
        try {
            const keys = this.getAllKeys();
            const now = Date.now();
            let cleaned = 0;
            
            keys.forEach(key => {
                try {
                    const data = this.storage.getItem(key);
                    if (data) {
                        const parsed = JSON.parse(data);
                        
                        // Remove expired items
                        if (parsed.expires && now > parsed.expires) {
                            this.storage.removeItem(key);
                            cleaned++;
                        }
                        
                        // Remove old version items
                        if (parsed.version && this.isOldVersion(parsed.version)) {
                            this.storage.removeItem(key);
                            cleaned++;
                        }
                    }
                } catch (e) {
                    // Remove corrupted data
                    this.storage.removeItem(key);
                    cleaned++;
                }
            });
            
            if (cleaned > 0) {
                console.log(`Cleaned up ${cleaned} expired/corrupted storage items`);
            }
            
        } catch (error) {
            console.error('Storage cleanup failed:', error);
        }
    }
    
    handleQuotaExceeded() {
        // Clear oldest items to make space
        const keys = this.getAllKeys();
        const items = [];
        
        keys.forEach(key => {
            try {
                const data = this.storage.getItem(key);
                const parsed = JSON.parse(data);
                items.push({
                    key,
                    timestamp: parsed.timestamp || 0,
                    size: data.length
                });
            } catch (e) {
                // Remove corrupted item
                this.storage.removeItem(key);
            }
        });
        
        // Sort by timestamp (oldest first)
        items.sort((a, b) => a.timestamp - b.timestamp);
        
        // Remove oldest 25% of items
        const toRemove = Math.ceil(items.length * 0.25);
        for (let i = 0; i < toRemove; i++) {
            this.storage.removeItem(items[i].key);
        }
        
        console.log(`Removed ${toRemove} old items to free up storage space`);
    }
    
    migrate() {
        // Handle data migration from old versions
        try {
            const migrationKey = `${this.config.prefix}migration_complete_${this.config.version}`;
            
            if (this.storage.getItem(migrationKey)) {
                return; // Migration already complete
            }
            
            // Perform migration logic here
            // Example: Update data structure, rename keys, etc.
            
            // Mark migration as complete
            this.storage.setItem(migrationKey, 'true');
            
        } catch (error) {
            console.error('Migration failed:', error);
        }
    }
    
    migrateData(storageObject) {
        // Implement version-specific migration logic
        // Return migrated data or false if migration fails
        return storageObject.data;
    }
    
    isOldVersion(version) {
        // Simple version comparison (you might want more sophisticated logic)
        return version < this.config.version;
    }
    
    getFullKey(key) {
        return `${this.config.prefix}${key}`;
    }
    
    // Simple compression using LZ-string algorithm (simplified version)
    compress(str) {
        // In production, use a proper compression library like lz-string
        // This is a placeholder that doesn't actually compress
        return JSON.stringify({ compressed: true, data: str });
    }
    
    decompress(str) {
        // In production, use a proper decompression library
        // This is a placeholder that doesn't actually decompress
        const parsed = JSON.parse(str);
        return parsed.data;
    }
    
    // Simple encryption (DO NOT use in production - use proper crypto library)
    encrypt(str) {
        // This is a placeholder - in production, use Web Crypto API or similar
        return btoa(str);
    }
    
    decrypt(str) {
        // This is a placeholder - in production, use Web Crypto API or similar
        return atob(str);
    }
    
    // Export data for backup
    exportData() {
        const data = {};
        const keys = this.getAllKeys();
        
        keys.forEach(key => {
            const shortKey = key.replace(this.config.prefix, '');
            data[shortKey] = this.get(shortKey);
        });
        
        return {
            version: this.config.version,
            timestamp: Date.now(),
            data
        };
    }
    
    // Import data from backup
    importData(backup) {
        try {
            if (!backup || !backup.data) {
                throw new Error('Invalid backup data');
            }
            
            Object.entries(backup.data).forEach(([key, value]) => {
                this.set(key, value);
            });
            
            return true;
            
        } catch (error) {
            console.error('Failed to import data:', error);
            return false;
        }
    }
    
    // Session-specific storage (doesn't persist)
    setSession(key, value) {
        if (typeof sessionStorage !== 'undefined') {
            sessionStorage.setItem(this.getFullKey(key), JSON.stringify(value));
        } else {
            this.cache.set(`session_${key}`, value);
        }
    }
    
    getSession(key, defaultValue = null) {
        if (typeof sessionStorage !== 'undefined') {
            const data = sessionStorage.getItem(this.getFullKey(key));
            return data ? JSON.parse(data) : defaultValue;
        } else {
            return this.cache.get(`session_${key}`) || defaultValue;
        }
    }
}

export default StorageManager;