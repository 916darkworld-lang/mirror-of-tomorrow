// src/core/consensus-engine.js

const { AgreementEngine } = require('./agreement-engine');

class ConsensusEngine {
  constructor(agreementEngine) {
    this.agreementEngine = agreementEngine || new AgreementEngine();
  }

  async remix(input) {
    const {
      domain,
      responses,
      targetAgreement = 0.98,
      previousState,
      includedModels
    } = input;

    const filteredResponses = this.filterResponses(responses, includedModels);
    const agreement = await this.agreementEngine.computeAgreement(filteredResponses, domain);

    const iteration = previousState ? previousState.currentIteration + 1 : 0;
    const prevOverall = previousState
      ? previousState.iterations[previousState.iterations.length - 1].agreement.overall
      : agreement.overall;

    const delta = this.agreementEngine.computeDelta(prevOverall, agreement.overall, iteration);
    const combinedAnswer = this.combineAnswers(filteredResponses, agreement);

    const newIteration = {
      iteration,
      agreement,
      delta,
      includedModels: filteredResponses.map(r => r.modelName),
      combinedAnswer,
      timestamp: new Date().toISOString()
    };

    const state = {
      domain,
      targetAgreement,
      iterations: previousState
        ? [...previousState.iterations, newIteration]
        : [newIteration],
      currentIteration: iteration
    };

    const reachedTarget = agreement.overall >= targetAgreement;

    return {
      state,
      finalAnswer: combinedAnswer,
      agreement,
      reachedTarget
    };
  }

  filterResponses(responses, includedModels) {
    if (!includedModels || includedModels.length === 0) {
      return responses;
    }
    const set = new Set(includedModels);
    return responses.filter(r => set.has(r.modelName));
  }

  combineAnswers(responses, agreement) {
    const header =
      `Consensus Remix\n----------------\n` +
      `Overall agreement: ${(agreement.overall * 100).toFixed(1)}%\n\n`;

    const body = responses
      .map((r, idx) => {
        return `Model: ${r.modelName}\nAnswer ${idx + 1}:\n${r.content.trim()}\n`;
      })
      .join('\n');

    return `${header}${body}`.trim();
  }
}

module.exports = { ConsensusEngine };
