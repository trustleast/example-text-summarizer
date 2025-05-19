"use client";

import { useState } from "react";
import { Button } from "./Button";
import { GenAITextFormatter } from "./GenAITextFormatter";

export const SummarizeForm = () => {
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(event.currentTarget.textarea.value);
    setProcessing(true);
    const response = fetch("http://localhost:8079/api/chat", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3.2:3b",
        messages: [
          {
            role: "user",
            content: `Please summarize the following text:\n${event.currentTarget.textarea.value}`,
          },
        ],
      }),
    });
    response
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        return response.json();
      })
      .then((data) => {
        setResult(data.message.content);
      })
      .finally(() => {
        setProcessing(false);
      });
  };

  return (
    <>
      {result === null && (
        <form onSubmit={handleSubmit}>
          <textarea
            className={
              processing
                ? "text-area vertical-resize gap-medium disabled"
                : "text-area vertical-resize gap-medium"
            }
            placeholder="To be or not to be..."
            name="textarea"
          ></textarea>

          <Button processing={processing} type="submit">
            Summarize
          </Button>
        </form>
      )}
      {result !== null && (
        <>
          <div className="gap-medium">
            <GenAITextFormatter content={result} />
          </div>
          <Button onClick={() => setResult(null)}>Clear</Button>
        </>
      )}
    </>
  );
};
