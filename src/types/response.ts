// 定义接口返回值的类型规范
export interface ApiResponse<T> {
  data: T; // 返回的数据
  msg: string; // 可选的消息
  code: number; // 可选的错误代码
}
