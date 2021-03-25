import { IBaseNode } from '@/interfaces/node';
import cheerio from 'cheerio';
import instance from '../request';

export interface ICateNodes {
  category: string;
  nodeList: Array<IBaseNode>;
}

export type TIndexNodesResponse = Array<ICateNodes>;

export const fetchIndexNodes = async (): Promise<TIndexNodesResponse> => {
  const response = await instance.get('/');
  const $ = cheerio.load(response.data);

  const box = $('#Main > .box:last-child');

  const cateSelector = box.find('.cell');

  const list = [] as Array<ICateNodes>;

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
        name: $(nodeSelector).attr('href') || '',
        title: $(nodeSelector).text(),
      });
    });

    list.push({
      category: cate,
      nodeList,
    });
  });

  return list;
};
