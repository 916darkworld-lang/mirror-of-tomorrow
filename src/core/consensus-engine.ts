// src/core/consensus-engine.ts

import {
  AgreementEngine,
  AgreementResult,
  DeltaResult,
  DomainType,
  ModelResponse
} from './agreement-engine';

export interface ConsensusIteration {
  iteration: number;
  agreement: AgreementResult;
  delta: DeltaResult | null;
  includedModels: string[];
  combinedAnswer: string;
  timestamp: string;
}

export interface ConsensusState {
  domain: DomainType;
  targetAgreement: number; // e.g. 0.98
  iterations: ConsensusIteration[];
  currentIteration: number;
}

export interface ConsensusInput {
  domain: DomainType;
  targetAgreement?: number;
  previousState?: ConsensusState;
  responses: ModelResponse[];
  includedModels?: string[];
}

export interface ConsensusResult {
  state: ConsensusState;
  finalAnswer: string;
  agreement: AgreementResult;
  reachedTarget: boolean;
}

export class ConsensusEngine {
  private agreementEngine: AgreementEngine;

  constructor(agreementEngine?: AgreementEngine) {
    this.agreementEngine = agreementEngine ?? new AgreementEngine();
  }

  async remix(input: ConsensusInput): Promise<ConsensusResult> {
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

    const newIteration: ConsensusIteration = {
      iteration,
      agreement,
      delta,
      includedModels: filteredResponses.map(r => r.modelName),
      combinedAnswer,
      timestamp: new Date().toISOString()
    };

    const state: ConsensusState = {
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

  private filterResponses(
    responses: ModelResponse[],
    includedModels?: string[]
  ): ModelResponse[] {
    if (!includedModels || includedModels.length === 0) {
      return responses;
    }
    const set = new Set(includedModels);
    return responses.filter(r => set.has(r.modelName));
  }

  private combineAnswers(
    responses: ModelResponse[],
    agreement: AgreementResult
  ): string {
    const header = `Consensus Remix\n----------------\nOverall agreement: ${(agreement.overall * 100).toFixed(1)}%\n\n`;

    const body = responses
      .map((r, idx) => {
        return `Model: ${r.modelName}\nAnswer ${idx + 1}:\n${r.content.trim()}\n`;
      })
      .join('\n');

    return `${header}${body}`.trim();
  }
}
