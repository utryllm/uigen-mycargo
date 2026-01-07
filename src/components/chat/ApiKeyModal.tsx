'use client';

import { useState } from 'react';
import { Key, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react';
import { Modal, Button, Input, Select, Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui';
import { useSettingsStore } from '@/lib/store';
import { OPENAI_MODELS, ANTHROPIC_MODELS, type Provider } from '@/types/settings';

export function ApiKeyModal() {
  const {
    isApiKeyModalOpen,
    setIsApiKeyModalOpen,
    provider,
    setProvider,
    openaiKey,
    anthropicKey,
    setApiKey,
    model,
    setModel,
  } = useSettingsStore();

  const [showOpenAI, setShowOpenAI] = useState(false);
  const [showAnthropic, setShowAnthropic] = useState(false);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');

  const handleProviderChange = (newProvider: string) => {
    setProvider(newProvider as Provider);
  };

  const handleTestConnection = async () => {
    setTestStatus('testing');

    try {
      const response = await fetch('/api/validate-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider,
          apiKey: provider === 'openai' ? openaiKey : anthropicKey,
        }),
      });

      if (response.ok) {
        setTestStatus('success');
      } else {
        setTestStatus('error');
      }
    } catch {
      setTestStatus('error');
    }

    setTimeout(() => setTestStatus('idle'), 3000);
  };

  const currentModels = provider === 'openai' ? OPENAI_MODELS : ANTHROPIC_MODELS;
  const currentKey = provider === 'openai' ? openaiKey : anthropicKey;
  const showKey = provider === 'openai' ? showOpenAI : showAnthropic;
  const setShowKey = provider === 'openai' ? setShowOpenAI : setShowAnthropic;

  return (
    <Modal
      isOpen={isApiKeyModalOpen}
      onClose={() => setIsApiKeyModalOpen(false)}
      title="API Settings"
      size="md"
    >
      <div className="space-y-6">
        {/* Provider Selection */}
        <Tabs defaultValue={provider} onChange={handleProviderChange}>
          <TabsList className="w-full">
            <TabsTrigger value="openai" className="flex-1">OpenAI</TabsTrigger>
            <TabsTrigger value="anthropic" className="flex-1">Anthropic</TabsTrigger>
          </TabsList>

          <TabsContent value="openai">
            <div className="space-y-4">
              <div className="p-3 bg-[#F5F5F5] rounded-lg text-sm text-[#666666]">
                <p>Enter your OpenAI API key to use GPT models for UI generation.</p>
                <a
                  href="https://platform.openai.com/api-keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#0066CC] hover:underline"
                >
                  Get your API key →
                </a>
              </div>

              <div className="relative">
                <Input
                  label="OpenAI API Key"
                  type={showOpenAI ? 'text' : 'password'}
                  value={openaiKey || ''}
                  onChange={(e) => setApiKey('openai', e.target.value)}
                  placeholder="sk-..."
                />
                <button
                  type="button"
                  onClick={() => setShowOpenAI(!showOpenAI)}
                  className="absolute right-3 top-8 text-[#666666] hover:text-[#333333]"
                >
                  {showOpenAI ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="anthropic">
            <div className="space-y-4">
              <div className="p-3 bg-[#F5F5F5] rounded-lg text-sm text-[#666666]">
                <p>Enter your Anthropic API key to use Claude models for UI generation.</p>
                <a
                  href="https://console.anthropic.com/settings/keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#0066CC] hover:underline"
                >
                  Get your API key →
                </a>
              </div>

              <div className="relative">
                <Input
                  label="Anthropic API Key"
                  type={showAnthropic ? 'text' : 'password'}
                  value={anthropicKey || ''}
                  onChange={(e) => setApiKey('anthropic', e.target.value)}
                  placeholder="sk-ant-..."
                />
                <button
                  type="button"
                  onClick={() => setShowAnthropic(!showAnthropic)}
                  className="absolute right-3 top-8 text-[#666666] hover:text-[#333333]"
                >
                  {showAnthropic ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Model Selection */}
        <Select
          label="Model"
          value={model}
          onChange={(e) => setModel(e.target.value)}
          options={currentModels.map((m) => ({ value: m.id, label: m.name }))}
        />

        {/* Test Connection */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between pt-4 border-t border-[#E0E0E0] gap-3">
          <div className="flex items-center gap-2 min-h-[24px]">
            {testStatus === 'success' && (
              <>
                <CheckCircle className="w-5 h-5 text-[#28A745]" />
                <span className="text-sm text-[#28A745]">Connection successful!</span>
              </>
            )}
            {testStatus === 'error' && (
              <>
                <XCircle className="w-5 h-5 text-[#DC3545]" />
                <span className="text-sm text-[#DC3545]">Invalid API key</span>
              </>
            )}
          </div>

          <div className="flex gap-2 sm:gap-3">
            <Button
              variant="secondary"
              size="md"
              onClick={handleTestConnection}
              disabled={!currentKey || testStatus === 'testing'}
              isLoading={testStatus === 'testing'}
              className="flex-1 sm:flex-initial h-11"
            >
              <Key className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Test Connection</span>
              <span className="sm:hidden">Test</span>
            </Button>
            <Button size="md" onClick={() => setIsApiKeyModalOpen(false)} className="flex-1 sm:flex-initial h-11">
              Done
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
