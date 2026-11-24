import { describe, expect, it } from 'vitest';
import { CONFIG_V1, centibetToMoney, type GameEvent } from '../../src/engine/index.js';
import { LocalGameService, replay, type RoundStep } from '../../src/session/game-service.js';

const service = (balance = 1_000_000) => {
  let s = 0n;
  return new LocalGameService(CONFIG_V1, { balance, nextSeed: () => s++ });
};

function finish(svc: LocalGameService, first: RoundStep): { events: GameEvent[]; last: RoundStep } {
  const events = [...first.events];
  let step = first;
  while (!step.done) {
    expect(step.awaitingPick).toBe(true);
    step = svc.pick(step.availableChambers[step.availableChambers.length - 1]);
    events.push(...step.events);
  }
  return { events, last: step };
}

describe('LocalGameService', () => {
  it('keeps exact books over many rounds and can replay every round from history', () => {
    const svc = service();
    let expected = svc.balance;
    let bonuses = 0;
    for (let i = 0; i < 3000; i++) {
      const before = svc.balance;
      const first = svc.start('spin');
      expect(first.balance).toBe(first.done ? before - svc.bet + first.win : before - svc.bet);
      const { events, last } = finish(svc, first);
      if (!first.done) bonuses++;
      expected += last.win - svc.bet;
      expect(svc.balance).toBe(expected);
      expect(svc.roundActive).toBe(false);
      const ended = events[events.length - 1];
      expect(ended.type).toBe('roundEnded');
      if (ended.type === 'roundEnded') expect(centibetToMoney(ended.totalWin, svc.bet)).toBe(last.win);
      expect(replay(CONFIG_V1, svc.history()[0])).toEqual(events);
    }
    expect(bonuses).toBeGreaterThan(0);
    expect(svc.history().length).toBe(50);
  });

  it('never reveals closed chambers before the pick', () => {
    const svc = service();
    for (let i = 0; i < 4000; i++) {
      let step = svc.start('spin');
      while (!step.done) {
        // While a pick is pending the log ends with the bonus start or an opened chamber;
        // the closed chambers of the pending bonus have not been sent.
        const last = step.events[step.events.length - 1];
        expect(['templeBonusStarted', 'chamberPicked']).toContain(last.type);
        const opened = step.events.map((e) => e.type).lastIndexOf('templeBonusStarted');
        expect(step.events.slice(Math.max(opened, 0)).some((e) => e.type === 'chambersRevealed')).toBe(false);
        step = svc.pick(step.availableChambers[0]);
      }
    }
  });

  it('charges the feature-buy price and starts in free spins', () => {
    const svc = service();
    const before = svc.balance;
    expect(svc.stake('buy')).toBe(58 * svc.bet);
    const { events, last } = finish(svc, svc.start('buy'));
    expect(events[0].type).toBe('featureBought');
    expect(svc.balance).toBe(before - 58 * svc.bet + last.win);
    expect(svc.history()[0].kind).toBe('buy');
  });

  it('refuses invalid actions without changing the balance', () => {
    const svc = service(150);
    expect(svc.canStart('buy')).toBe(false);
    expect(() => svc.start('buy')).toThrow(/balance/);
    expect(() => svc.setBet(123)).toThrow();
    expect(() => svc.pick(0)).toThrow();
    expect(svc.balance).toBe(150);
    svc.setBet(200);
    expect(svc.canStart('spin')).toBe(false);
    expect(() => svc.start('spin')).toThrow(/balance/);
    expect(svc.balance).toBe(150);
  });

  it('rejects a second start, a bet change and a bad chamber while a pick is pending', () => {
    const svc = service();
    let step = svc.start('spin');
    while (step.done) step = svc.start('spin');
    const balance = svc.balance;
    expect(() => svc.start('spin')).toThrow();
    expect(() => svc.setBet(200)).toThrow();
    expect(() => svc.pick(99)).toThrow();
    expect(svc.balance).toBe(balance);
    finish(svc, step);
  });
});
