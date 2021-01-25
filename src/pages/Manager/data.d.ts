export type TableListItem = {
  id: number;
  name: string;
  realname: string;
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
  id?: number;
  name?: string;
  realname?: string;
  pageSize?: number;
  current?: number;
};
