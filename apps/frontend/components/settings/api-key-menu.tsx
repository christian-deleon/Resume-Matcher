'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { fetchLlmApiKey, updateLlmApiKey } from '@/lib/api/config';
import { ChevronDown } from 'lucide-react';
import { useTranslations } from '@/lib/i18n';

type Status = 'idle' | 'loading' | 'saving' | 'saved' | 'error';

const MASK_THRESHOLD = 6;

export default function ApiKeyMenu(): React.ReactElement {
  const { t } = useTranslations();
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<Status>('loading');
  const [apiKey, setApiKey] = useState('');
  const [draft, setDraft] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const value = await fetchLlmApiKey();
        if (cancelled) return;
        setApiKey(value);
        setDraft(value);
        setStatus('idle');
      } catch (err) {
        console.error('Failed to load LLM API key', err);
        if (!cancelled) {
          setError(t('settings.apiKeyMenu.loadError'));
          setStatus('error');
        }
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [t]);

  const maskedKey = useMemo(() => {
    if (!apiKey) return t('settings.statusValues.notSet');
    if (apiKey.length <= MASK_THRESHOLD) return apiKey;
    return `${apiKey.slice(0, MASK_THRESHOLD)}••••`;
  }, [apiKey, t]);

  const handleToggle = () => {
    setIsOpen((prev) => {
      const next = !prev;
      if (!prev) {
        setDraft(apiKey);
        setError(null);
      }
      return next;
    });
  };

  const handleSave = async () => {
    setStatus('saving');
    setError(null);
    try {
      const trimmed = draft.trim();
      const saved = await updateLlmApiKey(trimmed);
      setApiKey(saved);
      setDraft(saved);
      setStatus('saved');
      setTimeout(() => setStatus('idle'), 1800);
    } catch (err) {
      console.error('Failed to update LLM API key', err);
      setError((err as Error).message || t('settings.apiKeyMenu.updateError'));
      setStatus('error');
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setDraft(apiKey);
    setError(null);
  };

  return (
    <div className="relative text-sm">
      <button
        type="button"
        onClick={handleToggle}
        className="inline-flex items-center gap-2 border border-foreground bg-primary/20 px-3 py-2 text-foreground transition hover:bg-primary/40"
      >
        <span className="font-semibold">{t('settings.apiKeyMenu.buttonLabel')}</span>
        <span className="text-xs text-muted-foreground">{maskedKey}</span>
        <ChevronDown className="h-4 w-4" />
      </button>
      {isOpen ? (
        <>
          <div className="fixed inset-0 z-40" onClick={handleClose} aria-hidden="true" />
          <div className="absolute right-0 z-50 mt-2 w-80 border border-foreground bg-card p-4 shadow-sw-card">
            <h3 className="text-base font-semibold text-foreground mb-2">
              {t('settings.apiKeyMenu.title')}
            </h3>
            <p className="text-xs text-muted-foreground mb-3">
              {t('settings.apiKeyMenu.description')}
            </p>
            <label htmlFor="llmKey" className="text-xs font-medium text-foreground">
              {t('settings.apiKey')}
            </label>
            <input
              id="llmKey"
              type="text"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder={t('settings.llmConfiguration.apiKeyPlaceholder')}
              className="mt-1 w-full border border-foreground bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
            {error ? <p className="mt-2 text-xs text-red-400">{error}</p> : null}
            <div className="mt-4 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={handleClose}
                className="border border-foreground px-3 py-2 text-xs font-semibold text-foreground hover:bg-accent"
              >
                {t('common.cancel')}
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={status === 'saving'}
                className={`px-4 py-2 text-xs font-semibold transition ${
                  status === 'saving'
                    ? 'bg-primary/40 text-primary-foreground cursor-wait'
                    : 'bg-primary text-primary-foreground hover:bg-primary/80'
                }`}
              >
                {status === 'saving' ? t('common.saving') : t('common.save')}
              </button>
            </div>
            {status === 'saved' ? (
              <p className="mt-2 text-xs text-green-400">{t('settings.apiKeyMenu.savedMessage')}</p>
            ) : null}
          </div>
        </>
      ) : null}
    </div>
  );
}
