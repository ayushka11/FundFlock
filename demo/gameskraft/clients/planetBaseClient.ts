export default class PlanetBaseClient {

    static async sendGetRequestAsync(restClient: any, url: string, timeout?: number, request?: any) {
        const response = await restClient.sendGetRequestAsync(url, timeout, request);
        if (response.status?.success === "false") {
            return response;
        } else if (response.status === "failure") {
            throw response;
        } else {
            return response;
        }
    }
};
