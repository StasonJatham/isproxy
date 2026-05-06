import React, { useState, useCallback } from 'react';
import { CopyIcon, CheckIcon } from '@/components/icons';

interface CodeBlockProps {
  code: string;
  label: string;
  language?: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code, label }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: silently fail
      setCopied(false);
    }
  }, [code]);

  return (
    <div className="group">
      <div className="flex items-center justify-between mb-2 px-1">
        <span className="text-xs font-medium text-text-muted uppercase tracking-wide">
          {label}
        </span>
        <button
          onClick={handleCopy}
          aria-label={copied ? 'Copied to clipboard' : 'Copy code'}
          className="
            flex items-center gap-1.5
            text-xs text-text-muted hover:text-text-secondary
            transition-colors duration-200
            px-2 py-1 rounded-md
            focus-visible:shadow-focus
          "
        >
          {copied ? (
            <>
              <CheckIcon size={14} className="text-success-green" />
              <span className="text-success-green">Copied!</span>
            </>
          ) : (
            <>
              <CopyIcon size={14} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <div className="code-block">
        <pre>
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
};

export default CodeBlock;
