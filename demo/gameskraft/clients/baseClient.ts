export default class BaseClient {

    static async sendGetRequestAsync(restClient: any, url: string, timeout?: number, request?: any) {
        const response = await restClient.sendGetRequestAsync(url, timeout, request);
        if (response.status?.success === "false") {
            throw response.status;
        } else if (response.status === "failure") {
            throw response;
        } else {
            return response;
        }
    }

    static async sendGetRequestWithHeaders(restClient: any, url: string, headers: any, timeout?: number, request?: any) {
        const response = await restClient.sendGetRequestWithHeaders(url, headers, timeout, request);
        if (response.status?.success === "false") {
            throw response.status;
        } else if (response.status === "failure") {
            throw response;
        } else {
            return response;
        }
    }

    static async sendGetRequestWithHeadersAndBody(restClient: any, url: string, headers: any, request?: any, timeout?: number) {
        const response = await restClient.sendGetRequestWithHeaders(url, headers, timeout, request);
        if (response.data?.status?.success === "false") {
            throw response.data?.status;
        } else if (response?.status === "failure") {
            throw response?.status;
        } else {
            return response?.data;
        }
    }

    static async sendPostRequestAsync(restClient: any, url: string, request: any) {
        const response = await restClient.sendPostRequestAsync(url, request);
        if (response.status?.success === "false") {
            throw response.status;
        } else if (response.status === "failure") {
            throw response;
        } else {
            return response;
        }
    }

    static async sendPostRequestWithHeaders(restClient: any, url: string, request: any, headers: any) {
        const response = await restClient.sendPostRequestWithHeaders(url, request, headers);
        if (response.status?.success === "false") {
            throw response.status;
        } else if (response.status === "failure") {
            throw response;
        } else {
            return response;
        }
    }

    static async sendPutRequestWithHeaders(restClient: any, url: string, request: any, headers: any) {
        const response = await restClient.sendPutRequestWithHeaders(url, request, headers);
        if (response.status?.success === "false") {
            throw response.status;
        } else if (response.status === "failure") {
            throw response;
        } else {
            return response;
        }
    }

    static async sendDeleteRequestWithHeaders(restClient: any, url: string, request: any, headers: any) {
        const response = await restClient.sendDeleteRequestWithHeaders(url, request, headers);
        if (response.status?.success === "false") {
            throw response.status;
        } else if (response.status === "failure") {
            throw response;
        } else {
            return response;
        }
    }


    static async sendPutRequestAsync(restClient: any, url: string, request: any) {
        const response = await restClient.sendPutRequestAsync(url, request);
        if (response.status?.success === "false") {
            throw response.status;
        } else if (response.status === "failure") {
            throw response;
        } else {
            return response;
        }
    }

    static async sendDeleteRequestAsync(restClient: any, url: string, request: any) {
        const response = await restClient.sendDeleteRequestAsync(url, request);
        if (response.status?.success === "false") {
            throw response.status;
        } else if (response.status === "failure") {
            throw response;
        } else {
            return response;
        }
    }
};
