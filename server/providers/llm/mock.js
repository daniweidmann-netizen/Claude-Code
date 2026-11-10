import { mockScript, mockSeriesPlan } from '../../../shared/mockScripts.js';

export default {
  name: 'mock',
  async planSeries(input) { return mockSeriesPlan(input); },
  async writeScript(input) { return mockScript(input); },
};
