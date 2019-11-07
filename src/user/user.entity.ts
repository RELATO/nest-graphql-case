import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  BeforeInsert,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';

import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

// import { IdeaEntity } from '../idea/idea.entity';
import { UserRO } from './user.dto';

@ObjectType()
@Entity('user')
export class UserEntity {
  // @PrimaryGeneratedColumn('uuid')
  // id: string;

  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @CreateDateColumn()
  created: Date;

  @Field()
  @Column({
    length: 100,
    unique: true,
  })
  username: string;

  @Column({length: 150})
  password: string;

  // @OneToMany(type => IdeaEntity, idea => idea.author, { cascade: true })
  // ideas: IdeaEntity[];

  // @ManyToMany(type => IdeaEntity, { cascade: true })
  // @JoinTable()
  // bookmarks: IdeaEntity[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  async comparePassword(attempt: string): Promise<boolean> {
    return await bcrypt.compare(attempt, this.password);
  }

  toResponseObject(showToken: boolean = true): UserRO {
    const { id, created, username, token } = this;
    const responseObject: UserRO = {
      id,
      created,
      username,
    };

    // if (this.ideas) {
    //   responseObject.ideas = this.ideas;
    // }

    // if (this.bookmarks) {
    //   responseObject.bookmarks = this.bookmarks;
    // }

    if (showToken) {
      responseObject.token = token;
    }

    return responseObject;
  }

  private get token(): string {
    const { id, username } = this;

    return jwt.sign(
      {
        id,
        username,
      },
      process.env.SECRET,
      { expiresIn: '7d' },
    );
  }
}