"use client";

import { useState } from "react";
import { Button } from "./Button";
import { GenAITextFormatter } from "./GenAITextFormatter";
import { TextContent } from "./TextContent";

export function apiPath(path: string) {
  return process.env.NEXT_PUBLIC_API_BASE + path;
}

export const SummarizeForm = () => {
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string>("");
  const [result, setResult] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const credentials = new URLSearchParams(location.hash.substring(1)).get(
      "token"
    );
    event.preventDefault();
    setProcessing(true);
    const response = fetch(apiPath("/api/chat"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Redirect: "/",
        Authorization: credentials || "",
      },
      body: JSON.stringify({
        model: "cheapest",
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
        console.log(response);
        console.log("Redirect", response.headers.get("Location"));
        if (!response.ok) {
          const location = response.headers.get("Location");
          if (response.status === 401 && location) {
            window.location.href = location;
            return;
          }
          response.text().then((text) => {
            setError("The text was unable to be summarized: " + text);
          });
          return;
        }

        return response.json();
      })
      .then((data) => {
        setError("");
        setResult(data.message.content);
      })
      .finally(() => {
        setProcessing(false);
      });
  };

  return (
    <>
      {result === null && (
        <>
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
          {error !== "" && (
            <TextContent
              size="small"
              color="red"
              center
              style={{ marginTop: "1rem" }}
            >
              {error}
            </TextContent>
          )}
        </>
      )}
      {result !== null && (
        <>
          <div className="gap-medium">
            <GenAITextFormatter content={result} />
          </div>
          <Button onClick={() => setResult(null)}>
            Summarize something else
          </Button>
        </>
      )}
    </>
  );
};
