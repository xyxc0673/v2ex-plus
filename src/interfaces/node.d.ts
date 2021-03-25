export interface IBaseNode {
  name: string;
  title: string;
}

export interface INode {
  id: number;
  name: string;
  aliases: Array<any>;
  avatar_mini: string;
  avatar_normal: string;
  avatar_large: string;
  footer: string;
  header: string;
  parent_node_name: string;
  root: false;
  stars: number;
  title: string;
  title_alternative: string;
  topics: number;
  url: string;
}
