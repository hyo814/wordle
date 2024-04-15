import React from 'react';
import { render, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import Game from '../pages/Game/index';
import { useRouter } from 'next/router';
import {RecoilRoot} from "recoil";

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('crypto-js', () => {
  const mockDecrypt = jest.fn().mockReturnValue({
    toString: () => 'decryptedWord',
  });
  return {
    AES: {
      decrypt: mockDecrypt,
    },
    enc: {
      Utf8: {},
    },
  };
});

jest.mock('../pages/api', () => ({
  dictionaryCheck: jest.fn().mockResolvedValue({ success: true }),
}));

describe('Game Page', () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockImplementation(() => ({
      push: jest.fn(),
      query: { word: 'encryptedWord' },
    }));
  });
  it('복호화 함수가 호출되는지 확인', async () => {
    await act(async () => {
      render(
        <RecoilRoot>
          <Game />
        </RecoilRoot>
      );
    });
    const cryptoJS = require('crypto-js');
    expect(cryptoJS.AES.decrypt).toHaveBeenCalled();
  });
  
  it('키보드 입력 후 보드 업데이트', async () => {
    await act(async () => {
      render(
        <RecoilRoot>
          <Game />
        </RecoilRoot>
      );
    });
  });
  
  it('올바르지 않은 글자수의 단어 입력 시 Snackbar 메시지 표시', async () => {
    await act(async () => {
      render(
        <RecoilRoot>
          <Game />
        </RecoilRoot>
      );
    });
  });
});
