type TextAreaProps = {
  text: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
};
function TextArea({ text, onChange }: TextAreaProps) {
  return (
    <div className="p-3 h-full">
      <textarea
        className="w-full h-full text-white resize-none outline-none"
        value={text}
        onChange={(event) => onChange(event)}
      />
    </div>
  );
}
export default TextArea;
