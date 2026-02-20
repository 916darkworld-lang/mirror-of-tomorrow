// src/core/auto-refinement-controller.ts

import {
  DomainType,
  ModelResponse
} from './agreement-engine';
import {
  ConsensusEngine,
  ConsensusInput,
  ConsensusResult,
  ConsensusState
} from './consensus-engine';

export interface AutoRefinementConfig {
  maxIterations: number;
  minDelta: number;        // minimum improvement to keep looping
  targetAgreement: number; // e.g. 0.98
}

export interface AutoRefinementContext {
  domain: DomainType;
  initialResponses: ModelResponse[];
  includedModels?: string[];
}

export interface AutoRefinementResult {
  finalConsensus: ConsensusResult;
  stoppedReason: 'target_reached' | 'stalled' | 'max_iterations';
}

export class AutoRefinementController {
  private consensusEngine: ConsensusEngine;
  private config: AutoRefinementConfig;

  constructor(
    consensusEngine?: ConsensusEngine,
    config?: Partial<AutoRefinementConfig>
  ) {
    this.consensusEngine = consensusEngine ?? new ConsensusEngine();
    this.config = {
      maxIterations: config?.maxIterations ?? 5,
      minDelta: config?.minDelta ?? 0.005,
      targetAgreement: config?.targetAgreement ?? 0.98
    };
  }

  async run(context: AutoRefinementContext): Promise<AutoRefinementResult> {
    let state: ConsensusState | undefined = undefined;
    let lastResult: ConsensusResult | null = null;

    for (let i = 0; i < this.config.maxIterations; i++) {
      const input: ConsensusInput = {
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
