const parseZTE = (content) => {
  const lines = content.split("\n");
  const parsedData = [];
  for (const line of lines) {
    const [OnuIndex, Type, Mode, AuthInfo, State] = line.split(" ");
    parsedData.push({ OnuIndex, Type, Mode, AuthInfo, State });
  }
  return parsedData;
};

module.exports = parseZTE;
