// src/core/agreement-engine.js

// Domain weight profiles
const DOMAIN_WEIGHTS = {
  coding:    { semantic: 0.4, structural: 0.3, constraint: 0.3 },
  creative:  { semantic: 0.7, structural: 0.2, constraint: 0.1 },
  logic:     { semantic: 0.3, structural: 0.2, constraint: 0.5 },
  strategy:  { semantic: 0.5, structural: 0.3, constraint: 0.2 }
};

class AgreementEngine {

  async computeAgreement(responses, domain) {
    if (!responses || responses.length < 2) {
      throw new Error('Agreement requires at least 2 responses.');
    }

    const contents = responses.map(r => r.content);

    const semantic = await this.semanticAgreement(contents);
    const structural = this.structuralAgreement(contents);
    const constraint = this.constraintAgreement(contents, domain);

    const weights = DOMAIN_WEIGHTS[domain];

    const overall =
      (semantic * weights.semantic) +
      (structural * weights.structural) +
      (constraint * weights.constraint);

    const pairwiseMatrix = await this.pairwiseSemanticMatrix(contents);
    const divergentModelIndex = this.detectDivergentModel(pairwiseMatrix);

    return {
      overall,
      layers: { semantic, structural, constraint },
      pairwiseMatrix,
      divergentModelIndex
    };
  }

  computeDelta(previous, current, iteration) {
    const delta = current - previous;
    const velocity = iteration > 0 ? delta / iteration : 0;
    return { delta, velocity };
  }

  // Semantic layer
  async semanticAgreement(contents) {
    const matrix = await this.pairwiseSemanticMatrix(contents);
    return this.averageUpperTriangle(matrix);
  }

  async pairwiseSemanticMatrix(contents) {
    const embeddings = await Promise.all(
      contents.map(c => this.embed(c))
    );

    const matrix = [];

    for (let i = 0; i < embeddings.length; i++) {
      matrix[i] = [];
      for (let j = 0; j < embeddings.length; j++) {
        if (i === j) {
          matrix[i][j] = 1;
        } else {
          matrix[i][j] = this.cosine(embeddings[i], embeddings[j]);
        }
      }
    }

    return matrix;
  }

  async embed(text) {
    return Array(512).fill(0).map(() => Math.random());
  }

  cosine(a, b) {
    const dot = a.reduce((sum, v, i) => sum + v * b[i], 0);
    const magA = Math.sqrt(a.reduce((sum, v) => sum + v * v, 0));
    const magB = Math.sqrt(b.reduce((sum, v) => sum + v * v, 0));
    return dot / (magA * magB);
  }

  averageUpperTriangle(matrix) {
    let total = 0;
    let count = 0;

    for (let i = 0; i < matrix.length; i++) {
      for (let j = i + 1; j < matrix.length; j++) {
        total += matrix[i][j];
        count++;
      }
    }

    return count > 0 ? total / count : 0;
  }

  // Structural layer
  structuralAgreement(contents) {
    const structures = contents.map(c => this.extractStructure(c));

    let similaritySum = 0;
    let comparisons = 0;

    for (let i = 0; i < structures.length; i++) {
      for (let j = i + 1; j < structures.length; j++) {
        similaritySum += this.structureSimilarity(structures[i], structures[j]);
        comparisons++;
      }
    }

    return comparisons > 0 ? similaritySum / comparisons : 0;
  }

  extractStructure(text) {
    const lines = text.split('\n');

    const headingCount = lines.filter(l => l.startsWith('#')).length;
    const bulletCount = lines.filter(l => l.trim().startsWith('-')).length;
    const numberedCount = lines.filter(l => /^\d+\./.test(l.trim())).length;

    return [headingCount, bulletCount, numberedCount, lines.length];
  }

  structureSimilarity(a, b) {
    const diff = a.reduce((sum, val, i) => sum + Math.abs(val - b[i]), 0);
    const max = a.reduce((sum, val) => sum + val, 0) +
                b.reduce((sum, val) => sum + val, 0);

    return max === 0 ? 1 : 1 - (diff / max);
  }

  // Constraint layer
  constraintAgreement(contents, domain) {
    if (domain === 'creative') {
      return 0.5;
    }

    const normalized = contents.map(c => this.extractKeyClaims(c));

    let matches = 0;
    let total = 0;

    for (let i = 0; i < normalized.length; i++) {
      for (let j = i + 1; j < normalized.length; j++) {
        total++;
        if (this.claimSetsMatch(normalized[i], normalized[j])) {
          matches++;
        }
      }
    }

    return total > 0 ? matches / total : 0;
  }

  extractKeyClaims(text) {
    return text
      .split('.')
      .map(s => s.trim().toLowerCase())
      .filter(s => s.length > 20);
  }

  claimSetsMatch(a, b) {
    const overlap = a.filter(claim => b.includes(claim));
    return overlap.length > 0;
  }

  // Divergence detection
  detectDivergentModel(matrix) {
    if (matrix.length === 0) return null;

    const avgDistances = matrix.map((row, i) => {
      const others = row.filter((_, j) => j !== i);
      const avg = others.reduce((sum, v) => sum + (1 - v), 0) / others.length;
      return avg;
    });

    const max = Math.max(...avgDistances);
    const index = avgDistances.indexOf(max);

    return max > 0.2 ? index : null;
  }
}

module.exports = { AgreementEngine };
