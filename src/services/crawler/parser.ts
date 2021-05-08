import { ITopic } from '@/interfaces/topic';
import cheerio from 'cheerio';

export const getTopicId = (link?: string): number => {
  const id =
    link?.slice(link.lastIndexOf('/') + 1, link.lastIndexOf('#') + 1) || '';
  return parseInt(id || '', 10);
};

export const getNodeName = (link?: string): string => {
  const nodeName = link?.slice(link.lastIndexOf('/') + 1) || '';
  return nodeName;
};

export const getUserInfo = (html: string) => {
  const $ = cheerio.load(html);

  const userBox = $('#Rightbar > .box').first();
  const avatar = userBox.find('.avatar').attr('src') || '';
  const username = userBox
    .find('table:nth-child(1) > tbody > tr > td:nth-child(3) > span > a')
    .text();

  return { avatar, username };
};

export const parseDatetime = (datetime: string | undefined) => {
  return datetime ? datetime.replace('+08:00', '').trim() : '';
};

export const parseTopicList = (
  $: cheerio.Root,
  topicListHtml: cheerio.Cheerio,
) => {
  const topicList = [] as Array<ITopic>;

  topicListHtml.each((_, elem) => {
    const selector = $(elem);

    const title = selector.find('.topic-link').text();
    const titleHref = selector.find('.topic-link').attr('href');
    const topicId = getTopicId(titleHref);

    const replyCount =
      selector.find('.count_livid').text() ||
      selector.find('.count_orange').text() ||
      '0';

    const avatar = selector.find('.avatar').attr('src') || '';
    const topicInfo = selector.find('.topic_info');
    const vote = $(topicInfo.find('.votes')).text() || '0';

    const node = $(topicInfo.find('.node'));
    const nodeTitle = node.text();
    const nodeHref = node.attr('href');
    const nodeName = getNodeName(nodeHref);

    let datetime = '';
    let author = '';

    if (nodeName) {
      author = topicInfo.children(':nth-child(3)').text();
      datetime = topicInfo.children(':nth-child(4)').attr('title') || '';
    } else {
      author = topicInfo.children(':nth-child(1)').text();
      datetime = topicInfo.children(':nth-child(2)').attr('title') || '';
    }

    const lastReplyDatetime =
      datetime?.slice(0, datetime.lastIndexOf(' ')) || '';
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
      lastReplyDatetime,
      lastRepliedBy,
    });
  });

  return topicList;
};

export interface IUserBox {
  unread: number;
  myFavNodeCount: number;
  myFavTopicCount: number;
  myFollowingCount: number;
}

export const parseUserBox = (box: cheerio.Cheerio): IUserBox => {
  const unreadText = box.find('a[href="/notifications"]').text();

  const unread = unreadText.split(' ')[0];

  const myFavNodeCount = box.find('a[href="/my/nodes"] > .bigger').text();

  const myFavTopicCount = box.find('a[href="/my/topics"] > .bigger').text();

  const myFollowingCount = box.find('a[href="/my/following"] > .bigger').text();

  return {
    unread: parseInt(unread, 10),
    myFavNodeCount: parseInt(myFavNodeCount, 10),
    myFavTopicCount: parseInt(myFavTopicCount, 10),
    myFollowingCount: parseInt(myFollowingCount, 10),
  };
};
