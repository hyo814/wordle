export type Status = 'correct' | 'present' | 'absent' | 'none';

export type BoardProps = {
  boardData: {
    value: string;
    status: Status;
  }[][];
};

export type KeyProps = {
  value: string;
  onClick: (value: string) => void;
};

export type KeyboardProps = {
  onKeyPress: (key: string) => void;
};

export type TitleProps = {
  value: string;
  status: Status;
};
