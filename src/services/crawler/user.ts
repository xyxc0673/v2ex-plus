import { ILoginParams } from '@/interfaces/user';
import { IBalance } from '@/interfaces/balance';
import { typedKeys } from '@/utils/tools';
import cheerio from 'cheerio';
import instance from '../request';
import { loginFormHeaders } from './config';
import { INotification, TNotificationType } from '@/interfaces/notification';
import * as parser from './parser';
import { IUserReply } from '@/interfaces/userReply';

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

  const userInfo = parser.getUserInfo(response.data);

  return { isLogged, cookies, userInfo };
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

export interface IUserInfo {
  avatar: string;
  username: string;
}

export const fetchUserInfo = async () => {
  const response = await instance.get('');
  return parser.getUserInfo(response.data);
};

export const fetchUserNotifications = async (page: number = 1) => {
  const response = await instance.get(`/notifications?p=${page}`);

  const $ = cheerio.load(response.data);

  const list = $('#notifications>.cell');

  const notifications = [] as Array<INotification>;

  list.each((_, elem) => {
    const payload = $(elem).find('.payload').text().trim();
    const avatar = $(elem).find('.avatar').attr('src') || '';

    const fade = $(elem).find('.fade');

    const username = $(fade).find('a:nth-child(1)').text();

    const topicA = $(fade).find('a:nth-child(2)');
    const topicTitle = topicA.text();
    const topicId = parser.getTopicId(topicA.attr('href'));

    const createdAt = $(elem).find('.snow').text();
    const typeText = fade.children().remove().end().text();
    const typeTextList = typeText.split('  ');

    let type: TNotificationType = 'reply';

    if (typeTextList.length >= 2) {
      if (typeTextList[1].indexOf('回复') !== -1) {
        type = 'reply';
      } else if (typeTextList[1].indexOf('提到') !== -1) {
        type = 'refer';
      }
    } else {
      if (typeTextList[0].indexOf('收藏') !== -1) {
        type = 'collect';
      } else if (typeTextList[0].indexOf('感谢') !== -1) {
        type = 'thanks';
      }
    }

    notifications.push({
      payload: payload,
      topicTitle,
      avatar,
      username,
      type,
      topicId,
      createdAt,
    });
  });

  const maxPage = $('.page_input').attr('max');

  return {
    notifications,
    maxPage: parseInt(maxPage || '0', 10),
  };
};

export const fetchUserTopics = async (username: string, page: number = 1) => {
  const response = await instance.get(`/member/${username}/topics?p=${page}`);

  const $ = cheerio.load(response.data);

  const isHidden = $('.topic_content').text().indexOf('主题列表被隐藏') !== -1;

  if (isHidden) {
    return { topicList: [], topicCount: 0 };
  }

  const list = $('.cell.item');

  const topicList = parser.parseTopicList($, list);
  const topicCount = parseInt($('.header > .fr > .gray').text(), 10);

  return { topicList, topicCount };
};

export const fetchUserReplies = async (username: string, page: number = 1) => {
  const response = await instance.get(`/member/${username}/replies?p=${page}`);

  const $ = cheerio.load(response.data);

  const replyCount = parseInt($('.header > .fr > .gray').text(), 10);

  const replyInfoList = $('.dock_area');
  const replyContentList = $('#Main > .box > .inner');

  const replyList = [] as Array<IUserReply>;

  replyInfoList.each((index, elem) => {
    const createdAt = $(elem).find('.fr').text();

    const aList = $(elem).find('.gray > a');

    const author = aList.eq(0).text();

    const nodeElem = aList.eq(1);
    const nodeTitle = nodeElem.text();
    const nodeName = parser.getNodeName(nodeElem.attr('href'));

    const topicElem = aList.eq(2);
    const topicTitle = topicElem.text();
    const topicId = parser.getTopicId(topicElem.attr('href'));

    const content =
      replyContentList.eq(index).children('.reply_content').html() || '';

    const reply: IUserReply = {
      author,
      nodeName,
      nodeTitle,
      topicId,
      topicTitle,
      content,
      createdAt,
    };

    replyList.push(reply);
  });

  return { replyList, replyCount };
};
