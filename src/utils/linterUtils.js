const SUPRESSION_COMMENT_RE = /<!--\s*docs-checker-(?:(disable))((?:\s+[a-z0-9-]+)*)\s*-->/gi;

function parseCommentSuppression(tokens) {
  const disabledRules = {};
  
  tokens.forEach((token) => {
    const match = SUPRESSION_COMMENT_RE.exec(token.content);
    const [_, disabled, ruleName] = match || [];
    if (disabled == 'disable') disabledRules[ruleName.trim()] = true;
  }); // check when have more than one

  return disabledRules;
}

module.exports = {
  parseCommentSuppression,
};
