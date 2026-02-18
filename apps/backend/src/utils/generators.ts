import crypto from 'crypto';

export const getNewPollId = () => {
  const min = 100000;
  const max = 999999;
  return (Math.floor(Math.random() * (max - min + 1)) + min).toString();
};
