import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';

// Purpose: Retrieve and validate the encryption key from environment variables, ensuring it meets AES-256 length requirements.
function getKey(): Buffer {
    const key = process.env.ENCRYPTION_KEY;
    if (!key) throw new Error("ENCRYPTION_KEY must be set in environment variables.");

    // Purpose: Support 64-char Hex strings (standard for keys) to allow for 32 bytes of entropy.
    if (key.length === 64 && /^[0-9a-fA-F]+$/.test(key)) {
        return Buffer.from(key, 'hex');
    }

    // Purpose: Support 32-char Raw strings for easier local development setup.
    if (key.length === 32) {
        return Buffer.from(key, 'utf8');
    }

    throw new Error(`Invalid ENCRYPTION_KEY length. Must be 32 characters (raw) or 64 characters (hex) for AES-256.`);
}

/*
Purpose: Encrypt sensitive data using AES-256-GCM.
Decision: GCM mode provides both confidentiality and integrity authentication (via auth tag).
*/
export function encrypt(text: string) {
    const keyBuffer = getKey();
    const iv = crypto.randomBytes(12); // Standard IV length for GCM
    const cipher = crypto.createCipheriv(ALGORITHM, keyBuffer, iv);

    /*
    Decision: Users previously provided keys in various formats. We abstract the key retrieval 
    to `getKey()` to handle both hex and utf8 consistency without cluttering this logic.
    */

    const ivHex = iv.toString('hex');
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const tag = cipher.getAuthTag().toString('hex');
    return `${ivHex}:${encrypted}:${tag}`;
}

/*
Purpose: Decrypt data ensuring integrity.
Decision: We parse the custom `iv:content:tag` format and authenticate the tag before decrypting to prevent tampering.
*/
export function decrypt(enc: string) {
    const keyBuffer = getKey();

    const [ivHex, encrypted, tagHex] = enc.split(':');
    if (!ivHex || !encrypted || !tagHex) throw new Error("Invalid encrypted format. Expected iv:content:tag");

    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv(ALGORITHM, keyBuffer, iv);

    decipher.setAuthTag(Buffer.from(tagHex, 'hex'));
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}


