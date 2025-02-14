export default class gsBaseClient {

    static async sendGetRequestAsync(restClient: any, url: string, timeout?: number, request?: any) {
        const response = await restClient.sendGetRequestAsync(url, timeout, request);
        if (response.status === "error") {
            throw response;
        } else if (response.status === "terminate") {
            throw response;
        } else {
            return response;
        }
    }

    static async sendGetRequestWithHeaders(restClient: any,url: string, headers: any, timeout?: number, request?: any){
        const response = await restClient.sendGetRequestWithHeaders(url, headers, timeout, request);
        if (response.status === "error") {
            throw response;
        } else if (response.status === "terminate") {
            throw response;
        } else {
            return response;
        }
    }

    static async sendPostRequestAsync(restClient: any, url: string, request: any) {
        const response = await restClient.sendPostRequestAsync(url, request);
        if (response.status === "error") {
            throw response;
        } else if (response.status === "terminate") {
            throw response;
        } else {
            return response;
        }
    }

    static async sendPostRequestWithHeaders(restClient: any, url: string, request: any, headers: any) {
        const response = await restClient.sendPostRequestWithHeaders(url, request,headers);
        if (response.status === "error") {
            throw response;
        } else if (response.status === "terminate") {
            throw response;
        } else {
            return response;
        }
    }

    static async sendPutRequestAsync(restClient: any, url: string, request: any) {
        const response = await restClient.sendPutRequestAsync(url, request);
        if (response.status === "error") {
            throw response;
        } else if (response.status === "terminate") {
            throw response;
        } else {
            return response;
        }
    }

    static async sendDeleteRequestAsync(restClient: any, url: string, request: any) {
        const response = await restClient.sendDeleteRequestAsync(url, request);
        if (response.status === "error") {
            throw response;
        } else if (response.status === "terminate") {
            throw response;
        } else {
            return response;
        }
    }
};