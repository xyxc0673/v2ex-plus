import { IReply } from '@/interfaces/reply';
import { ISubtle, ITopic } from '@/interfaces/topic';
import cheerio from 'cheerio';
import { parser } from '.';
import instance from '../request';

export const fetchTopicByTab = async (
  tab: string = 'all',
): Promise<Array<ITopic>> => {
  const response = await instance.get(`/?tab=${tab}`);
  const $ = cheerio.load(response.data);
  const list = $('.cell.item');

  const topicList = [] as Array<ITopic>;

  list.each((_, elem) => {
    const selector = $(elem);

    const title = selector.find('.topic-link').text();
    const titleHref = selector.find('.topic-link').attr('href');
    const topicId = parser.getTopicId(titleHref);

    const replyCount = selector.find('.count_livid').text() || '0';
    const avatar = selector.find('.avatar').attr('src') || '';
    const topicInfo = selector.find('.topic_info');
    const vote = $(topicInfo.find('.votes')).text() || '0';

    const node = $(topicInfo.find('.node'));
    const nodeTitle = node.text();
    const nodeHref = node.attr('href');
    const nodeName = parser.getNodeName(nodeHref);

    const author = topicInfo.children(':nth-child(3)').text();
    const createdAtOrigin = topicInfo.children(':nth-child(4)').attr('title');
    const createdAt =
      createdAtOrigin?.slice(0, createdAtOrigin.lastIndexOf(' ')) || '';
    const lastRepliedBy = topicInfo.children(':nth-child(5)').text() || '';

    topicList.push({
      id: topicId,
      title,
      replyCount: parseInt(replyCount, 10),
      avatar,
      vote: parseInt(vote, 10),
      nodeName,
      nodeTitle,
      author,
      createdAt,
      lastRepliedBy,
    });
  });

  return topicList;
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

  const subtlesSelector = $('.subtle');

  const subtleList = [] as Array<ISubtle>;

  subtlesSelector.each((_, elem) => {
    const subtle = {
      createdAt: parser.parseDatetime(
        $(elem).find('.fade>span').attr('title') || '',
      ),
      content: $(elem).find('.topic_content').html() || '',
    };
    subtleList.push(subtle);
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

  const topic = {
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
    subtleList,
    nodeName,
    nodeTitle,
    avatar,
    author,
  };

  return { topic, replyList };
};
