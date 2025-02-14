import ResponseUtil from "../utils/response-util";
import LoggerUtil, {ILogger} from "../utils/logger";
import { ProcessDescription } from "pm2";
const pm2 = require("pm2")

const logger: ILogger = LoggerUtil.get("ServerController");
export default class ServerController {

  static async ServerShutDown(request: any, res: any, next: any){
    let reqData = request.body;
    logger.info(`[ServerShutDown] Received shutdown request ${JSON.stringify(reqData)}`);
    pm2.list(function(err: Error, processList: ProcessDescription[]) {
      if(err) {
        logger.error("[ServerShutDown] Unable to get all pm2 processes: %s", err);
        return;
      }

      logger.info(`[ServerShutDown] Obtained pm2 processes: ${ processList && processList.length || 'No process returned'}`);
      if(!processList) {
        return;
      }
      processList.forEach(processDescription => {
        logger.info(`[ServerShutDown] pm2 ProcessDescription: pid: ${processDescription.pid} : pm2 id:${processDescription.pm_id} name ${processDescription.name}`);
        if(processDescription.name !== 'apollo') {
          return;
        }

        if (processDescription.pm_id !== undefined) {
          pm2.sendDataToProcessId(processDescription.pm_id, {
            data: {
              reqData: reqData
            },
            topic: 'shutdown',
            id: processDescription.pm_id
          }, function(err: Error, res: any) {
            if (err) {
              logger.error(`[ServerShutDown] Failed: sendDataToProcessId: ${processDescription.pid}`);
              return;
            }

            logger.info(`[ServerShutDown] Success: sendDataToProcessId ${processDescription.pid}`);
          });
        }

      });
    });

    ResponseUtil.sendSuccessResponse(res, {})
  }

}
