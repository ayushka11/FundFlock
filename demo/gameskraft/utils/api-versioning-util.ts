export default class ApiVersioningUtil {

    static generateRandomNumber() {
        return Math.floor((Math.random() * 100) + 1);
    }

    static getApiRoute(rolloutPercentage: number) {
        return this.generateRandomNumber() <= rolloutPercentage;
    }
    
    // this supports only 2 apis as of now
    static getApiBasedOnPercentage(rolloutPercentage: number = 0,apiArray:any[],functionArguements:any[]){
        if(this.getApiRoute(rolloutPercentage)){
            return apiArray[1](...functionArguements);
        }
        return apiArray[0](...functionArguements);
        
    }
}