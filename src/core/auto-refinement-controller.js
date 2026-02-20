// src/core/auto-refinement-controller.js

const { ConsensusEngine } = require('./consensus-engine');

class AutoRefinementController {
  constructor(consensusEngine, config) {
    this.consensusEngine = consensusEngine || new ConsensusEngine();
    this.config = {
      maxIterations: (config && config.maxIterations) || 5,
      minDelta: (config && config.minDelta) || 0.005,
      targetAgreement: (config && config.targetAgreement) || 0.98
    };
  }

  async run(context) {
    let state = undefined;
    let lastResult = null;

    for (let i = 0; i < this.config.maxIterations; i++) {
      const input = {
        domain: context.domain,
        responses: context.initialResponses,
        targetAgreement: this.config.targetAgreement,
        previousState: state,
        includedModels: context.includedModels
      };

      const result = await this.consensusEngine.remix(input);
      state = result.state;
      lastResult = result;

      const currentIteration = state.iterations[state.iterations.length - 1];
      const delta = currentIteration.delta;

      if (result.reachedTarget) {
        return {
          finalConsensus: result,
          stoppedReason: 'target_reached'
        };
      }

      if (delta && Math.abs(delta.delta) < this.config.minDelta) {
        return {
          finalConsensus: result,
          stoppedReason: 'stalled'
        };
      }
    }

    if (!lastResult) {
      throw new Error('AutoRefinementController: no iterations executed.');
    }

    return {
      finalConsensus: lastResult,
      stoppedReason: 'max_iterations'
    };
  }
}

module.exports = { AutoRefinementController };
