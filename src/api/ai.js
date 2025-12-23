import http from "./ai_request.js";
//为http增加请求前缀read_notes
const baseURL = "/rag";

export const aiSendSearch=(data) => {
    return http({
        url: `${baseURL}/agent/nl_recommend`,
        method: "post",
        data: data
    });
};

export const aiReceiveSearch = async (params) => {
    try {
        const queryString = new URLSearchParams(params).toString();
        const url = `/ai/rag/agent/nl_recommend_status?${queryString}`;

        console.log('请求SSE流式接口:', url);

        // 对于SSE流式响应，使用EventSource更合适
        // 但如果必须用fetch，需要正确配置
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'text/event-stream', // 明确表示接受SSE
                'Cache-Control': 'no-cache',
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }

        return response; // 返回Response对象用于流式读取

    } catch (error) {
        console.error('SSE请求错误:', error);
        throw error;
    }
}