import { performance } from 'perf_hooks';
import MonitoringHelper from '../monitoring-helper';

export const BaseClientLatencyDecorator = (client: string) => (
	target: any,
	propertyKey: string,
	descriptor: PropertyDescriptor,
): PropertyDescriptor => {
	const originalMethod = descriptor.value;
	if (typeof originalMethod === 'function') {
		descriptor.value = function descriptorFunction(...arguments_: any) {
			const start = performance.now();

			const metricName = `${propertyKey}`;
			MonitoringHelper.publishClientOps(client, metricName);
			return originalMethod
				.apply(this, arguments_)
				.then((data: any) => {
					MonitoringHelper.publishClientLatency(
						client,
						metricName,
						performance.now() - start,
					);
					return data;
				})
				.catch((error: any) => {
					MonitoringHelper.publishClientError(client, `${metricName}.${error.name}`);
					throw error;
				});
		};
	}

	return descriptor;
}
