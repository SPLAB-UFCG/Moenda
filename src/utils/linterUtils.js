const SUPRESSION_COMMENT_RE = /<!--\s*docs-checker-(?:(disable))((?:\s+[a-z0-9-]+)*)\s*-->/gi;

function parseCommentSuppression(tokens) {
  const disabledRules = {};
  
  tokens.forEach((token) => {
    const match = SUPRESSION_COMMENT_RE.exec(token.content);
    const [_, disabled, ruleNames] = match || [];
    if (disabled == 'disable'){
      ruleNames.forEach(
        (ruleName) => disabledRules[ruleName.trim()] = true
      )
    }
  });

  return disabledRules;
}

module.exports = {
  parseCommentSuppression,
};
