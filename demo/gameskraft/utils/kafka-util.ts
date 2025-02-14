import {Producer} from "butterfly";
import {Message} from "kafkajs";
import Config, {ProducerConfig} from "../config/config";
import {logger} from "./logger";
import KafkaLatencyDecorator from "./monitoring/kafka-latency-decorator";

export default class KafkaUtil {

  private static producer: Producer.Producer;

  public static async init(config: ProducerConfig): Promise<void> {
    const producerConfig: Producer.ProducerConfig = this.getProducerConfig(config);
    this.producer = new Producer.Producer(producerConfig, logger);

    await this.producer.start();
  }

  private static getProducerConfig(config: ProducerConfig) {
    return new Producer.ProducerConfig(
      config.Brokers,
      Config.getAppName(),
      '0',
      logger,
    );
  }

  @KafkaLatencyDecorator
  public static async sendMessage(topic: string, message: Message): Promise<void> {
    const producerRecord = new Producer.ProducerRecord(
      topic,
      [message]
    );
    
    await this.producer.produce(producerRecord);
  }
}