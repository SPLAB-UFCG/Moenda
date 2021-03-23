function parseCommentSuppression(tokens, comment) {
  const disabledRules = {};

  tokens.forEach((token) => {
    const matches = token.content.match(
      new RegExp(
        `<!--\\s*${comment}-(?:(disable))((?:\\s+[a-z0-9-]+)*)\\s*-->`,
        'i',
      ),
    );
    const [_, disabled, ruleNames] = matches || [];
    if (disabled == 'disable') {
      ruleNames
        .split(' ')
        .forEach((ruleName) => (disabledRules[ruleName.trim()] = true));
    }
  });

  return disabledRules;
}

module.exports = {
  parseCommentSuppression,
};
