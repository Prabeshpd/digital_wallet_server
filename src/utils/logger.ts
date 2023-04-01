import pino, { Logger, LoggerOptions, DestinationStream } from 'pino';

const logger = pino();

/**
 * Returns the child logger instance that has the properties passed in as args.
 *
 * @param {Mapping<any>} [bindings = {}]
 * @returns {Logger<LoggerOptions | DestinationStream>} logger
 */
function childLogger(bindings: any = {}): Logger<LoggerOptions | DestinationStream> {
  const logBindings = { ...bindings };

  return logger.child(logBindings);
}

export { logger as default, childLogger };
