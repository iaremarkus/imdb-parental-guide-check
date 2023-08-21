export const censorText = (inputText: string, replacementChar = "◾"): string => {
  const badWords = ["fuck", "shit", "motherfucker"]; // Add your bad words to this array
  let censoredText = inputText;

  for (let word of badWords) {
    // Use a regular expression to replace all occurrences of each bad word
    const regex = new RegExp(`\\b${word}\\b`, "gi");
    const replacement = replacementChar.repeat(word.length);
    censoredText = censoredText.replace(regex, replacement);
  }

  return censoredText;
};
