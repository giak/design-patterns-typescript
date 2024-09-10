/**
 * Basic example of a parser using a binary tree: it's a calculator.
 * ⚠️ Beware: purpose is about using Typescript and "basic binary search tree", not about performance or efficiency.
 */

/**
 * Represents the type of nodes in the AST.
 * @typedef {("Number" | "BinaryOperation")} NodeType
 */

// Definition of the node types
type NodeType = "Number" | "BinaryOperation";

/**
 * Interface for all AST nodes.
 * @interface ASTNode
 */
interface ASTNode {
  type: NodeType;
}

/**
 * Represents a number node in the AST.
 * @interface NumberNode
 * @extends {ASTNode}
 * @property {number} value - The numeric value of the node.
 */
interface NumberNode extends ASTNode {
  type: "Number";
  value: number;
}

/**
 * Represents a binary operation node in the AST.
 * @interface BinaryOperationNode
 * @extends {ASTNode}
 * @property {("+" | "-" | "*" | "/")} operator - The operator for the binary operation.
 * @property {ASTNode} left - The left operand of the operation.
 * @property {ASTNode} right - The right operand of the operation.
 */
interface BinaryOperationNode extends ASTNode {
  type: "BinaryOperation";
  operator: "+" | "-" | "*" | "/";
  left: ASTNode;
  right: ASTNode;
}

/**
 * Creates a number node.
 * @param {number} value - The value of the number node.
 * @returns {NumberNode} The created number node.
 */
function createNumberNode(value: number): NumberNode {
  return { type: "Number", value };
}

/**
 * Creates a binary operation node.
 * @param {("+" | "-" | "*" | "/")} operator - The operator for the binary operation.
 * @param {ASTNode} left - The left operand of the operation.
 * @param {ASTNode} right - The right operand of the operation.
 * @returns {BinaryOperationNode} The created binary operation node.
 */
function createBinaryOperationNode(
  operator: "+" | "-" | "*" | "/",
  left: ASTNode,
  right: ASTNode
): BinaryOperationNode {
  return { type: "BinaryOperation", operator, left, right };
}

/**
 * Evaluates the AST and returns the result.
 * @param {ASTNode} node - The root node of the AST.
 * @returns {number} The result of the evaluation.
 * @throws {Error} Throws an error if the node type is unsupported.
 */
function evaluate(node: ASTNode): number {
  if (node.type === "Number") {
    const numberNode = node as NumberNode;
    return numberNode.value;
  }
  if (node.type === "BinaryOperation") {
    const binaryNode = node as BinaryOperationNode;
    const leftValue = evaluate(binaryNode.left);
    const rightValue = evaluate(binaryNode.right);
    switch (binaryNode.operator) {
      case "+":
        return leftValue + rightValue;
      case "-":
        return leftValue - rightValue;
      case "*":
        return leftValue * rightValue;
      case "/":
        return leftValue / rightValue;
      default:
        throw new Error("Opérateur non supporté");
    }
  }
  throw new Error("Type de nœud non supporté");
}

// Example of usage : creation of an AST for the expression (3 + 4) * 2
const ast = createBinaryOperationNode(
  "*",
  createBinaryOperationNode("+", createNumberNode(3), createNumberNode(4)),
  createNumberNode(2)
);

// Evaluation of the AST
console.log(evaluate(ast)); // Affiche: 14

export type {};
