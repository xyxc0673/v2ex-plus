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
