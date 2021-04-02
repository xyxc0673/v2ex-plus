import { ILoginParams, IUser } from '@/interfaces/user';
import { IBalance } from '@/interfaces/balance';
import { typedKeys } from '@/utils/tools';
import cheerio from 'cheerio';
import instance from '../request';
import { loginFormHeaders } from './config';
import { INotification, TNotificationType } from '@/interfaces/notification';
import * as parser from './parser';
import { IUserReply } from '@/interfaces/userReply';
import { ISocial } from '@/interfaces/social';
import { config } from '@/config';
import { IMyNode } from '@/interfaces/node';

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

  let cookies = [] as Array<string>;
  let userInfo = parser.getUserInfo(response.data);
  const problemList: Array<string> = [];

  if (isLogged) {
    cookies = response.headers['set-cookie'];
    userInfo = parser.getUserInfo(response.data);
  } else {
    const $ = cheerio.load(response.data);

    const problemSelector = $('.problem > ul > li');

    problemSelector.each((_, elem) => {
      problemList.push($(elem).text());
    });
  }

  return { isLogged, cookies, userInfo, problemList };
};

/**
 * Fetch user's balance
 * @returns A object as IBalance
 */
export const fetchBalance = async () => {
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

  const box = $('#Rightbar > .box');

  const boxInfo = parser.parseUserBox(box);

  return {
    balance,
    ...boxInfo,
  };
};

export interface IUserInfo {
  avatar: string;
  username: string;
}

export const fetchUserInfo = async () => {
  const response = await instance.get('');
  return parser.getUserInfo(response.data);
};

export interface INotificationResponse {
  notifications: INotification[];
  maxPage: number;
}

export const fetchUserNotifications = async (
  page: number = 1,
): Promise<INotificationResponse> => {
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

export const fetchUserProfile = async (username: string) => {
  const response = await instance.get(`/member/${username}`);
  const $ = cheerio.load(response.data);

  const box = $('#Main > .box').first();

  const avatar = box.find('.avatar').attr('src') || '';

  const dau = box.find('a[href="/top/dau"]').text();

  const tagLine = box.find('.bigger').first().text() || '';

  let company = '';
  let workTitle = '';

  const companyInfo =
    box
      .find('.cell > table > tbody > tr > td:nth-child(3) > span:nth-child(5)')
      .text() || '';

  const companyArray = companyInfo.split(' / ');

  if (companyArray.length > 1) {
    company = companyArray[0];
    workTitle = companyArray[1];
  }

  const gray = box.find('.gray').first().text() || '';

  const noReg = /V2EX 第 (\d+) 号会员/.exec(gray);
  const createdAtReg = /(\d{4}-\d{1,2}-\d{1,2}\s\d{1,2}:\d{1,2}:\d{1,2})/.exec(
    gray,
  );

  const no = noReg && noReg.length > 0 ? noReg[1] : '';
  const createdAt =
    createdAtReg && createdAtReg.length > 0 ? createdAtReg[1] : '';

  const bio = box.find('.cell:nth-child(3)').text().trim();

  const followed = box.find('.super.inverse.button').attr('onclick') || '';

  const follow = box.find('.super.special.button').attr('onclick') || '';

  const isFollowed = followed || follow;

  const onceReg = /once=(\d+)/.exec(isFollowed);
  const once = onceReg && onceReg.length > 0 ? onceReg[1] : '';

  const isOnline = box.find('.online').text() === 'ONLINE';

  const widgets = box.find('.widgets');

  const socialSelector = widgets.find('.social_label');

  const block = box.find('.super.normal.button').attr('onclick') || '';

  const blockReg = /t=(\d+)/.exec(block);

  const blockToken = blockReg && blockReg.length > 0 ? blockReg[1] : '';

  const socialList = [] as Array<ISocial>;

  socialSelector.each((index, elem) => {
    const url = $(elem).attr('href') || '';
    const name = $(elem).text().trim() || '';
    const icon = $(elem).find('img').attr('src') || '';
    const id = `${username}_${index}_${name}`;
    socialList.push({
      id,
      url,
      name,
      icon: `${config.V2EX_BASE_URL}${icon}`,
    });
  });

  const id = parseInt(no, 10);

  const profile: IUser = {
    id,
    username,
    avatar,
    dau,
    createdAt,
    bio,
    isOnline,
    blockToken,
    socialList,
    tagLine,
    company,
    workTitle,
  };

  return { once, profile };
};

export const fetchMyNodes = async () => {
  const response = await instance.get(`/my/nodes`);
  const $ = cheerio.load(response.data);

  const favouriteNodeSelector = $('.fav-node');

  const favNodeList: Array<IMyNode> = [];

  favouriteNodeSelector.each((_, elem) => {
    const id = $(elem).attr('id') || '';
    const icon = $(elem).find('img').attr('src') || '';
    const title = $(elem).find('.fav-node-name').text();
    const name = parser.getNodeName($(elem).attr('href'));

    favNodeList.push({
      id,
      icon,
      name,
      title,
    });
  });

  return favNodeList;
};
