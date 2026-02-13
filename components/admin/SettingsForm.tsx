"use client";

import { SettingsState, updateSettings } from "@/actions/settings";
import { SecretCard } from "@/components/admin/settings/SecretCard";
import { StatusCard } from "@/components/admin/settings/StatusCard";
import { Input } from "@/components/admin/ui/Input";
import { PageContainer } from "@/components/admin/ui/PageContainer";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { useToast } from "@/components/admin/ui/Toast";
import { settingsStateSchema } from "@/lib/validations";
import { Key as KeyIcon, Save, Shield } from "lucide-react";
import { useState, useTransition } from "react";

interface SettingsFormProps {
    initialSettings: SettingsState;
}

export function SettingsForm({ initialSettings }: SettingsFormProps) {
    const [isPending, startTransition] = useTransition();
    const [formData, setFormData] = useState<SettingsState>(initialSettings);
    const [success, setSuccess] = useState(false);
    const [activeTab, setActiveTab] = useState<"integrations" | "environment">("integrations");
    const { toast } = useToast();

    const handleChange = (key: keyof SettingsState, value: string) => {
        setFormData(prev => ({ ...prev, [key]: value }));
        setSuccess(false);
    };

    const handleSubmit = () => {
        // C2: Client-side validation using shared settings schema
        const validation = settingsStateSchema.safeParse(formData);
        if (!validation.success) {
             toast(`Validation Failed: ${validation.error.issues[0].message}`, "error");
            return;
        }

        startTransition(async () => {
            await updateSettings(formData);
            setSuccess(true);
            toast("Settings updated successfully", "success");
            setTimeout(() => setSuccess(false), 3000);
        });
    };

    return (
    <PageContainer>
            <PageHeader
                title="System Configuration"
                subtitle="Manage your secure credentials, API integrations, and environment status."
                actions={
                  <div className="flex gap-2 md:gap-3 w-full sm:w-auto">
                        <div className="bg-white/30 p-1 rounded-[8px] flex gap-1 backdrop-blur-md border border-white/10">
                            <button
                                onClick={() => setActiveTab("integrations")}
                                className={`px-3 py-1.5 rounded-[6px] text-xs font-bold transition-all ${activeTab === "integrations" ? "bg-white/20 text-white shadow-sm" : "text-white/40 hover:text-white"}`}
                            >
                                Integrations
                            </button>
                            <button
                                onClick={() => setActiveTab("environment")}
                                className={`px-3 py-1.5 rounded-[6px] text-xs font-bold transition-all ${activeTab === "environment" ? "bg-white/20 text-white shadow-sm" : "text-white/40 hover:text-white"}`}
                            >
                                Environment
                            </button>
                        </div>

                      <button 
                          onClick={handleSubmit}
                          disabled={isPending}
                          className="flex-1 sm:flex-initial px-3 py-1.5 md:px-6 md:py-2 rounded-[8px] bg-gold text-black font-bold text-[10px] md:text-sm hover:bg-white transition-colors flex items-center justify-center gap-1 md:gap-2 whitespace-nowrap disabled:opacity-50"
                      >
                          {isPending ? (
                              <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"/>
                          ) : (
                              <>
                                  <Save size={12} className="md:w-4 md:h-4" />
                                  {success ? "Saved!" : "Save Changes"}
                              </>
                          )}
                      </button>
                  </div>
                }
            />

            <div className="grid lg:grid-cols-3 gap-6">
                
                {/* Main Content */}
                <div className="lg:col-span-2 flex flex-col gap-6 min-w-0">
                    
                    {activeTab === "integrations" && (
                        <div className="flex flex-col gap-6">
                            {/* Vercel Section */}
                            <SecretCard 
                                title="Vercel OIDC Token" 
                                description="Required for Vercel remote caching and deployment triggers. Generate an OIDC token in your Vercel Project Settings > Security > Protection Bypass."
                                placeholder="vOidc_..."
                                value={formData.vercelOidcToken}
                                onChange={(val) => handleChange("vercelOidcToken", val)}
                                docsLink="https://vercel.com/docs/security/deployment-protection/methods-to-bypass-deployment-protection/protection-bypass-for-automation#oidc-token"
                                docsLabel="Vercel Docs"
                                isSaved={!!initialSettings.vercelOidcToken}
                            />

                            {/* Resend Section */}
                            <div className="flex flex-col gap-4">
                                <h3 className="text-white/60 font-bold text-xs uppercase tracking-widest pl-2 border-l-2 border-gold/50">Email Delivery</h3>
                                <SecretCard 
                                    title="Resend API Key" 
                                    description="Used for sending system emails (magic links, notifications). Get this from the API Keys section in your Resend dashboard."
                                    placeholder="re_..."
                                    value={formData.resendApiKey}
                                    onChange={(val) => handleChange("resendApiKey", val)}
                                    docsLink="https://resend.com/api-keys"
                                    docsLabel="Resend Console"
                                    isSaved={!!initialSettings.resendApiKey}
                                />
                                <div className="bg-white/30 dark:bg-white/5 border border-white/20 dark:border-white/10 rounded-[12px] p-4 md:p-6 backdrop-blur-md shadow-sm">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <Input 
                                            label="From Email"
                                            value={formData.resendFromEmail}
                                            onChange={e => handleChange("resendFromEmail", e.target.value)}
                                            placeholder="onboarding@resend.dev"
                                        />
                                        <Input 
                                            label="To Email (Admin)"
                                            value={formData.resendToEmail}
                                            onChange={e => handleChange("resendToEmail", e.target.value)}
                                            placeholder="admin@xinteck.com"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Cloudinary Section */}
                             <div className="flex flex-col gap-4">
                                <h3 className="text-white/60 font-bold text-xs uppercase tracking-widest pl-2 border-l-2 border-blue-500/50">Media Storage (Cloudinary)</h3>
                                
                                <SecretCard 
                                    title="Cloud Name" 
                                    description="Your unique cloud identifier. Used for building image URLs."
                                    placeholder="dyx..."
                                    value={formData.cloudinaryCloudName}
                                    onChange={(val) => handleChange("cloudinaryCloudName", val)}
                                    docsLink="https://console.cloudinary.com/settings"
                                    docsLabel="Cloudinary Settings"
                                    isSaved={!!initialSettings.cloudinaryCloudName}
                                />

                                <SecretCard 
                                    title="API Key" 
                                    description="Public API Key for signed uploads and management."
                                    placeholder="123456789..."
                                    value={formData.cloudinaryApiKey}
                                    onChange={(val) => handleChange("cloudinaryApiKey", val)}
                                    docsLink="https://console.cloudinary.com/settings/api-keys"
                                    docsLabel="API Keys"
                                    isSaved={!!initialSettings.cloudinaryApiKey}
                                />

                                <SecretCard 
                                    title="API Secret" 
                                    description="The master secret for signing upload requests. Keep this secure."
                                    placeholder="*************"
                                    value={formData.cloudinaryApiSecret}
                                    onChange={(val) => handleChange("cloudinaryApiSecret", val)}
                                    docsLink="https://console.cloudinary.com/settings/api-keys"
                                    docsLabel="API Keys"
                                    isSaved={!!initialSettings.cloudinaryApiSecret}
                                />
                             </div>
                        </div>
                    )}

                    {activeTab === "environment" && (
                        <div className="flex flex-col gap-4">
                             <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-[12px] flex gap-3 text-blue-200 text-xs leading-relaxed">
                                <Shield className="shrink-0" size={16} />
                                <p>These variables are set at the system level (e.g. Vercel Environment Variables or .env file). They cannot be changed here for security reasons. If any are missing, add them to your deployment configuration and redeploy.</p>
                             </div>

                             <StatusCard 
                                title="Primary Database" 
                                envKey="DATABASE_URL" 
                                isConfigured={!!formData.envStatus?.databaseUrl}
                                description="The main connection string for your PostgreSQL database. Must support connection pooling if using serverless."
                                docsLink="https://www.prisma.io/docs/orm/overview/databases/postgresql"
                             />

                             <StatusCard 
                                title="Encryption Master Key" 
                                envKey="ENCRYPTION_KEY" 
                                isConfigured={!!formData.envStatus?.encryptionKey}
                                description="A 32-character hex string used to encrypt all secrets in this database. If this key is lost, all secrets (above) become unrecoverable."
                                docsLink="https://generate-random.org/encryption-key-generator"
                                docsLabel="Generator"
                             />

                             <div className="grid md:grid-cols-2 gap-4">
                                <StatusCard 
                                    title="NextAuth Secret" 
                                    envKey="NEXTAUTH_SECRET" 
                                    isConfigured={!!formData.envStatus?.nextAuthSecret}
                                    description="Used to sign session cookies and JWTs. Critical for auth security."
                                    docsLink="https://next-auth.js.org/configuration/options#secret"
                                />
                                <StatusCard 
                                    title="Prisma Direct URL" 
                                    envKey="PRISMA_DATABASE_URL" 
                                    isConfigured={!!formData.envStatus?.prismaDatabaseUrl}
                                    description="Direct database connection for running migrations."
                                />
                             </div>
                        </div>
                    )}

                </div>

                {/* Sidebar */}
                <div className="flex flex-col gap-6">
                    <div className="bg-white/30 dark:bg-white/5 border border-white/20 dark:border-white/10 rounded-[10px] p-6 backdrop-blur-md flex flex-col gap-4 sticky top-24 shadow-sm">
                        <h3 className="font-bold text-white text-sm border-b border-white/10 pb-2">Encrypted Storage</h3>
                        
                        <div className="flex items-start gap-3">
                            <div className="mt-1 text-green-400">
                                <Shield size={16} />
                            </div>
                            <div>
                                <h4 className="font-bold text-white text-xs">AES-256-GCM</h4>
                                <p className="text-[10px] text-white/50 leading-relaxed mt-1">
                                    All secrets are encrypted at rest using industry-standard AES-256-GCM authenticated encryption. The initialization vector (IV) is stored with each secret.
                                </p>
                            </div>
                        </div>
                        
                        <div className="h-px bg-white/10 my-1" />

                        <div className="flex items-start gap-3">
                            <div className="mt-1 text-gold">
                                <KeyIcon size={16} /> 
                            </div>
                            <div>
                                <h4 className="font-bold text-white text-xs">Master Key Protection</h4>
                                <p className="text-[10px] text-white/50 leading-relaxed mt-1">
                                    Your <code>ENCRYPTION_KEY</code> is never stored in the database. It exists only in memory during runtime.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
    </PageContainer>
    );
}
