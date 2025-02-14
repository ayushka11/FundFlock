import LoggerUtil from '../utils/logger';
const redisService = require("../services/redisService");
const logger = LoggerUtil.get('HealthCheckController')

const HealthCheckController = {

  isHealthy(request: any, res: any): void {
    logger.info({requestId: request.requestId}, 'HealthCheckController');
    redisService.getPipeline()
    .ping()
    .exec(function(err, arrRes) {
      logger.info({ err, arrRes }, 'Health Check : Got response from redis js');

      if (arrRes && arrRes[0] && arrRes[0][1] != 'PONG') {
        res.status(503).send('I am sick');
        return;
      }

      // Everything seems all right!
      res.status(200).send('abhi ye api call karna baaki tha..');
    });
  },
};

export default HealthCheckController;
