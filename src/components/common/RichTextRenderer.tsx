import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { BLOCKS, MARKS, type Document } from "@contentful/rich-text-types";
import type { ReactNode } from "react";

interface RichTextProps {
  content: Document | string;
  className?: string;
}

export function RichTextRenderer({ content, className }: RichTextProps): ReactNode {
  if (typeof content === "string") {
    return <p className={className}>{content}</p>;
  }

  const options = {
    renderMark: {
      [MARKS.BOLD]: (text: ReactNode) => (
        <strong className="font-bold text-midnight-violet-900">{text}</strong>
      ),
      [MARKS.ITALIC]: (text: ReactNode) => <em className="italic">{text}</em>,
    },
    renderNode: {
      [BLOCKS.PARAGRAPH]: (_node: unknown, children: ReactNode) => (
        <p className={`mt-2 text-midnight-violet-700 leading-relaxed ${className ?? ""}`}>
          {children}
        </p>
      ),
    },
  };

  return <>{documentToReactComponents(content, options)}</>;
}