const path = require('path');

function getTokensRegex(tokens) {
  return Object.entries(tokens).map(([key, value]) =>
    value === 'optional' ? `(${key})?` : key,
  );
}

function getValidTokens(structure, hLevel) {
  const tokens = structure?.[hLevel];
  if (!tokens) return [];

  return Array.isArray(tokens)
    ? tokens
        .map(getTokensRegex)
        .map((token) => token.join(''))
        .join('|') // explain why
    : getTokensRegex(tokens).join('');
}

function transverseTree(structure, currentNode, onError) {
  const {children, hLevel} = currentNode;
  const subsections = children.filter((child) => child.hLevel);

  const validTokens = getValidTokens(structure, hLevel);

  const nodeTags = children.filter(
    (child) => !child.node.type.match('close|inline'),
  );

  if (validTokens.length) {
    const tokensRegex = `(${validTokens})+`;
    const tagsRepresentation = nodeTags.map((child) => child.node.tag).join('');
    if (!tagsRepresentation.match(tokensRegex)) {
      onError({
        lineNumber: currentNode.node.map[0],
        detail: 'Your section is not following the recommended structure',
        context: currentNode.children[0].node.content,
      });
    }
  }

  subsections.forEach((subSection) => {
    transverseTree(structure, subSection, onError);
  });
}

module.exports = {
  names: ['require-structure'],
  description: 'Enforces the structure of a .md file',
  tags: ['md', 'structure'],
  run: function rule(params, onError) {
    const {context, structure} = params;
    transverseTree(structure, context, onError);
  },
};