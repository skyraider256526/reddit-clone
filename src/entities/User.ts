import { IsEmail, Length } from "class-validator";
import { Entity, Column, Index, BeforeInsert, OneToMany } from "typeorm";

//@ts-ignore
import bcrypt from "bcrypt";
import { Exclude } from "class-transformer";
import RootEntity from "./RootEntity";

import Post from "./Post";
import Vote from "./Vote";

@Entity("users")
export default class User extends RootEntity {
  /**
   * Creates a User
   * @param {User} user A user object
   */
  constructor(user: Partial<User>) {
    super();
    Object.assign(this, user);
  }

  @Index()
  @IsEmail(undefined, { message: "Must be an email" })
  @Length(1, 255, { message: "Email is empty" })
  @Column({ unique: true })
  email: string;

  @Index()
  @Length(3, 255, { message: "Must  be at least 3 characters long" })
  @Column({ unique: true })
  username: string;

  @Length(6, 255, { message: "Must be at least 6 characters long" })
  @Exclude()
  @Column()
  password: string;

  @OneToMany(() => Post, post => post.user)
  posts: Post[];

  @OneToMany(() => Vote, vote => vote.user)
  votes: Vote[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 6);
  }
}
