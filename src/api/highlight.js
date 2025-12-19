import http from "./request.js";

// 高亮相关 API
http.defaults.baseURL = "/api/read_notes/light";

/**
 * 创建高亮
 * @param {Object} data - 高亮数据
 * @param {number} data.user_id - 用户ID
 * @param {number} data.paper_id - 论文ID（关联paper表）
 * @param {string} data.paper_title - 论文标题（可选，冗余字段）
 * @param {number} data.page_index - 页面索引
 * @param {string} data.highlighted_text - 高亮的文字内容
 * @param {Object} data.position_data - 位置信息（包含rects数组）
 * @param {string} data.color - 高亮颜色（可选，默认#ffff00）
 * @param {number} data.opacity - 透明度（可选，默认0.30）
 * @param {string} data.note - 备注（可选）
 * @returns {Promise}
 */
export const createHighlight = (data) => {
  return 'aaa'
  // return http({
  //   url: `${baseURL}/createHighlight`,
  //   method: "post",
  //   data: data
  // });
};

/**
 * 获取论文的所有高亮
 * @param {number} paper_id - 论文ID
 * @param {number} user_id - 用户ID（可选，如果提供则只返回该用户的高亮）
 * @returns {Promise}
 */
export const getPaperHighlights = (paper_id, user_id = null) => {
  return http({
    url: `/${paper_id}`,
    method: "get",
  });
};

/**
 * 删除高亮
 * @param {number} highlight_id - 高亮ID
 * @returns {Promise}
 */
export const deleteHighlight = (highlight_id) => {
  return http({
    url: `${baseURL}/delete/${highlight_id}`,
    method: "delete"
  });
};

/**
 * 清除论文的所有高亮
 * @param {number} paper_id - 论文ID
 * @param {number} user_id - 用户ID（可选，如果提供则只清除该用户的高亮）
 * @returns {Promise}
 */
export const clearPaperHighlights = (paper_id, user_id = null) => {
  const data = user_id ? { user_id } : {};
  return http({
    url: `${baseURL}/clear-paper/${paper_id}`,
    method: "post",
    data: data
  });
};

