export const isUnderTSNode = (): boolean => {
  return Symbol.for("ts-node.register.instance") in process;
};
