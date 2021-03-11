import { ITopic } from '@/interfaces/topic';
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

    const replyCount = selector.find('.count_livid').text();
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
