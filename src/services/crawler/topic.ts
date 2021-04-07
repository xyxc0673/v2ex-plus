import { IReply } from '@/interfaces/reply';
import { ISupplement, ITopic } from '@/interfaces/topic';
import cheerio from 'cheerio';
import * as parser from './parser';
import instance from '../request';

export const fetchTopicByTab = async (
  tab: string = 'all',
): Promise<Array<ITopic>> => {
  const response = await instance.get(`/?tab=${tab}`);
  const $ = cheerio.load(response.data);
  const list = $('.cell.item');

  const topicList = parser.parseTopicList($, list);

  return topicList;
};

export interface ITopicNodeResponse {
  topicList: ITopic[];
  topicCount: number;
  nodeIcon: string;
  nodeIntro: string;
  maxPage: number;
}

export const fetchTopicsByNode = async (
  tab: string = 'all',
  page: number = 1,
): Promise<ITopicNodeResponse> => {
  const response = await instance.get(`/go/${tab}?p=${page}`);
  const $ = cheerio.load(response.data);
  const list = $('#TopicsNode > .cell');

  const topicList = parser.parseTopicList($, list);

  const topicCount = parseInt($('.topic-count > strong').text(), 10);

  const nodeIcon = $('.cell.page-content-header>img').attr('src') || '';

  const nodeIntro = $('.intro').text();

  const maxPage = parseInt($('.page_input').attr('max') || '1', 10);

  return { topicList, topicCount, nodeIcon, nodeIntro, maxPage };
};

const parseTopicDetails = ($: cheerio.Root) => {
  const title = $('h1').text();
  const content = $('.topic_content').html() || '';
  const createdAt = parser.parseDatetime(
    $('small.gray > span').attr('title') || '',
  );

  const node = $('.header > a:nth-child(4)');

  const nodeName = parser.getNodeName(node.attr('href'));
  const nodeTitle = node.text();

  const avatarElem = $('.header').find('.avatar');

  const avatar = avatarElem.attr('src') || '';

  const author = avatarElem.attr('alt') || '';

  const gray = $('small.gray').text().split('·');

  let via = '';

  if (gray[1].indexOf('iPhone') !== -1) {
    via = 'iPhone';
  } else if (gray[1].indexOf('Android') !== -1) {
    via = 'Android';
  }

  const collectUrl = $('.topic_buttons').find('.tb').eq(0).attr('href') || '';

  const isCollect = collectUrl.indexOf('unfavorite') !== -1;

  const votes = $('.votes').find('a');

  const vote = parseInt($(votes.get(0)).text() || '0', 10);

  const stats = $('.topic_stats').text().split('∙');

  let views = 0;
  let likes = 0;
  let thanks = 0;

  stats.forEach((value, _) => {
    if (value.indexOf('views') !== -1) {
      views = parseInt(value.replace('views', '').trim(), 10);
    } else if (value.indexOf('likes') !== -1) {
      likes = parseInt(value.replace('likes', '').trim(), 10);
    } else if (value.indexOf('感谢') !== -1) {
      thanks = parseInt(value.replace('人感谢', '').trim(), 10);
    }
  });

  const supplementsSelector = $('.subtle');

  const supplementList = [] as Array<ISupplement>;

  supplementsSelector.each((_, elem) => {
    const supplement = {
      createdAt: parser.parseDatetime(
        $(elem).find('.fade>span').attr('title') || '',
      ),
      content: $(elem).find('.topic_content').html() || '',
    };
    supplementList.push(supplement);
  });

  return {
    title,
    createdAt,
    content,
    via,
    isCollect,
    vote,
    views,
    likes,
    thanks,
    supplementList,
    nodeName,
    nodeTitle,
    avatar,
    author,
  };
};

const parseReplyInfo = ($: cheerio.Root) => {
  const box = $('#Main > .box:nth-child(4)');
  const replyList = [] as Array<IReply>;
  const replyHtml = $(box).find('.cell');

  let replyCount = 0;
  let lastReplyDatetime = '';
  let maxPage = 1;
  let currPage = 1;

  replyHtml.each((index, elem) => {
    // 第一行为帖子信息
    if (index === 0) {
      const topicInfo = $(elem).find('.gray').text().split('•');
      replyCount = parseInt(topicInfo[0].replace('replies', '').trim(), 10);
      lastReplyDatetime = parser.parseDatetime(topicInfo[1]);
      return;
    }

    // 帖子大于 100 条回复时，第二行以及倒数第一行为页码
    if (replyCount > 100) {
      if (index === 1 || index === replyHtml.length - 1) {
        const pageInput = $('.page_input');
        maxPage = parseInt(pageInput.attr('max') || '1', 10);
        currPage = parseInt(pageInput.attr('value') || '1', 10);

        return;
      }
    }

    const reply = {} as IReply;

    reply.avatar = $(elem).find('.avatar').attr('src') || '';
    reply.author = $(elem).find('.dark').text();
    reply.createdAt = parser.parseDatetime(
      $(elem).find('.ago').attr('title') || '',
    );
    reply.thanks = parseInt($(elem).find('.small.fade').text() || '0', 10);
    reply.no = parseInt($(elem).find('.no').text() || '0', 10);

    reply.content = $(elem).find('.reply_content').html() || '';

    reply.thanked =
      $(elem).find('.thank_area.thanked').text().indexOf('感谢已发送') !== -1;

    const idTextArray = $(elem).attr('id')?.split('_');

    reply.id = parseInt(idTextArray?.length === 2 ? idTextArray[1] : '0', 10);

    replyList.push(reply);
  });

  return { replyList, replyCount, lastReplyDatetime, maxPage, currPage };
};

export interface ITopicDetailsResponse {
  unread: number;
  myFavNodeCount: number;
  myFavTopicCount: number;
  myFollowingCount: number;
  topic: ITopic;
  replyList: IReply[];
  maxPage: number;
  currPage: number;
  once: string;
}

export const fetchTopicDetails = async (
  id: number,
  page: number = 1,
): Promise<ITopicDetailsResponse> => {
  const response = await instance.get(`/t/${id}?p=${page}`);

  const $ = cheerio.load(response.data);

  const topicDetails = parseTopicDetails($);
  const {
    replyList,
    replyCount,
    lastReplyDatetime,
    maxPage,
    currPage,
  } = parseReplyInfo($);

  const once = $(`input[name='once']`).attr('value') || '';

  const topic: ITopic = {
    id,
    replyCount,
    lastReplyDatetime,
    ...topicDetails,
  };

  const userBox = $('#Rightbar > .box');

  const userBoxInfo = parser.parseUserBox(userBox);

  return { topic, replyList, maxPage, currPage, once, ...userBoxInfo };
};

export interface IReplyResponse {
  problemList: Array<string>;
  replyList: Array<IReply>;
  once: string;
  topic: ITopic;
}

export const replyByTopicId = async (
  topicId: number,
  content: string,
  once: string,
): Promise<IReplyResponse> => {
  const response = await instance.post(`t/${topicId}`, null, {
    params: { content, once },
  });

  const $ = cheerio.load(response.data);

  const problemList: Array<string> = [];

  const problemSelector = $('.problem > ul > li');

  problemSelector.each((_, elem) => {
    problemList.push($(elem).text());
  });

  const newOnce = $(`input[name='once']`).attr('value') || '';

  const topicDetails = parseTopicDetails($);
  const { replyList, replyCount, lastReplyDatetime } = parseReplyInfo($);

  const topic: ITopic = {
    id: topicId,
    replyCount,
    lastReplyDatetime,
    ...topicDetails,
  };

  return { problemList, replyList, topic, once: newOnce };
};
