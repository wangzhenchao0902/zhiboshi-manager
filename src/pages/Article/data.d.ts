export type TableListItem = {
  id: number;
  title: string;
  status: number;
  recommend: number;
  content: string;
  order_number: number;
  category_name: string;
  cover: string;
  preview_url: string;
  category_id: number;
  // disabled?: boolean;
  // href: string;
  // avatar: string;
  // name: string;
  // owner: string;
  // desc: string;
  // callNo: number;
  // status: string;
  // updatedAt: Date;
  // createdAt: Date;
  // progress: number;
};

export type TableListPagination = {
  total: number;
  pageSize: number;
  current: number;
};

export type TableListData = {
  list: TableListItem[];
  pagination: Partial<TableListPagination>;
};

export type TableListParams = {
  title?: string;
  content?: string;
  status?: number;
  cover?: string;
  recommend?: number;
  order_number?: number;
  category_id?: number;
  pageSize?: number;
  current?: number;
};
