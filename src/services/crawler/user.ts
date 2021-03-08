import { ILoginParams } from '@/interfaces/user';
import { IBalance } from '@/interfaces/balance';
import { typedKeys } from '@/utils/tools';
import cheerio from 'cheerio';
import instance from '../request';
import { loginFormHeaders } from './config';

export const getLoginParams = async (): Promise<ILoginParams> => {
  const response = await instance.get('/signin', {
    headers: loginFormHeaders,
  });

  const $ = cheerio.load(response.data);

  const inputList = $('input.sl');

  const params = {
    username: '',
    password: '',
    captcha: '',
    once: '',
    next: '/',
  };
  const keys = typedKeys(params);

  inputList.each((i, input) => {
    const key = keys[i];
    params[key] = $(input).attr('name') || '';
  });

  params.once = $('input[name=once]').attr('value') || '';

  return params;
};

export const login = async (
  username: string,
  password: string,
  captcha: string,
  loginParams: ILoginParams,
) => {
  const data = {
    [loginParams.username]: username,
    [loginParams.password]: password,
    [loginParams.captcha]: captcha,
    once: loginParams.once,
    next: loginParams.next,
  };

  const response = await instance.post('/signin', null, {
    params: data,
    headers: loginFormHeaders,
  });

  const isLogged = response.data?.indexOf('确定要从 V2EX 登出？') !== -1;

  const cookies = response.headers['set-cookie'] || '';

  return { isLogged, cookies };
};

/**
 * Fetch user's balance
 * @returns A object as IBalance
 */
export const fetchBalance = async (): Promise<IBalance> => {
  const response = await instance.get('/balance');

  const $ = cheerio.load(response.data);

  const balanceArea = $('.balance_area.bigger');

  const balanceText = balanceArea.text();

  const balanceArray = balanceText
    .split('  ')
    .map((item) => parseInt(item.trim(), 10));

  let balance = {
    gold: 0,
    silver: 0,
    bronze: 0,
  } as IBalance;

  if (balanceArray.length === 3) {
    balance.gold = balanceArray[0];
    balance.silver = balanceArray[1];
    balance.bronze = balanceArray[2];
  }

  return balance;
};
