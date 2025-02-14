import { performance } from 'perf_hooks';
import MonitoringHelper from '../monitoring-helper';

export default function SocketMessageTracingDecorator(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor,
): PropertyDescriptor {
  const originalMethod = descriptor.value;
  if (typeof originalMethod === 'function') {
    descriptor.value = function descriptorFunction(...arguments_: any) {
      const start = performance.now();
      const metricName = `${propertyKey}.${arguments_[0]}`;
      MonitoringHelper.publishSocketOps(metricName);
      return originalMethod
        .apply(this, arguments_)
        .then((data: any) => {
          MonitoringHelper.publishSocketEventVolume(
            metricName
          );
          MonitoringHelper.publishSocketEventLatency(
            metricName,
            performance.now() - start,
          );
          return data;
        })
        .catch((error: any) => {
          MonitoringHelper.publishSocketError(
            `${metricName}.${error?.name || ''}`,
          );
          throw error;
        });
    };
  }

  return descriptor;
}
