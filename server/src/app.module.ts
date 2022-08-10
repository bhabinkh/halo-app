import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { getError } from './common/helper/error';
import { UserModule } from './user/user.module';

@Module({
  imports: [MongooseModule.forRoot(
    `mongodb://localhost:27017/GRAPHQL_NEST_MONGO_APP_V1`,
    // `mongodb+srv://${process.env.MONGO_ATLAS_USER}:${process.env.MONGO_ATLAS_PASSWORD}@bhabinnodejslearn.dquug.mongodb.net/${process.env.MONGO_ATLAS_DB}?retryWrites=true&w=majority`,
  ),
  GraphQLModule.forRoot<ApolloDriverConfig>({
    driver: ApolloDriver,
    autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    sortSchema: true,
    formatError: (err) => {
      let code = err?.extensions?.code.toString()
      const error = getError(code, err.message)
      return error
    }
  }),
    UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
