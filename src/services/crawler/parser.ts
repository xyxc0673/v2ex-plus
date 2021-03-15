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

export const parseDatetime = (datetime: string) => {
  return datetime.replace('+08:00', '').trim();
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
