import { performance } from 'perf_hooks';
import { publishKafkaOps, publishKafkaLatency, publishKafkaError } from '../../helpers/monitoringHelper';

export default function KafkaLatencyDecorator(
	target: any,
	propertyKey: string,
	descriptor: PropertyDescriptor,
): PropertyDescriptor {
	const originalMethod = descriptor.value;
	if (typeof originalMethod === 'function') {
		descriptor.value = function descriptorFunction(...arguments_: any) {
			const start = performance.now();

			const metricName = `${propertyKey}`;
			publishKafkaOps(metricName);
			return originalMethod
				.apply(this, arguments_)
				.then((data: any) => {
					publishKafkaLatency(
						metricName,
						performance.now() - start,
					);
					return data;
				})
				.catch((error: Error) => {
					publishKafkaError(`${metricName}.${error.name || ''}`);
					throw error;
				});
		};
	}

	return descriptor;
}
