import Markdown from "react-markdown";
import "./MarkdownArea.css";
import remarkGfm from "remark-gfm";

type MarkdownAreaProps = {
  text: string;
};
function MarkdownArea({ text }: MarkdownAreaProps) {
  return (
    <div className="text-white p-3 h-full">
      <Markdown remarkPlugins={[remarkGfm]}>{text}</Markdown>
    </div>
  );
}
export default MarkdownArea;
