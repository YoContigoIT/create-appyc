import { ConflictException } from '@nestjs/common';

interface DBError {
  code: string;
  detail: string;
}

const errorCodes = {
  '23505': (detailError: string) => {
    throw new ConflictException(detailError);
  },
  default: () => {
    return 'Server Error - Please check logs';
  },
};

export const DBErrors = (error: DBError) => {
  const { code, detail } = error;
  errorCodes[code](detail);
};
