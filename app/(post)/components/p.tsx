export function P({ children }) {

  const text = String(children);

  const isEnglish =
    /^[\\x00-\\x7F\\s\\d.,!?'"()\\-]+$/.test(text);

  const isSingleLine =
    !text.includes("\\n");


  return (
    <p
      className={`
        my-5
        ${
          isEnglish || isSingleLine
            ? "text-left"
            : "text-justify [text-align-last:left]"
        }
        [line-break:strict]
        [word-break:normal]
        [blockquote_&]:my-2
      `}
    >
      {children}
    </p>
  );
}
