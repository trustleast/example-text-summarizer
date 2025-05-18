import React, { ReactNode } from "react";
import { TextContent } from "../components/TextContent";

type Props = {
  content: string;
  disableGap?: boolean;
};

type TextChunk = {
  type: "text" | "list" | "header";
  gap: boolean;
  content: string;
};

export const GenAITextFormatter: React.FunctionComponent<Props> = ({
  content,
  disableGap,
}) => {
  const textChunks: TextChunk[] = getTextChunks(content);

  return textChunks.map((c) => {
    if (c.type === "list") {
      return (
        <ul key={c.content}>
          <li className="text">
            <TextContent
              gap={disableGap ? undefined : c.gap ? "medium" : undefined}
            >
              {c.content}
            </TextContent>
          </li>
        </ul>
      );
    }

    if (c.type === "header") {
      return (
        <TextContent
          size="large"
          key={c.content}
          gap={disableGap ? undefined : c.gap ? "medium" : undefined}
        >
          {c.content}
        </TextContent>
      );
    }

    return (
      <TextContent
        key={c.content}
        gap={disableGap ? undefined : c.gap ? "medium" : undefined}
      >
        {boldWords(c.content)}
      </TextContent>
    );
  });
};

function boldWords(content: string): ReactNode {
  return content.split(/\*\*([^*]+)\*\*/g).map((c, i) => {
    if (i % 2 === 0) {
      return c;
    }
    return <b key={c}>{c}</b>;
  });
}

function getTextChunks(content: string): TextChunk[] {
  const tokens = content.split(/(\n|\r|\s{2,})/).filter((c) => c.trim() !== "");
  const results: TextChunk[] = [];
  tokens.forEach((c, i) => {
    if (i == 0 && c.endsWith(":") && c.includes("summary")) {
      return;
    }
    if (c.startsWith("**") && c.endsWith("**")) {
      results.push({
        type: "header",
        gap: true,
        content: c.substring(2, c.length - 2),
      });
    } else if (c.startsWith("* ")) {
      results.push({
        type: "list",
        gap: false,
        content: c.substring(2),
      });
    } else {
      results.push({
        type: "text",
        gap: true,
        content: c,
      });
    }
  });

  return results;
}
