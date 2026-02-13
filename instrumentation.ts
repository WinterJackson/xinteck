export async function register() {
    if (process.env.NEXT_RUNTIME === 'nodejs') {
        const { validateEnv } = await import('./lib/env');
        try {
            validateEnv();
            console.log('✅ Environment variables validated');
        } catch (e) {
            console.error('❌ Environment validation failed', e);
            // In strict mode, we might want to process.exit(1), 
            // but Next.js instrumentation runs in a specific context.
        }
    }
}
