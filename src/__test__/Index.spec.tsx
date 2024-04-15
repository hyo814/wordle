import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Index from '../pages/index';
import { useRouter } from 'next/router';

jest.mock('next/router', () => ({
	useRouter: jest.fn(),
}));

describe('Index Page Buttons', () => {
  const pushMock = jest.fn();
  beforeEach(() => {
    (useRouter as jest.Mock).mockImplementation(() => ({
      push: pushMock,
    }));
  });
  
  it('\'시작하기\' 버튼 클릭 시 동작 확인', () => {
    const { getByText } = render(<Index />);
    fireEvent.click(getByText('시작하기'));
    expect(pushMock).toHaveBeenCalledWith(expect.objectContaining({ pathname: '/Game' }));
  });
  
  it('\'워들 생성하기\' 버튼 클릭 시 동작 확인', () => {
    const { getByText } = render(<Index />);
    fireEvent.click(getByText('워들 생성하기'));
    expect(pushMock).toHaveBeenCalledWith(expect.objectContaining({ pathname: '/Answer' }));
  });
});

