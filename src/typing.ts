export interface TreeData {
  name: string;
  key: string;
  type: string;
  collapsed?: boolean;
  children: Array<TreeData>;
  parent?: TreeData;
  checked?: boolean;
}
