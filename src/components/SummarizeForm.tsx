"use client";

import { useEffect, useState } from "react";
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
  const [textArea, setTextArea] = useState<string>("");
  const [credentials, setCredentials] = useState<string>("");

  const handleSubmit = async (text: string, credentials: string) => {
    setProcessing(true);
    const response = await fetch(apiPath("/api/chat"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Redirect: "/",
        Authorization: credentials,
      },
      body: JSON.stringify({
        model: "cheapest",
        messages: [
          {
            role: "user",
            content: `Please summarize the following text:\n${text}`,
          },
        ],
      }),
    });
    setProcessing(false);
    console.log(response);
    if (!response.ok) {
      const location = response.headers.get("Location");
      if (response.status === 401 && location) {
        console.log("Redirecting to", location);

        // Store the current textarea in local storage to be restored after login
        localStorage.setItem("textarea", text);

        window.location.href = location;
      } else {
        const responseText = await response.text();
        setError("The text was unable to be summarized: " + responseText);
      }
      return;
    }

    const data = await response.json();
    setError("");
    setResult(data.message.content);
  };

  // If we came back with a textarea value, restore it
  useEffect(() => {
    const credentials = new URLSearchParams(location.hash.substring(1)).get(
      "token"
    );

    if (credentials) {
      setCredentials(credentials);

      // Remove the token from the URL
      const oldString = window.location.toString();
      window.history.replaceState(
        {},
        document.title,
        oldString.substring(0, oldString.indexOf("#"))
      );

      const storedTextArea = localStorage.getItem("textarea");
      if (storedTextArea) {
        setTextArea(storedTextArea);
        handleSubmit(storedTextArea, credentials);
      }
    }
  }, []);

  return (
    <>
      {result === null && (
        <>
          <textarea
            className={
              processing
                ? "text-area vertical-resize gap-medium disabled"
                : "text-area vertical-resize gap-medium"
            }
            placeholder="To be or not to be..."
            name="textarea"
            onChange={(e) => setTextArea(e.target.value)}
            value={textArea}
          />

          <Button
            processing={processing}
            onClick={() => handleSubmit(textArea, credentials)}
          >
            Summarize
          </Button>
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
