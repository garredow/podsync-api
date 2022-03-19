import { makeExecutableSchema } from '@graphql-tools/schema';
import Fastify, { FastifyReply, FastifyRequest } from 'fastify';
import verify from 'fastify-auth0-verify';
import { resolvers as scalarResolvers, typeDefs as scalarTypeDefs } from 'graphql-scalars';
import mercurius from 'mercurius';
import { LoggerOptions } from 'pino';
import { Database } from './database/db';
import { resolvers } from './graphql/resolvers';
import { Artwork } from './graphql/types/Artwork';
import { Category } from './graphql/types/Category';
import { Episode } from './graphql/types/Episode';
import { Health } from './graphql/types/Health';
import { Mutation } from './graphql/types/Mutation';
import { Palette } from './graphql/types/Palette';
import { Podcast } from './graphql/types/Podcast';
import { Query } from './graphql/types/Query';
import { User } from './graphql/types/User';
import { config } from './lib/config';
import { verifyToken } from './lib/jwt';
import { Data } from './services/data';

const db = new Database();
const dataClient = new Data(db);

const buildContext = async (req: FastifyRequest, reply: FastifyReply) => {
  const res = await verifyToken(req.headers.authorization).catch(() => {});

  const userId = res?.sub;
  if (!userId) {
    throw new mercurius.ErrorWithProps('There was an issue with your token', undefined, 401);
  }

  return {
    userId,
    dataClient,
  };
};

type PromiseType<T> = T extends PromiseLike<infer U> ? U : T;
declare module 'mercurius' {
  interface MercuriusContext extends PromiseType<ReturnType<typeof buildContext>> {}
}

const logger: LoggerOptions = {
  enabled: config.logger.enabled,
  name: 'foxcasts-cloud-api',
  level: config.logger.level,
  formatters: {
    level: (label: string) => ({ level: label }),
  },
  timestamp: () => `,"time":"${new Date().toISOString()}"`,
};

export function configureServer() {
  const fastify = Fastify({
    logger: logger as any,
  });

  fastify.register(require('fastify-cors'));

  fastify.register(verify, {
    domain: config.auth0.domain,
    audience: config.auth0.audience,
  });

  fastify.register(function (instance, _options, done) {
    instance.get('/verify', {
      handler: function (request, reply) {
        reply.send(request.user);
      },
      preValidation: instance.authenticate,
    });

    done();
  });

  fastify.register(mercurius, {
    schema: makeExecutableSchema({
      typeDefs: [
        ...scalarTypeDefs,
        Query,
        Mutation,
        Artwork,
        Palette,
        Podcast,
        Episode,
        Category,
        User,
        Health,
      ],
      resolvers: {
        ...scalarResolvers,
        ...resolvers,
      } as any,
    }),
    context: buildContext,
    graphiql: true,
  });

  return fastify;
}
