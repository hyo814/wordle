import React from 'react';
import {render, fireEvent, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom';
import Answer from '../pages/Answer/index';
import * as NextRouter from 'next/router';
import CryptoJS from 'crypto-js';
import { RecoilRoot } from 'recoil';
import {dictionaryCheck} from '../pages/api';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));
jest.mock('crypto-js', () => ({
  AES: {
    encrypt: jest.fn().mockReturnValue({
      toString: () => 'encryptedWord',
    }),
  },
}));
jest.mock('../pages/api', () => ({
  dictionaryCheck: jest.fn(),
}));

describe('Index Page', () => {
  it('올바른 단어 입력과 시작하기 버튼 클릭 시 페이지 이동', async () => {
    const pushMock = jest.fn();
    (NextRouter.useRouter as jest.Mock).mockImplementation(() => ({
      push: pushMock,
    }));
    (dictionaryCheck as jest.Mock).mockResolvedValue({success: true});
    
    const {getByRole, getByText} = render(
      <RecoilRoot>
        <Answer />
      </RecoilRoot>
    );
    const input = getByRole('textbox');
    const button = getByText('시작하기');
    
    fireEvent.change(input, {target: {value: 'apple'}});
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(dictionaryCheck).toHaveBeenCalledWith('apple');
      expect(CryptoJS.AES.encrypt).toHaveBeenCalledWith('APPLE', 'secret_key');
      expect(pushMock).toHaveBeenCalledWith({
        pathname: '/Game',
        query: {word: 'encryptedWord'},
      });
    });
  });
  
  it('5글자 초과 입력 시 Snackbar 메시지 표시', () => {
    const {getByRole, getByText} = render(
      <RecoilRoot>
        <Answer />
      </RecoilRoot>
    );
    fireEvent.change(getByRole('textbox'), {target: {value: 'apples'}});
    
    expect(getByText('단어는 5글자를 초과할 수 없습니다.')).toBeVisible();
  });
  
  it('영어 이외 문자 입력 시 Snackbar 메시지 표시', () => {
    const {getByRole, getByText} = render(
      <RecoilRoot>
        <Answer />
      </RecoilRoot>
    );
    fireEvent.change(getByRole('textbox'), {target: {value: '사과'}});
    
    expect(getByText('영어 입력 이외에 허용 되지 않습니다.')).toBeVisible();
  });
});
