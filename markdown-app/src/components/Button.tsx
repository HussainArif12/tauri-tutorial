type ButtonProps = {
  text: string;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
};
function Button({ text, onClick }: ButtonProps) {
  return (
    <button
      className="bg-blue-300 p-3 rounded-md"
      onClick={(event) => onClick(event)}
    >
      {text}
    </button>
  );
}
export default Button;
