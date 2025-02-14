import {MonitoringConfig} from '../config/config';

const SDC = require('statsd-client');

let sdc: any;

class MonitoringHelper {
	public static init(config: MonitoringConfig): void {
		sdc = new SDC({
			host: config.Endpoint,
			port: config.Port,
			prefix: config.Prefix,
		});
	}

	public static publishApiError(name: string): void {
		sdc.timing(`error.api.${name}`, 1);
	}

	public static publishApiLatency(name: string, startTime: number): void {
		sdc.timing(`api.latency.${name}`, Date.now() - startTime);
	}

	public static publishApiOps(name: string): void {
		sdc.timing(`api.ops.${name}`, 1);
	}

	public static publishAnomaly(name: string): void {
		sdc.timing(`anomaly.${name}`, 1);
	}

	public static publishDBError(name: string): void {
		sdc.timing(`error.db.${name}`, 1);
	}

	public static publishDBLatency(name: string, time: number): void {
		sdc.timing(`db.latency.${name}`, time);
	}

	public static publishDBOps(name: string): void {
		sdc.timing(`db.ops.${name}`, 1);
	}

	public static publishUncaughtException(name: string): void {
		sdc.increment(`app.uncaughtException.${name}`, 1);
	}

	public static publishServerStartFailed(): void {
		sdc.increment(`app.serverStart.failed`, 1);
	}

	public static publishServerStartSuccess(): void {
		sdc.increment(`app.serverStart.success`, 1);
	}

	public static publishClientOps(client: string, name: string): void {
		sdc.timing(`client.${client}.ops.${name}`, 1);
	}

	public static publishClientLatency(client: string, name: string, time: number): void {
		sdc.timing(`client.${client}.latency.${name}`, time);
	}

	public static publishClientError(client: string, name: string): void {
		sdc.timing(`client.${client}.error.${name}`, 1);
	}

	public static publishClientHttpStatusCode(statusCode: string): void {
		sdc.timing(`client.httpstatus.${statusCode}`, 1);
	}

	public static publishClientUrlHttpStatusCode(url: string, statusCode: string): void {
		sdc.timing(`client.urlhttpstatus.${url}.${statusCode}`, 1);
	}

	// Socket
	public static publishSocketOps(name: string): void {
		sdc.timing(`socket.ops.${name}`, 1);
	}

	public static publishSocketError(name: string): void {
		sdc.increment(`socket.error.${name}`, 1);
	}

	public static publishSocketEventVolume(name: string): void {
		sdc.increment(`socket.event.volume.${name}`, 1);
	}

	public static publishSocketEventLatency(name: string, time: number): void {
		sdc.timing(`socket.event.latency.${name}`, time);
	}
}

export default MonitoringHelper;
