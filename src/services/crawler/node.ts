import { IBaseNode, INodeSection } from '@/interfaces/node';
import cheerio from 'cheerio';
import * as parser from './parser';
import instance from '../request';

export type TIndexNodesResponse = Array<INodeSection>;

export const fetchIndexNodes = async (): Promise<TIndexNodesResponse> => {
  const response = await instance.get('/');
  const $ = cheerio.load(response.data);

  const box = $('#Main > .box:last-child');

  const cateSelector = box.children('div');

  const list = [] as Array<INodeSection>;

  cateSelector.each((index, elem) => {
    // The first elem is the header
    if (index === 0) {
      return;
    }

    const cate = $(elem).find('.fade').text();

    const nodeList = [] as Array<IBaseNode>;

    const nodeListSelector = $(elem).find('a');

    nodeListSelector.each((_, nodeSelector) => {
      nodeList.push({
        name: parser.getNodeName($(nodeSelector).attr('href')),
        title: $(nodeSelector).text(),
      });
    });

    list.push({
      key: cate,
      data: [nodeList],
    });
  });

  return list;
};
