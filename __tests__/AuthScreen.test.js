import React from 'react';
import { Text } from 'react-native';
import ReactTestRenderer from 'react-test-renderer';
import AuthScreen from '../src/v2/screens/AuthScreen';
import { useAuth } from '../src/v2/context/AuthContext';

jest.mock('../src/v2/context/AuthContext', () => ({ useAuth: jest.fn() }));

const texts = r =>
  r.root
    .findAllByType(Text)
    .map(n => [].concat(n.props.children).join(''))
    .join('|');

let renderer;
let signIn;
let signUp;

const render = async () => {
  await ReactTestRenderer.act(async () => {
    renderer = ReactTestRenderer.create(<AuthScreen />);
  });
};
const pressSignIn = async () => {
  const btn = renderer.root.findAll(
    n =>
      typeof n.props.onPress === 'function' &&
      n.findAll(c => c.type === Text && c.props.children === 'Sign In').length >
        0,
  )[0];
  await ReactTestRenderer.act(async () => {
    btn.props.onPress();
  });
};
beforeEach(() => {
  signIn = jest.fn().mockResolvedValue(undefined);
  signUp = jest.fn().mockResolvedValue({ needsConfirmation: false });
  useAuth.mockReturnValue({ signIn, signUp });
});

afterEach(async () => {
  await ReactTestRenderer.act(async () => renderer?.unmount());
});

describe('AuthScreen', () => {
  test('affiche la connexion email/mot de passe', async () => {
    await render();
    expect(texts(renderer)).toContain('Welcome Back');
    expect(
      renderer.root.findAllByProps({ placeholder: 'Email address' }).length,
    ).toBeGreaterThan(0);
    expect(
      renderer.root.findAllByProps({ placeholder: 'Password' }).length,
    ).toBeGreaterThan(0);
  });

  test('ne propose plus la connexion Google', async () => {
    await render();
    expect(texts(renderer)).not.toMatch(/google/i);
  });

  test('soumet email et mot de passe à signIn', async () => {
    await render();
    const email = renderer.root.findAllByProps({
      placeholder: 'Email address',
    })[0];
    const pwd = renderer.root.findAllByProps({ placeholder: 'Password' })[0];
    await ReactTestRenderer.act(async () => {
      email.props.onChangeText('salma@test.com');
      pwd.props.onChangeText('secret1');
    });
    await pressSignIn();
    expect(signIn).toHaveBeenCalledWith({
      email: 'salma@test.com',
      password: 'secret1',
    });
  });

  test('affiche le message d’erreur renvoyé par signIn', async () => {
    signIn.mockRejectedValue(new Error('Incorrect email or password.'));
    await render();
    await pressSignIn();
    expect(texts(renderer)).toContain('Incorrect email or password.');
  });

  test('bascule vers l’inscription avec le champ nom', async () => {
    await render();
    const switchBtn = renderer.root.findAll(
      n =>
        typeof n.props.onPress === 'function' &&
        n.findAll(c => c.type === Text && c.props.children === 'Sign Up')
          .length > 0,
    )[0];
    await ReactTestRenderer.act(async () => {
      switchBtn.props.onPress();
    });
    expect(texts(renderer)).toContain('Create Account');
    expect(
      renderer.root.findAllByProps({ placeholder: 'Full name' }).length,
    ).toBeGreaterThan(0);
  });
});
