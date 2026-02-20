class BridgeProtocol {
  static createPromptMessage(prompt) {
    return {
      type: 'prompt',
      payload: {
        prompt
      }
    };
  }

  static createAIResponseMessage(modelName, content) {
    return {
      type: 'ai-response',
      payload: {
        modelName,
        content
      }
    };
  }

  static createConsensusMessage(finalAnswer, agreement) {
    return {
      type: 'consensus',
      payload: {
        finalAnswer,
        agreement
      }
    };
  }

  static createWindowCommand(command) {
    return {
      type: 'window-command',
      payload: {
        command
      }
    };
  }

  static serialize(message) {
    return JSON.stringify(message);
  }

  static deserialize(raw) {
    try {
      return JSON.parse(raw);
    } catch (err) {
      return null;
    }
  }

  static isValid(message) {
    if (!message || typeof message !== 'object') return false;
    if (!message.type || !message.payload) return false;
    return true;
  }
}

module.exports = BridgeProtocol;
