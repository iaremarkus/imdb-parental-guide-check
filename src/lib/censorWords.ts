export const censorText = (inputText: string, replacementChar = "-"): string => {
  const badWords = ["fuck", "shit"]; // Add your bad words to this array
  let censoredText = inputText;

  for (let word of badWords) {
    const regex = new RegExp(`${word}`, "gi");
    const replacement = replacementChar.repeat(word.length);
    censoredText = censoredText.replace(regex, replacement);
  }

  return censoredText;
};
