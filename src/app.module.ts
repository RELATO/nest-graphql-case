import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ApiModule } from './api.module';
import { RecipesModule } from './recipes/recipes.module';
import { AppController } from './app.controller';
import { AppGateway } from './app.gateway';
import { DateScalar } from 'shared/date.scalar';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    GraphQLModule.forRoot({
      typePaths: ['./**/*.graphql'],
      context: ({ req }) => ({ headers: req.headers }),
      installSubscriptionHandlers: true,
      autoSchemaFile: 'schema.gql',
    }),
    ApiModule,
    RecipesModule,
  ],
  controllers: [AppController],
  providers: [DateScalar],
})
export class AppModule {}
