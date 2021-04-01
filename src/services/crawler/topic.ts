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

export const fetchTopicsByNode = async (
  tab: string = 'all',
  page: number = 1,
) => {
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

export const fetchTopicDetails = async (id: number, page: number = 1) => {
  const response = await instance.get(`/t/${id}?p=${page}`);

  const $ = cheerio.load(response.data);

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

  const isCollect = collectUrl.indexOf('unfavourite') !== -1;

  const box = $('#Main > .box:nth-child(4)');

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

  const replyList = [] as Array<IReply>;
  const replyHtml = $(box).find('.cell');

  let replyCount = 0;
  let lastReplyDatetime = '';

  replyHtml.each((index, elem) => {
    // 第一行为帖子信息
    if (index === 0) {
      const topicInfo = $(elem).find('.gray').text().split('•');
      replyCount = parseInt(topicInfo[0].replace('replies', '').trim(), 10);
      lastReplyDatetime = parser.parseDatetime(topicInfo[1]);
      return;
    }

    // 帖子大于 100 条回复时，第二行为页码
    if (index === 1 && replyCount > 100) {
      return;
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

    replyList.push(reply);
  });

  const once = $(`input[name='once']`).attr('value') || '';

  const topic: ITopic = {
    id,
    title,
    createdAt,
    content,
    via,
    isCollect,
    vote,
    views,
    likes,
    thanks,
    replyCount,
    lastReplyDatetime,
    supplementList,
    nodeName,
    nodeTitle,
    avatar,
    author,
  };

  return { topic, replyList, once };
};
