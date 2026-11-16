import React from 'react';
import { Text } from 'react-native';
import ReactTestRenderer from 'react-test-renderer';
import App from '../App';

jest.mock('../src/v2/config', () => ({ isConfigured: true }));

jest.mock('../src/v2/supabase', () => ({
  supabase: {
    auth: {
      getSession: jest.fn().mockResolvedValue({ data: { session: null } }),
      onAuthStateChange: jest.fn(() => ({
        data: { subscription: { unsubscribe: jest.fn() } },
      })),
    },
  },
}));

const texts = r =>
  r.root
    .findAllByType(Text)
    .map(n => [].concat(n.props.children).join(''))
    .join('|');

let renderer;
afterEach(async () => {
  await ReactTestRenderer.act(async () => renderer?.unmount());
});

test('configuré : affiche l’onboarding, sans Google ni écran de configuration', async () => {
  await ReactTestRenderer.act(async () => {
    renderer = ReactTestRenderer.create(<App />);
  });
  const t = texts(renderer);
  expect(t).not.toContain('Configure Supabase');
  expect(t).not.toMatch(/google/i);
  expect(t.length).toBeGreaterThan(0);
});
