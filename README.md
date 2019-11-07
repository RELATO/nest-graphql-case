# NestJS GraphQL Case

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

## Goal

The goal of this repository is to demonstrate the error below

```
[Nest] 7098   - 11/07/2019, 10:49:37 AM   [InstanceLoader] TypeOrmCoreModule dependencies initialized +134ms
[Nest] 7098   - 11/07/2019, 10:49:37 AM   [InstanceLoader] TypeOrmModule dependencies initialized +1ms
[Nest] 7098   - 11/07/2019, 10:49:37 AM   [InstanceLoader] UserModule dependencies initialized +2ms
[Nest] 7098   - 11/07/2019, 10:49:37 AM   [RoutesResolver] AppController {/}: +9ms
[Nest] 7098   - 11/07/2019, 10:49:37 AM   [RouterExplorer] Mapped {/, GET} route +6ms
[Nest] 7098   - 11/07/2019, 10:49:37 AM   [RoutesResolver] UserController {/}: +1ms
[Nest] 7098   - 11/07/2019, 10:49:37 AM   [RouterExplorer] Mapped {/api/users, GET} route +2ms
[Nest] 7098   - 11/07/2019, 10:49:37 AM   [RouterExplorer] Mapped {/api/users/:username, GET} route +2ms
[Nest] 7098   - 11/07/2019, 10:49:37 AM   [RouterExplorer] Mapped {/auth/whoami, GET} route +1ms
[Nest] 7098   - 11/07/2019, 10:49:37 AM   [RouterExplorer] Mapped {/auth/login, POST} route +1ms
[Nest] 7098   - 11/07/2019, 10:49:37 AM   [RouterExplorer] Mapped {/auth/register, POST} route +1ms
(node:7098) UnhandledPromiseRejectionWarning: Error: Query.users defined in resolvers, but not in schema
(node:7098) UnhandledPromiseRejectionWarning: Unhandled promise rejection. This error originated either by throwing inside of an async function without a catch block, or by rejecting a promise which was not handled with .catch(). (rejection id: 1)
(node:7098) [DEP0018] DeprecationWarning: Unhandled promise rejections are deprecated. In the future, promise rejections that are not handled will terminate the Node.js process with a non-zero exit code.

```

## Explaining the cenario

This project was created based on NestJS oficial samples below

[GraphQL-Apollo](https://github.com/nestjs/nest/tree/master/sample/12-graphql-apollo)
and
[Type-GraphQL](https://github.com/nestjs/nest/tree/master/sample/23-type-graphql)

### app.module.ts
```
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
```

Using the above code causes the error but when running the isolated approaches as showed at NestJS samples the errors did not happen.

## Cenario 1 - Graphql Apollo

Now you need to comment the  
> // autoSchemaFile: 'schema.gql',
> // RecipesModule,
```
@Module({
  imports: [
    TypeOrmModule.forRoot(),
    GraphQLModule.forRoot({
      typePaths: ['./**/*.graphql'],
      context: ({ req }) => ({ headers: req.headers }),
      installSubscriptionHandlers: true,
      // autoSchemaFile: 'schema.gql',
    }),
    ApiModule,
    // RecipesModule,
  ],
  controllers: [AppController],
  providers: [DateScalar],
})
```
## Cenario 2 - Type-graphql
Now you need to comment the  
> // typePaths: ['./**/*.graphql'],
> // ApiModule,
```
@Module({
  imports: [
    TypeOrmModule.forRoot(),
    GraphQLModule.forRoot({
      // typePaths: ['./**/*.graphql'],
      context: ({ req }) => ({ headers: req.headers }),
      installSubscriptionHandlers: true,
      autoSchemaFile: 'schema.gql',
    }),
    // ApiModule,
    RecipesModule,
  ],
  controllers: [AppController],
  providers: [DateScalar],
})
```

> Does anyone knows how to solve such problem?

## Running the code using MySQL containerized version ( for development purposes )

> We are defining the root password to "ChangeIt" on the exemple below
```
docker run --name mysqldev -e MYSQL_ROOT_PASSWORD=ChangeIt -d -p3306:3306 mysql:5.6
```

> Testing
```
docker exec -it mysqldev bash
mysql -uroot -p 
```