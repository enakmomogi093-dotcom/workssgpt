import React, { useState } from 'react';
import { marked, Tokens } from 'marked';
import { Copy, Check, Terminal, ExternalLink } from 'lucide-react';

interface MarkdownContentProps {
  content: string;
}

export const MarkdownContent: React.FC<MarkdownContentProps> = ({ content }) => {
  // Parse tokens using marked.lexer
  const tokens = React.useMemo(() => {
    try {
      return marked.lexer(content);
    } catch (e) {
      return [{ type: 'paragraph', text: content, raw: content }] as Tokens.Generic[];
    }
  }, [content]);

  return (
    <div className="space-y-3 leading-relaxed text-[14.5px] text-slate-200 break-words font-normal">
      {tokens.map((token, index) => (
        <RenderToken key={index} token={token} />
      ))}
    </div>
  );
};

const RenderToken: React.FC<{ token: Tokens.Generic }> = ({ token }) => {
  switch (token.type) {
    case 'heading': {
      const headingToken = token as Tokens.Heading;
      const Tag = `h${Math.min(headingToken.depth, 4)}` as 'h1' | 'h2' | 'h3' | 'h4';
      const sizeClasses = {
        1: 'text-xl sm:text-2xl font-bold text-white mt-6 mb-3 border-b border-white/[0.08] pb-2',
        2: 'text-lg sm:text-xl font-bold text-white mt-5 mb-2.5',
        3: 'text-base font-semibold text-slate-100 mt-4 mb-2',
        4: 'text-sm font-semibold text-indigo-300 mt-3 mb-1.5',
      }[headingToken.depth] || 'text-base font-semibold text-white mt-4 mb-2';

      return <Tag className={sizeClasses}><InlineRenderer text={headingToken.text} /></Tag>;
    }

    case 'paragraph': {
      const pToken = token as Tokens.Paragraph;
      return (
        <p className="text-slate-300 leading-relaxed">
          <InlineRenderer text={pToken.text} />
        </p>
      );
    }

    case 'code': {
      const codeToken = token as Tokens.Code;
      return <CodeBlock code={codeToken.text} lang={codeToken.lang} />;
    }

    case 'list': {
      const listToken = token as Tokens.List;
      if (listToken.ordered) {
        return (
          <ol className="list-decimal list-outside pl-5 space-y-1.5 text-slate-300 my-2">
            {listToken.items.map((item, i) => (
              <li key={i} className="pl-1">
                <InlineRenderer text={item.text} />
              </li>
            ))}
          </ol>
        );
      } else {
        return (
          <ul className="list-disc list-outside pl-5 space-y-1.5 text-slate-300 my-2">
            {listToken.items.map((item, i) => (
              <li key={i} className="pl-1">
                <InlineRenderer text={item.text} />
              </li>
            ))}
          </ul>
        );
      }
    }

    case 'blockquote': {
      const bqToken = token as Tokens.Blockquote;
      return (
        <blockquote className="border-l-2 border-indigo-500/80 bg-white/[0.02] pl-4 py-2 my-3 rounded-r-lg text-slate-300 italic">
          <InlineRenderer text={bqToken.text} />
        </blockquote>
      );
    }

    case 'table': {
      const tableToken = token as Tokens.Table;
      return (
        <div className="overflow-x-auto my-4 rounded-xl border border-white/[0.08] bg-black/30">
          <table className="w-full text-left text-xs text-slate-300 border-collapse">
            <thead className="bg-white/[0.04] text-slate-200 border-b border-white/[0.08]">
              <tr>
                {tableToken.header.map((cell, idx) => (
                  <th key={idx} className="p-3 font-semibold">
                    <InlineRenderer text={cell.text} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {tableToken.rows.map((row, rowIdx) => (
                <tr key={rowIdx} className="hover:bg-white/[0.02] transition-colors">
                  {row.map((cell, cellIdx) => (
                    <td key={cellIdx} className="p-3">
                      <InlineRenderer text={cell.text} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    case 'hr':
      return <hr className="border-white/[0.08] my-6" />;

    default:
      return <div className="text-slate-300"><InlineRenderer text={token.raw || ''} /></div>;
  }
};

const CodeBlock: React.FC<{ code: string; lang?: string }> = ({ code, lang }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('Failed to copy', e);
    }
  };

  const displayLang = lang || 'code';

  return (
    <div className="my-4 rounded-xl border border-white/[0.08] bg-[#0c0d14] overflow-hidden shadow-lg shadow-black/40">
      {/* Code Header Bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/[0.06] bg-white/[0.02]">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-indigo-400" />
          <span className="text-xs font-mono font-medium text-slate-400 lowercase">
            {displayLang}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] transition-all cursor-pointer active:scale-95"
          aria-label="Copy code"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-400" />
              <span>Copy Code</span>
            </>
          )}
        </button>
      </div>

      {/* Code Content */}
      <div className="p-4 overflow-x-auto text-[13px] font-mono leading-relaxed text-slate-200">
        <pre className="!bg-transparent !p-0 !m-0 whitespace-pre">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
};

// Inline helper for formatting bold, italic, code, links
const InlineRenderer: React.FC<{ text: string }> = ({ text }) => {
  if (!text) return null;

  // Split by inline code: `code`
  const codeParts = text.split(/(`[^`]+`)/g);

  return (
    <span>
      {codeParts.map((part, i) => {
        if (part.startsWith('`') && part.endsWith('`')) {
          const codeSnippet = part.slice(1, -1);
          return (
            <code
              key={i}
              className="px-1.5 py-0.5 mx-0.5 rounded-md bg-white/[0.08] border border-white/[0.08] text-indigo-300 font-mono text-[13px]"
            >
              {codeSnippet}
            </code>
          );
        }

        // Parse bold **text** and italic *text*
        return <FormatText key={i} text={part} />;
      })}
    </span>
  );
};

const FormatText: React.FC<{ text: string }> = ({ text }) => {
  // Regex to match **bold** or *italic* or [link](url)
  const tokens: React.ReactNode[] = [];
  let remaining = text;
  let keyIdx = 0;

  // Simple parser for standard bold / italic / links
  const regex = /(\*\*.*?\*\*|\*.*?\*|\[.*?\]\(.*?\))/g;
  const parts = remaining.split(regex);

  return (
    <>
      {parts.map((p, idx) => {
        if (p.startsWith('**') && p.endsWith('**')) {
          return <strong key={idx} className="font-semibold text-white">{p.slice(2, -2)}</strong>;
        }
        if (p.startsWith('*') && p.endsWith('*')) {
          return <em key={idx} className="italic text-slate-200">{p.slice(1, -1)}</em>;
        }
        const linkMatch = p.match(/^\[(.*?)\]\((.*?)\)$/);
        if (linkMatch) {
          return (
            <a
              key={idx}
              href={linkMatch[2]}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2 inline-flex items-center gap-0.5"
            >
              {linkMatch[1]}
              <ExternalLink className="w-3 h-3 inline ml-0.5 opacity-70" />
            </a>
          );
        }
        return p;
      })}
    </>
  );
};
