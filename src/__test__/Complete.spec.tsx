import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import Complete from '../pages/Complete/index';
import { RecoilRoot } from 'recoil';
import { useRouter } from 'next/router';

interface LocalStorageMock {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  clear: () => void;
  removeItem: (key: string) => void;
}

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

const mockPush = jest.fn();
const mockBeforePopState = jest.fn((callback) => {
  callback({ as: '', url: '' });
  return true;
});

const localStorageMock: LocalStorageMock = (function () {
  let store: { [key: string]: string } = {};
  return {
    getItem(key: string) {
      return store[key] || null;
    },
    setItem(key: string, value: string) {
      store[key] = value.toString();
    },
    clear() {
      store = {};
    },
    removeItem(key: string) {
      delete store[key];
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('Complete Page', () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      beforePopState: mockBeforePopState,
    });
    
    window.localStorage.clear();
    window.localStorage.setItem('lastPlayTime', '120');
    window.localStorage.setItem('totalWins', '5');
    window.localStorage.setItem('totalGames', '10');
    window.localStorage.setItem('winRate', '50');
    window.localStorage.setItem('triesStat', JSON.stringify({1: 2, 2: 3, 3: 1}));
    
    window.alert = jest.fn();
  });
  
  it('페이지 로딩 시 localStorage에서 데이터 로드 및 라우터 동작 검증', () => {
    const { getByText } = render(
      <RecoilRoot>
        <Complete />
      </RecoilRoot>
    );
    
    expect(getByText('이번 게임 플레이시간: 120초')).toBeInTheDocument();
    expect(getByText('현재까지 워들을 승리한 횟수: 5회')).toBeInTheDocument();
    expect(getByText('현재까지의 워들 승률: 50%')).toBeInTheDocument();
    expect(getByText('현재까지 워들 시도한 횟수의 통계: 1회 시도: 2번, 2회 시도: 3번, 3회 시도: 1번')).toBeInTheDocument();
    expect(getByText('총 게임 횟수: 10회')).toBeInTheDocument();
    
    expect(mockBeforePopState).toHaveBeenCalled();
    expect(mockPush).toHaveBeenCalledWith('/');
  });
});
