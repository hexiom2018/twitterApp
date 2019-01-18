import variable from "./../variables/platform";

export default (variables = variable) => {
  const textTheme = {
    fontSize: variables.DefaultFontSize,
    fontFamily: variables.fontFamily,
    color: variables.textColor,
    ".note": {
      color: "#4369FF",
      fontSize: variables.noteFontSize
    }
  };

  return textTheme;
};
