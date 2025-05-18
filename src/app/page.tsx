import { SummarizeForm } from "@/components/SummarizeForm";
import { TextContent } from "@/components/TextContent";

export default function Home() {
  return (
    <div className="full-height">
      <header>
        <div className="content-padded center">
          <div className="box">
            <TextContent size="large">Text Summarizer</TextContent>
          </div>
        </div>
      </header>
      <main>
        <div className="content-padded center">
          <div className="box">
            <SummarizeForm />
          </div>
        </div>
      </main>
      <footer className="footer">
        <a href="https://trustleast.com" className="link">
          <TextContent>© Trustleast LLC</TextContent>
        </a>
      </footer>
    </div>
  );
}
