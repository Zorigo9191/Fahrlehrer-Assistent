export default function Textarea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement>,
) {
  return (
    <textarea
      {...props}
      className={`
            w-full 
            rounded-xl
            border
            border-slate-300
            px-4
            py-2
            text-sm
            focus:outline-none
            focus:ring-2
            focus:ring-blue-700
            ${props.className ?? ""} `}
    />
  );
}
