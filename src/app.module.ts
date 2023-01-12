import { ApolloDriver } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import { join } from 'path';

import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { ItemsModule } from './items/items.module';
import { ListsModule } from './lists/lists.module';
import { SeedModule } from './seed/seed.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    // GraphQl

    /**
     * Basic GrapQLModule configuration:
     * GraphQLModule.forRoot<ApolloDriverConfig>({
     * autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
     * driver: ApolloDriver,
     * playground: false,
     * plugins: [ApolloServerPluginLandingPageLocalDefault],
     * }),
     */

    // Async GraphQlModule configuration:
    GraphQLModule.forRootAsync({
      driver: ApolloDriver,
      imports: [AuthModule],
      inject: [JwtService],
      useFactory: async (jwtService: JwtService) => ({
        autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
        playground: false,
        plugins: [ApolloServerPluginLandingPageLocalDefault],
        context({ req }) {
          /**
           * To hide the schema without a valid token.
           * const token = req.header.authorization?.replace('Bearer ', '');
           * if (!token) throw new Error('Token needed');
           * const payload = jwtService.decode(token);
           * if (!payload) throw new Error('Token not valid');
           */
        },
      }),
    }),

    // TypeOrm
    TypeOrmModule.forRoot({
      autoLoadEntities: true,
      database: process.env.DB_NAME,
      host: process.env.DB_HOST,
      password: process.env.DB_PASSWORD,
      port: +process.env.DB_PORT,
      synchronize: true,
      type: 'postgres',
      username: process.env.DB_USERNAME,
    }),
    // Modules
    AuthModule,
    CommonModule,
    ItemsModule,
    ListsModule,
    SeedModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
