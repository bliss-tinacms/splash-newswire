import React from 'react';
import type { TinaField } from 'tinacms';

type PermalinkKind = 'blog' | 'page';

export function slugifyPermalink(value?: string | null): string {
  if (!value || typeof value !== 'string') return '';
  let input = value.trim().toLowerCase();
  if (!input) return '';
  if (input.startsWith('http://') || input.startsWith('https://')) {
    input = input.split('/').slice(3).join('/');
  }
  input = input.split('?')[0].split('#')[0].replace(/\\/g, '/');
  input = input.replace(/^\/+|\/+$/g, '');
  if (input.startsWith('blog/')) input = input.slice(5);
  return input
    .split('/')
    .map((part) => part.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''))
    .filter(Boolean)
    .join('/');
}

function PermalinkUrlField(props: any) {
  const input = props?.input || {};
  const field = props?.field || {};
  const kind: PermalinkKind = field?.kind === 'page' ? 'page' : 'blog';
  const rawValue = String(input.value || '');
  const value = slugifyPermalink(rawValue);
  const previewPath = kind === 'blog'
    ? '/blog/' + (value || 'filename-slug') + '/'
    : '/' + (value || 'filename-slug') + '/';

  React.useEffect(() => {
    if (rawValue && rawValue !== value && typeof input.onChange === 'function') {
      input.onChange(value);
    }
  }, [rawValue, value]);

  const setValue = (next: string) => {
    const normalized = slugifyPermalink(next);
    if (typeof input.onChange === 'function') input.onChange(normalized);
  };

  return React.createElement(
    'div',
    {
      style: {
        border: '1px solid #bfdbfe',
        background: 'linear-gradient(180deg, #eff6ff 0%, #ffffff 100%)',
        borderRadius: '12px',
        padding: '14px',
        margin: '0 0 18px',
        boxShadow: '0 6px 14px rgba(37, 99, 235, 0.06)',
      },
    },
    React.createElement('div', {
      style: {
        fontSize: '11px',
        textTransform: 'uppercase',
        letterSpacing: '.12em',
        fontWeight: 800,
        color: '#1d4ed8',
        marginBottom: '8px',
      },
    }, 'PERMALINK / URL SLUG'),
    React.createElement('input', {
      name: input.name,
      value,
      onChange: (event: any) => setValue(event?.target?.value || ''),
      onBlur: (event: any) => {
        setValue(event?.target?.value || '');
        if (typeof input.onBlur === 'function') input.onBlur(event);
      },
      placeholder: 'my-custom-url',
      autoCapitalize: 'none',
      autoCorrect: 'off',
      spellCheck: false,
      style: {
        width: '100%',
        background: '#fff',
        border: '1px solid #dbe3ef',
        borderRadius: '8px',
        padding: '10px 11px',
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
        fontSize: '12px',
        color: '#334155',
        boxSizing: 'border-box',
        outline: 'none',
      },
    }),
    React.createElement('div', {
      style: {
        marginTop: '8px',
        background: '#fff',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        padding: '9px 11px',
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
        fontSize: '12px',
        color: '#14577a',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      },
      title: previewPath,
    }, previewPath),
    React.createElement('p', {
      style: { margin: '10px 0 0', color: '#64748b', fontSize: '12px', lineHeight: 1.45 },
    }, 'Type a URL slug. Spaces, uppercase letters, and punctuation are converted to lowercase dashes automatically.')
  );
}

export function permalinkField(kind: PermalinkKind): TinaField {
  return {
    name: 'permalink',
    label: 'Permalink / URL Slug',
    type: 'string',
    ui: { component: PermalinkUrlField },
    kind,
  } as TinaField & { kind: PermalinkKind };
}